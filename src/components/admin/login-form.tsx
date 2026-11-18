"use client";

import { useActionState } from "react";
import { login } from "@/lib/cms/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <main className="grid min-h-dvh place-items-center bg-brand-deep p-6">
      <form action={action} className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-8 shadow-2xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">Travelution</p>
          <h1 className="mt-1 font-display text-3xl text-brand">Admin sign in</h1>
        </div>
        <label className="block text-sm font-medium">
          Username
          <input name="user" autoComplete="username" required defaultValue="admin" className="mt-1 w-full rounded-lg border border-line px-3 py-2.5" />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input name="password" type="password" autoComplete="current-password" required autoFocus className="mt-1 w-full rounded-lg border border-line px-3 py-2.5" />
        </label>
        {state?.error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-800">
            {state.error}
          </p>
        )}
        <button disabled={pending} className="w-full rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-soft disabled:opacity-60">
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
