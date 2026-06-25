import React, { useState } from "react";
import { Eye, EyeOff, AlertTriangle, Package2 } from "lucide-react";
import type { Profile } from "../../types";
import { persist } from "../../lib/storage";
import { K } from "../../lib/storage";
import { FieldRow, inputCls } from "../shared/FieldRow";

export default function LoginPage({
  onLogin,
  profile,
}: {
  onLogin: () => void;
  profile: Profile;
}) {
  const [email, setEmail] = useState("admin@arroyyan.com");
  const [pw, setPw] = useState("admin123");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (email === profile.email && pw === profile.password) {
      persist(K.session, { ok: true });
      onLogin();
    } else {
      setErr("Email atau password salah.");
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #3b82f6 100%)",
      }}
    >
      <div className="flex flex-col items-center justify-center pt-[max(3rem,env(safe-area-inset-top))] pb-8 px-6 text-center">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-white/30">
          <Package2 className="text-white" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">
          Arroyyan Distributor
        </h1>
        <p className="text-blue-200 text-sm">
          Sistem Manajemen Distributor Terpadu
        </p>
      </div>

      <div className="flex-1 bg-white rounded-t-3xl px-6 pt-7 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <h2 className="text-xl font-bold text-slate-900 mb-1">
          Selamat Datang
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          Masuk ke akun distributor Anda
        </p>

        <form onSubmit={submit} className="space-y-4">
          <FieldRow label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              placeholder="email@distributor.com"
            />
          </FieldRow>
          <FieldRow label="Password">
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className={inputCls + " pr-10"}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FieldRow>
          {err && (
            <p className="text-red-500 text-sm flex items-center gap-1.5 bg-red-50 px-3 py-2 rounded-lg">
              <AlertTriangle size={14} />
              {err}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 active:bg-blue-700 text-white rounded-xl py-3.5 font-semibold transition-colors shadow-lg shadow-blue-200 mt-2"
          >
            Masuk
          </button>
        </form>

        <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-xs text-slate-500 font-medium mb-1">Demo akun:</p>
          <p className="text-xs text-slate-600 font-mono">admin@arroyyan.com</p>
          <p className="text-xs text-slate-600 font-mono">admin123</p>
        </div>
      </div>
    </div>
  );
}
