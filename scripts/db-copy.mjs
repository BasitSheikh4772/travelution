/**
 * Copy the whole website database from one MySQL/MariaDB server to another
 * (e.g. local XAMPP → Railway MySQL). Creates the tables on the target and
 * upserts every row, so it is safe to re-run.
 *
 *   node scripts/db-copy.mjs "mysql://USER:PASSWORD@HOST:PORT/DBNAME"
 *
 * DEMO deploy: add --remote-videos to make the review videos play straight from the old live
 * site (travelution.com.pk) instead of local storage — no 800 MB upload needed. Drop the flag
 * (and upload/compress the videos) once the old site is retired.
 *
 * Source defaults to local XAMPP (root, no password, db "travelution"); override with
 * SRC_URL="mysql://…" if needed. Get the target URL from Railway → MySQL service →
 * Variables → MYSQL_PUBLIC_URL (the *public* one — your PC can't reach the private network).
 */
import mysql from "mysql2/promise";

const dstUrl = process.argv.slice(2).find((a) => !a.startsWith("--"));
const remoteVideos = process.argv.includes("--remote-videos");
if (!dstUrl) {
  console.error('Usage: node scripts/db-copy.mjs "mysql://USER:PASSWORD@HOST:PORT/DBNAME"');
  process.exit(1);
}
const srcUrl = process.env.SRC_URL ?? "mysql://root@127.0.0.1:3306/travelution";
const opts = { charset: "utf8mb4", timezone: "Z", decimalNumbers: true };

const src = await mysql.createConnection({ uri: srcUrl, ...opts });
const dstU = new URL(dstUrl);
const dst = await mysql.createConnection({ uri: dstUrl, ...opts });
console.log(`Copying ${new URL(srcUrl).pathname.slice(1)} → ${dstU.hostname}${dstU.pathname}`);

const TABLES = ["meta", "settings", "content_overrides", "reviews", "trips", "destinations", "services", "visa_guides", "faqs", "leads"];

for (const t of TABLES) {
  const [[create]] = await src.query(`SHOW CREATE TABLE \`${t}\``);
  const ddl = String(create["Create Table"]).replace(/^CREATE TABLE/, "CREATE TABLE IF NOT EXISTS");
  await dst.query(ddl);
  const [rows] = await src.query(`SELECT * FROM \`${t}\``);
  if (rows.length) {
    const cols = Object.keys(rows[0]);
    const sql = `INSERT INTO \`${t}\` (${cols.map((c) => `\`${c}\``).join(",")}) VALUES ? ON DUPLICATE KEY UPDATE ${cols.map((c) => `\`${c}\`=VALUES(\`${c}\`)`).join(",")}`;
    for (let i = 0; i < rows.length; i += 200) await dst.query(sql, [rows.slice(i, i + 200).map((r) => cols.map((c) => r[c]))]);
  }
  console.log(`  ${t}: ${rows.length} rows`);
}
if (remoteVideos) {
  const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36";
  const html = await (await fetch("https://travelution.com.pk/reviews/", { headers: { "User-Agent": UA } })).text();
  const found = html.match(/https:\/\/travelution\.com\.pk\/storage\/[^"'\s)]+?\.mp4/g) ?? [];
  const videos = [...new Set(found.map((u) => new URL(u).href))];
  await dst.query("ALTER TABLE reviews MODIFY video VARCHAR(1000) NOT NULL");
  // the import numbered reviews rev-1…rev-N in the same order as the live page
  for (const [i, url] of videos.entries()) await dst.query("UPDATE reviews SET video = ? WHERE id = ?", [url, `rev-${i + 1}`]);
  console.log(`  reviews: ${videos.length} videos now play from the live site (demo mode)`);
}
await src.end();
await dst.end();
console.log("✔ done");
