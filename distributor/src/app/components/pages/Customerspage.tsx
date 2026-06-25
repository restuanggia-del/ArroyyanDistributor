import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Phone,
  MapPin,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import type { Customer, Transaction } from "../../types";
import { fmtRp, fmtDate, uid, now } from "../../lib/utils";
import Modal from "../shared/Modal";
import { FieldRow, inputCls } from "../shared/FieldRow";

export default function CustomersPage({
  customers,
  setCustomers,
  transactions,
}: {
  customers: Customer[];
  setCustomers: (c: Customer[]) => void;
  transactions: Transaction[];
}) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search),
  );

  function openAdd() {
    setEditing(null);
    setForm({ name: "", phone: "", address: "" });
    setShowModal(true);
  }
  function openEdit(c: Customer) {
    setEditing(c);
    setForm({ name: c.name, phone: c.phone, address: c.address });
    setShowModal(true);
  }

  function saveFn() {
    if (!form.name.trim()) {
      toast.error("Nama pelanggan wajib diisi");
      return;
    }
    const c: Customer = {
      id: editing?.id ?? uid(),
      name: form.name.trim(),
      phone: form.phone,
      address: form.address,
      createdAt: editing?.createdAt ?? now(),
    };
    if (editing) {
      setCustomers(customers.map((x) => (x.id === editing.id ? c : x)));
      toast.success("Pelanggan diperbarui");
    } else {
      setCustomers([...customers, c]);
      toast.success("Pelanggan ditambahkan");
    }
    setShowModal(false);
  }

  function del(id: string) {
    if (!confirm("Hapus pelanggan ini?")) return;
    setCustomers(customers.filter((c) => c.id !== id));
    toast.success("Pelanggan dihapus");
  }

  const viewTxns = viewCustomer
    ? transactions.filter((t) => t.customerName === viewCustomer.name)
    : [];
  const viewTotal = viewTxns.reduce((s, t) => s + t.total, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Pelanggan</h2>
          <p className="text-slate-500 text-xs">
            {customers.length} pelanggan terdaftar
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-blue-600 active:bg-blue-700 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama atau nomor HP..."
          className={inputCls + " pl-9"}
        />
      </div>

      <div className="space-y-3">
        {filtered.map((c) => {
          const txns = transactions.filter((t) => t.customerName === c.name);
          const total = txns.reduce((s, t) => s + t.total, 0);
          return (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-md shadow-blue-200 flex-shrink-0">
                    {c.name[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 text-sm leading-tight truncate">
                      {c.name}
                    </h3>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Sejak {fmtDate(c.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => setViewCustomer(c)}
                    className="w-8 h-8 bg-blue-50 active:bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"
                  >
                    <Eye size={13} />
                  </button>
                  <button
                    onClick={() => openEdit(c)}
                    className="w-8 h-8 bg-blue-50 active:bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => del(c.id)}
                    className="w-8 h-8 bg-red-50 active:bg-red-100 text-red-500 rounded-lg flex items-center justify-center"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              {c.phone && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                  <Phone size={11} className="flex-shrink-0" />
                  {c.phone}
                </p>
              )}
              {c.address && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin size={11} className="flex-shrink-0" />
                  <span className="truncate">{c.address}</span>
                </p>
              )}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                <span className="text-xs text-slate-400">
                  {txns.length} transaksi
                </span>
                <span
                  className="text-sm font-bold text-blue-700"
                  style={{ fontFamily: "DM Mono, monospace" }}
                >
                  {fmtRp(total)}
                </span>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-14 text-slate-400">
            <Users size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Tidak ada pelanggan ditemukan</p>
          </div>
        )}
      </div>

      {viewCustomer && (
        <Modal
          title={`Riwayat — ${viewCustomer.name}`}
          onClose={() => setViewCustomer(null)}
        >
          <div className="bg-blue-50 rounded-xl p-3 mb-4 flex justify-between items-center">
            <span className="text-sm text-slate-600">
              {viewTxns.length} transaksi
            </span>
            <span
              className="font-bold text-blue-700"
              style={{ fontFamily: "DM Mono, monospace" }}
            >
              {fmtRp(viewTotal)}
            </span>
          </div>
          <div className="space-y-2">
            {viewTxns.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">
                Belum ada riwayat transaksi
              </p>
            ) : (
              viewTxns.map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0"
                >
                  <div>
                    <p className="text-xs font-medium text-slate-800">
                      {fmtDate(t.date)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {t.items.length} item · {t.paymentMethod}
                    </p>
                  </div>
                  <span
                    className="text-sm font-bold text-slate-900"
                    style={{ fontFamily: "DM Mono, monospace" }}
                  >
                    {fmtRp(t.total)}
                  </span>
                </div>
              ))
            )}
          </div>
        </Modal>
      )}

      {showModal && (
        <Modal
          title={editing ? "Edit Pelanggan" : "Tambah Pelanggan"}
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-4">
            <FieldRow label="Nama Pelanggan">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls}
                placeholder="Nama toko / pelanggan"
              />
            </FieldRow>
            <FieldRow label="Nomor HP">
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputCls}
                placeholder="08xxxxxxxxxx"
              />
            </FieldRow>
            <FieldRow label="Alamat">
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={inputCls}
                placeholder="Jl. ..."
              />
            </FieldRow>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 border border-slate-200 rounded-xl py-3 text-sm font-medium text-slate-600"
            >
              Batal
            </button>
            <button
              onClick={saveFn}
              className="flex-1 bg-blue-600 text-white rounded-xl py-3 text-sm font-semibold"
            >
              Simpan
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
