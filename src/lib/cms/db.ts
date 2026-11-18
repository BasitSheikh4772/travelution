import { promises as fs } from "node:fs";
import path from "node:path";
import mysql, { type Pool, type PoolConnection, type RowDataPacket } from "mysql2/promise";
import type { Destination, Faq, Lead, Review, Service, SiteInfo, SocialLink, Trip, VisaGuide } from "./types";
import { faqs as dFaqs, destinations as dDest, services as dServices, siteInfo as dSite, trips as dTrips } from "./fallback";

/**
 * MySQL / MariaDB data layer.
 *
 * Connection comes from env: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME.
 * Tables are created automatically on first use, and on the very first run the
 * old data/content.json (if present) is imported once.
 *
 * Uploaded files (videos / images / PDFs) stay on disk in DATA_DIR/uploads.
 */
export const DATA_DIR = path.resolve(/* turbopackIgnore: true */ process.env.DATA_DIR ?? path.join(/* turbopackIgnore: true */ process.cwd(), "data"));
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
const LEGACY_JSON = path.join(DATA_DIR, "content.json");

export type StoredDestination = Omit<Destination, "tripCount" | "image" | "tagline"> & { image?: string; tagline?: string };

export type Db = {
  settings: SiteInfo;
  /** page text overrides: key → value (defaults live in content-schema.ts) */
  content: Record<string, string>;
  reviews: Review[];
  trips: Trip[];
  destinations: StoredDestination[];
  services: Service[];
  visas: VisaGuide[];
  leads: Lead[];
  faqs: Faq[];
};
export type DbKey = keyof Db;

export const ALL_KEYS: DbKey[] = ["settings", "content", "reviews", "trips", "destinations", "services", "visas", "faqs", "leads"];
/** default for readDb/mutateDb: everything except the (potentially large) enquiries table */
export const NO_LEADS: DbKey[] = ALL_KEYS.filter((k) => k !== "leads");

/* ───────────────────────────── table specs ───────────────────────────── */

// s string · u string, NULL → undefined · ns string|null · n number|null · b boolean · j json · d ISO date
type T = "s" | "u" | "ns" | "n" | "b" | "j" | "d";
type Spec = { table: string; cols: [field: string, col: string, type: T][]; positioned: boolean; orderBy: string };

const SPECS = {
  reviews: { table: "reviews", positioned: false, orderBy: "sort_order ASC, created_at ASC", cols: [["id", "id", "s"], ["title", "title", "s"], ["name", "name", "s"], ["quote", "quote", "s"], ["video", "video", "s"], ["poster", "poster", "ns"], ["order", "sort_order", "n"], ["published", "published", "b"], ["createdAt", "created_at", "d"]] },
  trips: { table: "trips", positioned: true, orderBy: "position ASC", cols: [["id", "id", "n"], ["slug", "slug", "s"], ["title", "title", "s"], ["excerpt", "excerpt", "s"], ["description", "description", "u"], ["image", "image", "ns"], ["price", "price", "n"], ["salePrice", "sale_price", "n"], ["currency", "currency", "s"], ["days", "days", "n"], ["nights", "nights", "n"], ["destinationSlugs", "destination_slugs", "j"], ["link", "link", "s"], ["featured", "featured", "b"], ["published", "published", "b"]] },
  destinations: { table: "destinations", positioned: true, orderBy: "position ASC", cols: [["id", "id", "n"], ["slug", "slug", "s"], ["name", "name", "s"], ["image", "image", "u"], ["tagline", "tagline", "u"], ["published", "published", "b"]] },
  services: { table: "services", positioned: true, orderBy: "position ASC", cols: [["id", "id", "s"], ["slug", "slug", "s"], ["title", "title", "s"], ["icon", "icon", "s"], ["summary", "summary", "s"], ["features", "features", "j"], ["href", "href", "s"], ["published", "published", "b"]] },
  visas: { table: "visa_guides", positioned: true, orderBy: "position ASC", cols: [["id", "id", "s"], ["country", "country", "s"], ["file", "file", "s"], ["published", "published", "b"]] },
  faqs: { table: "faqs", positioned: true, orderBy: "position ASC", cols: [["id", "id", "s"], ["question", "question", "s"], ["answer", "answer", "s"], ["published", "published", "b"]] },
  leads: { table: "leads", positioned: false, orderBy: "created_at DESC, id DESC LIMIT 2000", cols: [["id", "id", "s"], ["createdAt", "created_at", "d"], ["topic", "topic", "s"], ["name", "name", "s"], ["email", "email", "s"], ["phone", "phone", "s"], ["message", "message", "s"], ["read", "is_read", "b"]] },
} satisfies Record<string, Spec>;
type CollectionKey = keyof typeof SPECS;

const DDL = [
  "CREATE TABLE IF NOT EXISTS meta (k VARCHAR(64) PRIMARY KEY, v TEXT NULL)",
  "CREATE TABLE IF NOT EXISTS settings (k VARCHAR(64) PRIMARY KEY, v LONGTEXT NOT NULL)",
  "CREATE TABLE IF NOT EXISTS content_overrides (k VARCHAR(120) PRIMARY KEY, v MEDIUMTEXT NOT NULL)",
  `CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(40) PRIMARY KEY, title VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL DEFAULT '', quote TEXT NOT NULL,
    video VARCHAR(1000) NOT NULL, poster VARCHAR(600) NULL, sort_order INT NOT NULL DEFAULT 0, published TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL, KEY idx_sort (sort_order))`,
  `CREATE TABLE IF NOT EXISTS trips (
    id INT PRIMARY KEY, slug VARCHAR(190) NOT NULL, title VARCHAR(255) NOT NULL, excerpt TEXT NOT NULL, description MEDIUMTEXT NULL,
    image VARCHAR(600) NULL, price DECIMAL(14,2) NULL, sale_price DECIMAL(14,2) NULL, currency VARCHAR(8) NOT NULL DEFAULT 'PKR',
    days INT NULL, nights INT NULL, destination_slugs LONGTEXT NOT NULL, link VARCHAR(255) NOT NULL,
    featured TINYINT(1) NOT NULL DEFAULT 0, published TINYINT(1) NOT NULL DEFAULT 1, position INT NOT NULL DEFAULT 0,
    UNIQUE KEY uq_slug (slug), KEY idx_pos (position))`,
  `CREATE TABLE IF NOT EXISTS destinations (
    id INT PRIMARY KEY, slug VARCHAR(190) NOT NULL, name VARCHAR(255) NOT NULL, image VARCHAR(600) NULL, tagline VARCHAR(255) NULL,
    published TINYINT(1) NOT NULL DEFAULT 1, position INT NOT NULL DEFAULT 0, UNIQUE KEY uq_slug (slug), KEY idx_pos (position))`,
  `CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(80) PRIMARY KEY, slug VARCHAR(190) NOT NULL, title VARCHAR(255) NOT NULL, icon VARCHAR(40) NOT NULL, summary TEXT NOT NULL,
    features LONGTEXT NOT NULL, href VARCHAR(255) NOT NULL, published TINYINT(1) NOT NULL DEFAULT 1, position INT NOT NULL DEFAULT 0, KEY idx_pos (position))`,
  `CREATE TABLE IF NOT EXISTS visa_guides (
    id VARCHAR(80) PRIMARY KEY, country VARCHAR(120) NOT NULL, file VARCHAR(600) NOT NULL, published TINYINT(1) NOT NULL DEFAULT 1,
    position INT NOT NULL DEFAULT 0, KEY idx_pos (position))`,
  `CREATE TABLE IF NOT EXISTS faqs (
    id VARCHAR(40) PRIMARY KEY, question VARCHAR(500) NOT NULL, answer TEXT NOT NULL, published TINYINT(1) NOT NULL DEFAULT 1,
    position INT NOT NULL DEFAULT 0, KEY idx_pos (position))`,
  `CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(40) PRIMARY KEY, created_at DATETIME(3) NOT NULL, topic VARCHAR(160) NOT NULL DEFAULT '', name VARCHAR(160) NOT NULL,
    email VARCHAR(200) NOT NULL, phone VARCHAR(80) NOT NULL DEFAULT '', message TEXT NOT NULL, is_read TINYINT(1) NOT NULL DEFAULT 0,
    KEY idx_created (created_at))`,
];

/* ───────────────────────────── connection ───────────────────────────── */

const cfg = () => ({
  host: process.env.DB_HOST ?? process.env.MYSQLHOST ?? "127.0.0.1",
  port: Number(process.env.DB_PORT ?? process.env.MYSQLPORT ?? 3306),
  user: process.env.DB_USER ?? process.env.MYSQLUSER ?? "root",
  password: process.env.DB_PASSWORD ?? process.env.MYSQLPASSWORD ?? "",
  database: process.env.DB_NAME ?? process.env.MYSQLDATABASE ?? "travelution",
});

const g = globalThis as unknown as { __tvPool?: Pool; __tvReady?: Promise<void> };

function pool(): Pool {
  g.__tvPool ??= mysql.createPool({
    ...cfg(),
    waitForConnections: true,
    connectionLimit: 10,
    charset: "utf8mb4",
    timezone: "Z",
    decimalNumbers: true,
  });
  return g.__tvPool;
}

type Q = Pick<PoolConnection, "query">;
const rows = async (q: Q, sql: string, params: unknown[] = []) => (await q.query(sql, params))[0] as RowDataPacket[];

async function setup() {
  const { database, ...rest } = cfg();
  // create the database if the MySQL user is allowed to (ignored otherwise)
  try {
    const c = await mysql.createConnection(rest);
    await c.query(`CREATE DATABASE IF NOT EXISTS \`${database.replace(/`/g, "")}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await c.end();
  } catch (e) {
    if ((e as { code?: string }).code === "ECONNREFUSED") throw new Error(`MySQL is not reachable at ${rest.host}:${rest.port}. Start MySQL (XAMPP → MySQL → Start) and check DB_* in .env.local.`);
  }
  const conn = await pool().getConnection();
  try {
    await conn.query("SELECT GET_LOCK('tv_setup', 60)");
    for (const sql of DDL) await conn.query(`${sql} ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    const [seeded] = await rows(conn, "SELECT v FROM meta WHERE k='seeded'");
    if (!seeded) {
      const initial = await legacyOrDefaults();
      await conn.beginTransaction();
      await persist(conn, emptyDb(), initial, ALL_KEYS);
      await conn.query("INSERT INTO meta (k, v) VALUES ('seeded', ?)", [new Date().toISOString()]);
      await conn.commit();
      console.log("[db] first run: imported initial content into MySQL");
    }
  } catch (e) {
    await conn.rollback().catch(() => {});
    throw e;
  } finally {
    await conn.query("SELECT RELEASE_LOCK('tv_setup')").catch(() => {});
    conn.release();
  }
}

function ready() {
  g.__tvReady ??= setup().catch((e) => {
    g.__tvReady = undefined; // retry on the next request (e.g. MySQL started late)
    throw e;
  });
  return g.__tvReady;
}

/** One-time import: the old JSON file if it exists, otherwise the bundled starter content. */
async function legacyOrDefaults(): Promise<Db> {
  const base = emptyDb();
  base.trips = dTrips;
  base.destinations = dDest.map(({ tripCount: _t, ...d }) => d);
  base.services = dServices;
  base.faqs = dFaqs;
  try {
    const raw = JSON.parse(await fs.readFile(LEGACY_JSON, "utf8")) as Partial<Db> & { settings?: Partial<SiteInfo> & { social?: Record<string, string> } };
    const legacy = raw.settings?.social;
    const socials: SocialLink[] | undefined = raw.settings?.socials ?? (legacy ? Object.entries(legacy).filter(([, url]) => url).map(([p, url]) => ({ id: p, platform: p, url })) : undefined);
    return {
      ...base,
      ...(raw as Partial<Db>),
      settings: { ...base.settings, ...raw.settings, socials: socials ?? base.settings.socials } as SiteInfo,
    };
  } catch {
    return base;
  }
}

/* ───────────────────────────── row mapping ───────────────────────────── */

const emptyDb = (): Db => ({ settings: dSite, content: {}, reviews: [], trips: [], destinations: [], services: [], visas: [], leads: [], faqs: [] });

function fromRow(spec: Spec, r: RowDataPacket): Record<string, unknown> {
  const o: Record<string, unknown> = {};
  for (const [f, c, t] of spec.cols) {
    const v = r[c];
    switch (t) {
      case "b": o[f] = !!v; break;
      case "n": o[f] = v === null ? null : Number(v); break;
      case "j": o[f] = typeof v === "string" ? JSON.parse(v) : (v ?? []); break;
      case "d": o[f] = new Date(v).toISOString(); break;
      case "u": if (v !== null) o[f] = v; break;
      default: o[f] = v;
    }
  }
  return o;
}

function toParams(spec: Spec, item: Record<string, unknown>, position: number): unknown[] {
  const p = spec.cols.map(([f, , t]) => {
    const v = item[f];
    switch (t) {
      case "b": return v ? 1 : 0;
      case "j": return JSON.stringify(v ?? []);
      case "d": return new Date(String(v));
      case "n": return v === null || v === undefined || v === "" ? null : Number(v);
      case "s": return v === null || v === undefined ? "" : String(v);
      default: return v === null || v === undefined ? null : String(v);
    }
  });
  if (spec.positioned) p.push(position);
  return p;
}

/* ───────────────────────────── load / persist ───────────────────────────── */

async function load(q: Q, keys: DbKey[]): Promise<Db> {
  const db = emptyDb();
  for (const key of keys) {
    if (key === "settings") {
      const [r] = await rows(q, "SELECT v FROM settings WHERE k='site'");
      if (r) db.settings = { ...dSite, ...JSON.parse(r.v) };
    } else if (key === "content") {
      for (const r of await rows(q, "SELECT k, v FROM content_overrides")) db.content[r.k] = r.v;
    } else {
      const spec = SPECS[key as CollectionKey];
      const data = await rows(q, `SELECT * FROM ${spec.table} ORDER BY ${spec.orderBy}`);
      (db[key] as unknown[]) = data.map((r) => fromRow(spec, r));
    }
  }
  return db;
}

/** Write only what changed between `before` and `after` (inserts, updates, deletes). */
async function persist(q: Q, before: Db, after: Db, keys: DbKey[]) {
  for (const key of keys) {
    if (key === "settings") {
      await q.query("INSERT INTO settings (k, v) VALUES ('site', ?) ON DUPLICATE KEY UPDATE v = VALUES(v)", [JSON.stringify(after.settings)]);
    } else if (key === "content") {
      for (const [k, v] of Object.entries(after.content)) if (before.content[k] !== v) await q.query("INSERT INTO content_overrides (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)", [k, v]);
      for (const k of Object.keys(before.content)) if (!(k in after.content)) await q.query("DELETE FROM content_overrides WHERE k = ?", [k]);
    } else {
      const spec = SPECS[key as CollectionKey] as Spec;
      const cols = spec.cols.map(([, c]) => c).concat(spec.positioned ? ["position"] : []);
      const sql = `INSERT INTO ${spec.table} (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")}) ON DUPLICATE KEY UPDATE ${cols.filter((c) => c !== "id").map((c) => `${c} = VALUES(${c})`).join(", ")}`;
      const oldList = before[key] as unknown as Record<string, unknown>[];
      const newList = after[key] as unknown as Record<string, unknown>[];
      const snap = new Map(oldList.map((it, i) => [String(it.id), JSON.stringify(toParams(spec, it, i))]));
      const seen = new Set<string>();
      for (const [i, it] of newList.entries()) {
        const id = String(it.id);
        seen.add(id);
        const params = toParams(spec, it, i);
        if (snap.get(id) !== JSON.stringify(params)) await q.query(sql, params);
      }
      for (const id of snap.keys()) if (!seen.has(id)) await q.query(`DELETE FROM ${spec.table} WHERE id = ?`, [id]);
    }
  }
}

/* ───────────────────────────── public API ───────────────────────────── */

export async function readDb(keys: DbKey[] = NO_LEADS): Promise<Db> {
  await ready();
  return load(pool(), keys);
}

/**
 * Read-modify-write inside a transaction (with a MySQL named lock so concurrent
 * admin edits queue instead of clobbering each other). Only `keys` are loaded and saved.
 */
export async function mutateDb<T>(fn: (db: Db) => T | Promise<T>, keys: DbKey[] = NO_LEADS): Promise<T> {
  await ready();
  const conn = await pool().getConnection();
  try {
    await conn.query("SELECT GET_LOCK('tv_write', 30)");
    await conn.beginTransaction();
    const loaded = await load(conn, keys);
    const db = structuredClone(loaded);
    const out = await fn(db);
    await persist(conn, loaded, db, keys);
    await conn.commit();
    return out;
  } catch (e) {
    await conn.rollback().catch(() => {});
    throw e;
  } finally {
    await conn.query("SELECT RELEASE_LOCK('tv_write')").catch(() => {});
    conn.release();
  }
}
