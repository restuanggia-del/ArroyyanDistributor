import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Wallet,
  ShoppingCart,
  CreditCard,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import type { Transaction, Product } from "../../types";
import { fmtRp } from "../../lib/utils";
import StatCard from "../shared/StatCard";

export default function ReportsPage({
  transactions,
  products,
}: {
  transactions: Transaction[];
  products: Product[];
}) {
  const [tab, setTab] = useState<"daily" | "monthly" | "stock">("daily");
  const today = new Date();

  const todayTxns = transactions.filter(
    (t) => new Date(t.date).toDateString() === today.toDateString(),
  );
  const todayTotal = todayTxns.reduce((s, t) => s + t.total, 0);
  const todayCash = todayTxns
    .filter((t) => t.paymentMethod === "cash")
    .reduce((s, t) => s + t.total, 0);
  const todayTransfer = todayTxns
    .filter((t) => t.paymentMethod === "transfer")
    .reduce((s, t) => s + t.total, 0);

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1);
    const txns = transactions.filter((t) => {
      const td = new Date(t.date);
      return (
        td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear()
      );
    });
    return {
      label: d.toLocaleDateString("id-ID", { month: "short", year: "2-digit" }),
      total: txns.reduce((s, t) => s + t.total, 0),
      count: txns.length,
    };
  });

  const productMap: Record<
    string,
    { name: string; qty: number; revenue: number }
  > = {};
  transactions.forEach((t) =>
    t.items.forEach((item) => {
      if (!productMap[item.productId])
        productMap[item.productId] = {
          name: item.productName,
          qty: 0,
          revenue: 0,
        };
      productMap[item.productId].qty += item.qty;
      productMap[item.productId].revenue += item.qty * item.price;
    }),
  );
  const topProducts = Object.values(productMap).sort(
    (a, b) => b.revenue - a.revenue,
  );
  const lowStock = products.filter((p) => p.stock <= p.minStock);

  const TABS = [
    { k: "daily", label: "Harian" },
    { k: "monthly", label: "Bulanan" },
    { k: "stock", label: "Stok" },
  ] as const;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Laporan</h2>
        <p className="text-slate-500 text-xs">Ringkasan penjualan dan stok</p>
      </div>

      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${tab === t.k ? "bg-blue-600 text-white" : "bg-white border border-blue-100 text-slate-600"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "daily" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              title="Total Penjualan"
              value={fmtRp(todayTotal)}
              sub={today.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
              })}
              icon={Wallet}
            />
            <StatCard
              title="Jumlah Transaksi"
              value={String(todayTxns.length)}
              sub="Hari ini"
              icon={ShoppingCart}
              color="purple"
            />
            <StatCard
              title="Penerimaan Cash"
              value={fmtRp(todayCash)}
              sub={`${todayTxns.filter((t) => t.paymentMethod === "cash").length} transaksi`}
              icon={Wallet}
              color="green"
            />
            <StatCard
              title="Penerimaan Transfer"
              value={fmtRp(todayTransfer)}
              sub={`${todayTxns.filter((t) => t.paymentMethod === "transfer").length} transaksi`}
              icon={CreditCard}
              color="blue"
            />
          </div>
          <div className="bg-white rounded-2xl border border-blue-100 p-4 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-3 text-sm">
              Transaksi Hari Ini
            </h3>
            {todayTxns.length === 0 ? (
              <p className="text-slate-400 text-sm">
                Belum ada transaksi hari ini
              </p>
            ) : (
              <div className="space-y-2.5">
                {todayTxns.map((t) => (
                  <div
                    key={t.id}
                    className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 text-sm truncate">
                        {t.customerName}
                      </p>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full capitalize ${t.paymentMethod === "cash" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}
                      >
                        {t.paymentMethod}
                      </span>
                    </div>
                    <span
                      className="font-bold text-blue-700 text-sm flex-shrink-0 ml-2"
                      style={{ fontFamily: "DM Mono, monospace" }}
                    >
                      {fmtRp(t.total)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2.5 border-t-2 border-blue-100">
                  <span className="font-bold text-slate-900 text-sm">
                    TOTAL
                  </span>
                  <span
                    className="font-bold text-blue-700 text-base"
                    style={{ fontFamily: "DM Mono, monospace" }}
                  >
                    {fmtRp(todayTotal)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "monthly" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-blue-100 p-4 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-3 text-sm">
              Omset 6 Bulan Terakhir
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={months} barSize={26}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                />
                <Tooltip
                  formatter={(v: number) => [fmtRp(v), "Omset"]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #dbeafe",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl border border-blue-100 p-4 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-3 text-sm">
              Produk Terlaris (Semua Waktu)
            </h3>
            <div className="space-y-3">
              {topProducts.map((p, i) => {
                const maxRev = topProducts[0]?.revenue || 1;
                return (
                  <div key={p.name}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-xs text-slate-900 truncate">
                          {p.name}
                        </span>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p
                          className="text-xs font-bold text-blue-700"
                          style={{ fontFamily: "DM Mono, monospace" }}
                        >
                          {fmtRp(p.revenue)}
                        </p>
                        <p className="text-xs text-slate-400">
                          {p.qty.toLocaleString("id-ID")} pcs
                        </p>
                      </div>
                    </div>
                    <div className="h-1.5 bg-blue-50 rounded-full">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(p.revenue / maxRev) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === "stock" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-blue-100 p-4 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-3 text-sm flex items-center gap-2">
              <AlertTriangle size={15} className="text-red-500" /> Produk Hampir
              Habis
            </h3>
            {lowStock.length === 0 ? (
              <p className="text-emerald-600 text-sm flex items-center gap-2">
                <CheckCircle size={16} /> Semua stok dalam kondisi aman
              </p>
            ) : (
              lowStock.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center py-2.5 border-b border-slate-50 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      Min. {p.minStock} pcs | Kurang {p.minStock - p.stock} pcs
                    </p>
                  </div>
                  <span
                    className="bg-red-100 text-red-700 px-2.5 py-1 rounded-xl text-sm font-bold flex-shrink-0 ml-2"
                    style={{ fontFamily: "DM Mono, monospace" }}
                  >
                    {p.stock} pcs
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="bg-white rounded-2xl border border-blue-100 p-4 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-3 text-sm">
              Rekap Stok Semua Produk
            </h3>
            <div className="space-y-2.5">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">
                      {p.name}
                    </p>
                    <p className="capitalize text-slate-400 text-xs">
                      {p.category} · min. {p.minStock}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span
                      className="font-bold text-sm"
                      style={{ fontFamily: "DM Mono, monospace" }}
                    >
                      {p.stock}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.stock <= p.minStock ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}
                    >
                      {p.stock <= p.minStock ? "Menipis" : "Aman"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
