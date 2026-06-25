import React, { useState } from "react";
import { Search, X, Eye } from "lucide-react";
import type { Transaction } from "../../types";
import { fmtRp, fmtDate, fmtDT } from "../../lib/utils";
import Modal from "../shared/Modal";
import { inputCls } from "../shared/FieldRow";

export default function HistoryPage({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [detail, setDetail] = useState<Transaction | null>(null);

  const filtered = transactions.filter((t) => {
    const d = new Date(t.date);
    const matchText =
      t.customerName.toLowerCase().includes(search.toLowerCase()) ||
      t.id.includes(search);
    const matchFrom = !dateFrom || d >= new Date(dateFrom);
    const matchTo = !dateTo || d <= new Date(dateTo + "T23:59:59");
    return matchText && matchFrom && matchTo;
  });

  const filteredTotal = filtered.reduce((s, t) => s + t.total, 0);
  const isFiltering = search || dateFrom || dateTo;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Riwayat Transaksi</h2>
        <p className="text-slate-500 text-xs">
          {transactions.length} transaksi tersimpan
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-blue-100 p-3.5 space-y-2.5">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pelanggan atau ID..."
            className={inputCls + " pl-9"}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className={inputCls + " text-xs px-2.5"}
          />
          <span className="text-slate-400 text-xs flex-shrink-0">s/d</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className={inputCls + " text-xs px-2.5"}
          />
        </div>
        {isFiltering && (
          <button
            onClick={() => {
              setSearch("");
              setDateFrom("");
              setDateTo("");
            }}
            className="text-xs text-slate-500 flex items-center gap-1"
          >
            <X size={13} /> Reset filter
          </button>
        )}
      </div>

      {isFiltering && (
        <div className="flex justify-between text-sm bg-blue-50 rounded-xl px-3.5 py-2.5">
          <span className="text-slate-500">
            {filtered.length} transaksi ditemukan
          </span>
          <span className="text-blue-700 font-semibold">
            {fmtRp(filteredTotal)}
          </span>
        </div>
      )}

      <div className="space-y-2.5">
        {filtered.map((t) => (
          <button
            key={t.id}
            onClick={() => setDetail(t)}
            className="w-full bg-white rounded-2xl p-4 border border-blue-100 shadow-sm text-left"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-slate-900 text-sm truncate">
                  {t.customerName}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{fmtDT(t.date)}</p>
              </div>
              <Eye size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
            </div>
            <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-slate-50">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.paymentMethod === "cash" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}
                >
                  {t.paymentMethod === "cash" ? "Cash" : "Transfer"}
                </span>
                <span className="text-xs text-slate-400">
                  {t.items.length} item
                </span>
              </div>
              <span
                className="font-bold text-blue-700 text-sm"
                style={{ fontFamily: "DM Mono, monospace" }}
              >
                {fmtRp(t.total)}
              </span>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">
            Tidak ada transaksi ditemukan
          </div>
        )}
      </div>

      {detail && (
        <Modal title="Detail Transaksi" onClose={() => setDetail(null)}>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">ID</span>
              <span className="font-mono text-xs text-slate-400">
                #{detail.id}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Pelanggan</span>
              <span className="font-medium">{detail.customerName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tanggal</span>
              <span>{fmtDT(detail.date)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Pembayaran</span>
              <span className="capitalize font-medium">
                {detail.paymentMethod}
              </span>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-4 mb-4 space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              Produk Dibeli
            </p>
            {detail.items.map((item, i) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {item.productName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {item.qty} pcs × {fmtRp(item.price)}
                  </p>
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ fontFamily: "DM Mono, monospace" }}
                >
                  {fmtRp(item.qty * item.price)}
                </span>
              </div>
            ))}
          </div>
          <div className="bg-blue-600 rounded-xl p-4 flex justify-between items-center">
            <span className="text-blue-100 font-medium">Total</span>
            <span
              className="text-white text-xl font-bold"
              style={{ fontFamily: "DM Mono, monospace" }}
            >
              {fmtRp(detail.total)}
            </span>
          </div>
        </Modal>
      )}
    </div>
  );
}
