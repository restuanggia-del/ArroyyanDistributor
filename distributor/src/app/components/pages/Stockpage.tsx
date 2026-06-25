import React, { useState } from "react";
import { Plus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { Product, StockMovement } from "../../types";
import { uid, now } from "../../lib/utils";
import { fmtDate } from "../../lib/utils";
import Modal from "../shared/Modal";
import { FieldRow, inputCls, selectCls } from "../shared/FieldRow";

export default function StockPage({
  products,
  setProducts,
  stockMovements,
  setStockMovements,
}: {
  products: Product[];
  setProducts: (p: Product[]) => void;
  stockMovements: StockMovement[];
  setStockMovements: (s: StockMovement[]) => void;
}) {
  const [tab, setTab] = useState<"overview" | "history">("overview");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    productId: "",
    type: "masuk" as "masuk" | "keluar" | "penyesuaian",
    quantity: "",
    note: "",
  });

  const lowStock = products.filter((p) => p.stock <= p.minStock);
  const typeLabel = {
    masuk: "Stok Masuk",
    keluar: "Stok Keluar",
    penyesuaian: "Penyesuaian",
  };
  const typeBadge = {
    masuk: "bg-emerald-100 text-emerald-700",
    keluar: "bg-red-100 text-red-700",
    penyesuaian: "bg-amber-100 text-amber-700",
  };

  function addMovement() {
    const prod = products.find((p) => p.id === form.productId);
    if (!prod || !form.quantity) {
      toast.error("Pilih produk dan masukkan jumlah");
      return;
    }
    const qty = Number(form.quantity);
    if (qty <= 0) {
      toast.error("Jumlah harus lebih dari 0");
      return;
    }
    const stockBefore = prod.stock;
    let stockAfter = stockBefore;
    if (form.type === "masuk") stockAfter = stockBefore + qty;
    else if (form.type === "keluar") {
      if (qty > stockBefore) {
        toast.error("Stok tidak mencukupi");
        return;
      }
      stockAfter = stockBefore - qty;
    } else stockAfter = qty;

    const mv: StockMovement = {
      id: uid(),
      productId: prod.id,
      productName: prod.name,
      type: form.type,
      quantity: qty,
      stockBefore,
      stockAfter,
      note: form.note,
      date: now(),
    };
    setStockMovements([mv, ...stockMovements]);
    setProducts(
      products.map((p) => (p.id === prod.id ? { ...p, stock: stockAfter } : p)),
    );

    if (stockAfter <= prod.minStock)
      toast.warning(
        `Peringatan: Stok ${prod.name} tersisa ${stockAfter} pcs (di bawah minimum)`,
      );
    else toast.success(`Stok ${prod.name}: ${stockBefore} → ${stockAfter} pcs`);
    setShowModal(false);
    setForm({ productId: "", type: "masuk", quantity: "", note: "" });
  }

  const selectedProd = products.find((p) => p.id === form.productId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Stok</h2>
          <p className="text-slate-500 text-xs">
            {products.length} produk dikelola
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 active:bg-blue-700 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200"
        >
          <Plus size={18} />
        </button>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5">
          <p className="text-red-700 font-semibold text-xs flex items-center gap-2 mb-2.5">
            <AlertTriangle size={14} /> {lowStock.length} Produk Stok Menipis
          </p>
          <div className="flex flex-wrap gap-2">
            {lowStock.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-red-200 text-red-700 text-xs font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1.5"
              >
                <span className="truncate max-w-[120px]">{p.name}</span>
                <span className="font-bold bg-red-100 px-1.5 py-0.5 rounded flex-shrink-0">
                  {p.stock}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {(["overview", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${tab === t ? "bg-blue-600 text-white" : "bg-white border border-blue-100 text-slate-600"}`}
          >
            {t === "overview" ? "Ringkasan" : "Riwayat"}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <div className="space-y-2.5">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900 text-sm truncate">
                  {p.name}
                </p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium inline-block mt-1 ${p.category === "cup" ? "bg-sky-100 text-sky-700" : "bg-indigo-100 text-indigo-700"}`}
                >
                  {p.category === "cup" ? "Cup" : "Botol"}
                </span>
              </div>
              <div className="text-right flex-shrink-0">
                <p
                  className="font-bold text-slate-900 text-base"
                  style={{ fontFamily: "DM Mono, monospace" }}
                >
                  {p.stock}{" "}
                  <span className="text-xs text-slate-400 font-normal">
                    pcs
                  </span>
                </p>
                <p className="text-xs text-slate-400">min. {p.minStock}</p>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${p.stock <= p.minStock ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}
              >
                {p.stock <= p.minStock ? "Menipis" : "Aman"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2.5">
          {stockMovements.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-slate-900 text-sm">
                  {m.productName}
                </p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${typeBadge[m.type]}`}
                >
                  {typeLabel[m.type]}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span
                  className="text-slate-400"
                  style={{ fontFamily: "DM Mono, monospace" }}
                >
                  {m.stockBefore}
                </span>
                <span className="text-slate-300">→</span>
                <span
                  className="font-semibold text-blue-700"
                  style={{ fontFamily: "DM Mono, monospace" }}
                >
                  {m.stockAfter}
                </span>
                <span className="text-slate-400">({m.quantity} pcs)</span>
              </div>
              {m.note && (
                <p className="text-xs text-slate-500 mt-1.5 truncate">
                  {m.note}
                </p>
              )}
              <p className="text-xs text-slate-400 mt-1.5">{fmtDate(m.date)}</p>
            </div>
          ))}
          {stockMovements.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">
              Belum ada riwayat pergerakan stok
            </div>
          )}
        </div>
      )}

      {showModal && (
        <Modal title="Pergerakan Stok" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <FieldRow label="Produk">
              <select
                value={form.productId}
                onChange={(e) =>
                  setForm({ ...form, productId: e.target.value })
                }
                className={selectCls}
              >
                <option value="">— Pilih Produk —</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Stok: {p.stock})
                  </option>
                ))}
              </select>
            </FieldRow>
            <FieldRow label="Tipe Pergerakan">
              <div className="grid grid-cols-3 gap-2">
                {(["masuk", "keluar", "penyesuaian"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm({ ...form, type: t })}
                    className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${form.type === t ? "bg-blue-600 text-white" : "border border-slate-200 text-slate-600"}`}
                  >
                    {t === "masuk"
                      ? "Masuk"
                      : t === "keluar"
                        ? "Keluar"
                        : "Penyesuaian"}
                  </button>
                ))}
              </div>
            </FieldRow>
            <FieldRow
              label={
                form.type === "penyesuaian" ? "Stok Baru (pcs)" : "Jumlah (pcs)"
              }
            >
              <input
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className={inputCls}
                placeholder="0"
                min="1"
              />
            </FieldRow>
            {selectedProd && form.quantity && (
              <div className="bg-blue-50 rounded-xl p-3 text-xs text-slate-600">
                <span>
                  Stok saat ini:{" "}
                  <strong style={{ fontFamily: "DM Mono, monospace" }}>
                    {selectedProd.stock}
                  </strong>
                </span>
                {" → "}
                <strong
                  className="text-blue-700"
                  style={{ fontFamily: "DM Mono, monospace" }}
                >
                  {form.type === "masuk"
                    ? selectedProd.stock + Number(form.quantity)
                    : form.type === "keluar"
                      ? Math.max(0, selectedProd.stock - Number(form.quantity))
                      : Number(form.quantity)}{" "}
                  pcs
                </strong>
              </div>
            )}
            <FieldRow label="Catatan (opsional)">
              <input
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className={inputCls}
                placeholder="Keterangan pergerakan..."
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
              onClick={addMovement}
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
