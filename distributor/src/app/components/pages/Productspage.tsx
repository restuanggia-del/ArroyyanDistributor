import React, { useState } from "react";
import { Plus, Search, Edit2, Trash2, Package } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "../../types";
import { fmtRp } from "../../lib/utils";
import { uid } from "../../lib/utils";
import Modal from "../shared/Modal";
import { FieldRow, inputCls, selectCls } from "../shared/FieldRow";

export default function ProductsPage({
  products,
  setProducts,
}: {
  products: Product[];
  setProducts: (p: Product[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<"all" | "cup" | "botol">("all");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "cup" as "cup" | "botol",
    price: "",
    stock: "",
    minStock: "10",
  });

  const filtered = products.filter(
    (p) =>
      (cat === "all" || p.category === cat) &&
      p.name.toLowerCase().includes(search.toLowerCase()),
  );

  function openAdd() {
    setEditing(null);
    setForm({
      name: "",
      category: "cup",
      price: "",
      stock: "",
      minStock: "10",
    });
    setShowModal(true);
  }
  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      stock: String(p.stock),
      minStock: String(p.minStock),
    });
    setShowModal(true);
  }

  function saveFn() {
    if (!form.name.trim() || !form.price) {
      toast.error("Nama dan harga wajib diisi");
      return;
    }
    const p: Product = {
      id: editing?.id ?? uid(),
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      minStock: Number(form.minStock) || 10,
    };
    if (editing) {
      setProducts(products.map((x) => (x.id === editing.id ? p : x)));
      toast.success("Produk diperbarui");
    } else {
      setProducts([...products, p]);
      toast.success("Produk ditambahkan");
    }
    setShowModal(false);
  }

  function del(id: string) {
    if (!confirm("Hapus produk ini?")) return;
    setProducts(products.filter((p) => p.id !== id));
    toast.success("Produk dihapus");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Produk</h2>
          <p className="text-slate-500 text-xs">
            {products.length} produk terdaftar
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
          placeholder="Cari produk..."
          className={inputCls + " pl-9"}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {(["all", "cup", "botol"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${cat === c ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-white border border-blue-100 text-slate-600"}`}
          >
            {c === "all" ? "Semua" : c === "cup" ? "Cup" : "Botol"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 flex-shrink-0">
                <Package size={20} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-900 text-sm leading-tight">
                    {p.name}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${p.category === "cup" ? "bg-sky-100 text-sky-700" : "bg-indigo-100 text-indigo-700"}`}
                  >
                    {p.category === "cup" ? "Cup" : "Botol"}
                  </span>
                </div>
                <p
                  className="text-blue-700 font-bold mt-1 text-sm"
                  style={{ fontFamily: "DM Mono, monospace" }}
                >
                  {fmtRp(p.price)}
                  <span
                    className="text-slate-400 font-normal text-xs"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    /pcs
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
              <div>
                <span
                  className={`font-bold text-sm ${p.stock <= p.minStock ? "text-red-600" : "text-emerald-600"}`}
                  style={{ fontFamily: "DM Mono, monospace" }}
                >
                  {p.stock}
                </span>
                <span className="text-slate-400 text-xs"> pcs</span>
                {p.stock <= p.minStock && (
                  <span className="ml-1.5 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md font-medium">
                    Menipis
                  </span>
                )}
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => openEdit(p)}
                  className="w-8 h-8 bg-blue-50 active:bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => del(p.id)}
                  className="w-8 h-8 bg-red-50 active:bg-red-100 text-red-500 rounded-lg flex items-center justify-center"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Package size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Tidak ada produk ditemukan</p>
          </div>
        )}
      </div>

      {showModal && (
        <Modal
          title={editing ? "Edit Produk" : "Tambah Produk"}
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-4">
            <FieldRow label="Nama Produk">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls}
                placeholder="Nama produk"
              />
            </FieldRow>
            <FieldRow label="Kategori">
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as "cup" | "botol",
                  })
                }
                className={selectCls}
              >
                <option value="cup">Cup</option>
                <option value="botol">Botol</option>
              </select>
            </FieldRow>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="Harga Jual (Rp)">
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className={inputCls}
                  placeholder="0"
                />
              </FieldRow>
              <FieldRow label="Stok Awal">
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className={inputCls}
                  placeholder="0"
                />
              </FieldRow>
            </div>
            <FieldRow label="Stok Minimum (notifikasi)">
              <input
                type="number"
                value={form.minStock}
                onChange={(e) => setForm({ ...form, minStock: e.target.value })}
                className={inputCls}
                placeholder="10"
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
