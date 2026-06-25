import React, { useState } from "react";
import { User, Phone, MapPin, Lock, LogOut, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import type { Profile } from "../../types";
import { FieldRow, inputCls } from "../shared/FieldRow";

export default function ProfilePage({
  profile,
  setProfile,
  onLogout,
}: {
  profile: Profile;
  setProfile: (p: Profile) => void;
  onLogout: () => void;
}) {
  const [tab, setTab] = useState<"info" | "password">("info");
  const [form, setForm] = useState({
    name: profile.name,
    phone: profile.phone,
    address: profile.address,
    email: profile.email,
  });
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);

  function saveInfo() {
    if (!form.name.trim()) {
      toast.error("Nama wajib diisi");
      return;
    }
    setProfile({
      ...profile,
      name: form.name.trim(),
      phone: form.phone,
      address: form.address,
      email: form.email,
    });
    toast.success("Profil berhasil disimpan");
  }

  function changePw() {
    if (pwForm.current !== profile.password) {
      toast.error("Password lama salah");
      return;
    }
    if (pwForm.newPw.length < 6) {
      toast.error("Password baru minimal 6 karakter");
      return;
    }
    if (pwForm.newPw !== pwForm.confirm) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }
    setProfile({ ...profile, password: pwForm.newPw });
    setPwForm({ current: "", newPw: "", confirm: "" });
    toast.success("Password berhasil diubah");
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Profil</h2>
        <p className="text-slate-500 text-xs">
          Kelola informasi akun dan keamanan
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-4 flex items-center gap-3.5 text-white">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-xl font-bold border border-white/30 flex-shrink-0">
          {profile.name[0]}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-sm truncate">{profile.name}</h3>
          <p className="text-blue-100 text-xs truncate">{profile.email}</p>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full mt-1 inline-block">
            Distributor
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {[
          { k: "info", label: "Informasi Akun" },
          { k: "password", label: "Ganti Password" },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k as "info" | "password")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${tab === t.k ? "bg-blue-600 text-white" : "bg-white border border-blue-100 text-slate-600"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "info" && (
        <div className="bg-white rounded-2xl border border-blue-100 p-4 space-y-4 shadow-sm">
          <FieldRow label="Nama Distributor">
            <div className="relative">
              <User
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls + " pl-9"}
              />
            </div>
          </FieldRow>
          <FieldRow label="Nomor HP">
            <div className="relative">
              <Phone
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputCls + " pl-9"}
              />
            </div>
          </FieldRow>
          <FieldRow label="Alamat">
            <div className="relative">
              <MapPin
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={inputCls + " pl-9"}
              />
            </div>
          </FieldRow>
          <FieldRow label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputCls}
            />
          </FieldRow>
          <button
            onClick={saveInfo}
            className="w-full bg-blue-600 active:bg-blue-700 text-white rounded-xl py-3 text-sm font-semibold transition-colors shadow-md shadow-blue-200"
          >
            Simpan Perubahan
          </button>
        </div>
      )}

      {tab === "password" && (
        <div className="bg-white rounded-2xl border border-blue-100 p-4 space-y-4 shadow-sm">
          {[
            { key: "current", label: "Password Lama" },
            { key: "newPw", label: "Password Baru" },
            { key: "confirm", label: "Konfirmasi Password Baru" },
          ].map(({ key, label }) => (
            <FieldRow key={key} label={label}>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showPw ? "text" : "password"}
                  value={(pwForm as Record<string, string>)[key]}
                  onChange={(e) =>
                    setPwForm({ ...pwForm, [key]: e.target.value })
                  }
                  className={inputCls + " pl-9 pr-10"}
                  placeholder="••••••••"
                />
                {key === "current" && (
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                )}
              </div>
            </FieldRow>
          ))}
          <button
            onClick={changePw}
            className="w-full bg-blue-600 active:bg-blue-700 text-white rounded-xl py-3 text-sm font-semibold transition-colors shadow-md shadow-blue-200 flex items-center justify-center gap-2"
          >
            <Lock size={14} /> Ganti Password
          </button>
        </div>
      )}

      <button
        onClick={onLogout}
        className="w-full border border-red-200 text-red-600 active:bg-red-50 rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        <LogOut size={15} /> Keluar dari Akun
      </button>
    </div>
  );
}
