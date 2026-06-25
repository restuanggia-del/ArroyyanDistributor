import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Wallet,
  Calendar,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import type { Transaction, Product, Page } from "../../types";
import { fmtRp, fmtDate } from "../../lib/utils";
import StatCard from "../shared/StatCard";

export default function Dashboard({
  transactions,
  products,
  onNavigate,
}: {
  transactions: Transaction[];
  products: Product[];
  onNavigate: (p: Page) => void;
}) {
  const today = new Date();
  const todayStr = today.toDateString();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();

  const todayTxns = transactions.filter(
    (t) => new Date(t.date).toDateString() === todayStr,
  );
  const monthTxns = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const todayTotal = todayTxns.reduce((s, t) => s + t.total, 0);
  const monthTotal = monthTxns.reduce((s, t) => s + t.total, 0);
  const lowStock = products.filter((p) => p.stock <= p.minStock);

  const productSales: Record<
    string,
    { name: string; qty: number; revenue: number }
  > = {};
  transactions.forEach((t) =>
    t.items.forEach((item) => {
      if (!productSales[item.productId])
        productSales[item.productId] = {
          name: item.productName,
          qty: 0,
          revenue: 0,
        };
      productSales[item.productId].qty += item.qty;
      productSales[item.productId].revenue += item.qty * item.price;
    }),
  );
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const total = transactions
      .filter((t) => new Date(t.date).toDateString() === d.toDateString())
      .reduce((s, t) => s + t.total, 0);
    return { day: d.toLocaleDateString("id-ID", { weekday: "short" }), total };
  });

  const last3months = Array.from({ length: 3 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - (2 - i), 1);
    return transactions
      .filter((t) => {
        const td = new Date(t.date);
        return (
          td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear()
        );
      })
      .reduce((s, t) => s + t.total, 0);
  });
  const maPredict = Math.round(last3months.reduce((s, v) => s + v, 0) / 3);
  const nextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1,
  ).toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          title="Penjualan Hari Ini"
          value={fmtRp(todayTotal)}
          sub={`${todayTxns.length} transaksi`}
          icon={Wallet}
          color="blue"
        />
        <StatCard
          title="Penjualan Bulan Ini"
          value={fmtRp(monthTotal)}
          sub={`${monthTxns.length} transaksi`}
          icon={Calendar}
          color="green"
        />
        <StatCard
          title="Total Transaksi"
          value={String(transactions.length)}
          sub="Semua waktu"
          icon={ShoppingCart}
          color="purple"
        />
        <StatCard
          title="Stok Menipis"
          value={String(lowStock.length)}
          sub="Perlu restock"
          icon={AlertTriangle}
          color={lowStock.length > 0 ? "red" : "green"}
        />
      </div>

      <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-3 text-sm">
          Penjualan 7 Hari Terakhir
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={dailyData}>
            <defs>
              <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip
              formatter={(v: number) => [fmtRp(v), "Penjualan"]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #dbeafe",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#3b82f6"
              fill="url(#blueGrad)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-3 text-sm">
          Produk Terlaris
        </h3>
        <div className="space-y-3">
          {topProducts.map((p, i) => (
            <div key={p.name} className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-800 truncate">
                  {p.name}
                </p>
                <p className="text-xs text-slate-400">
                  {p.qty.toLocaleString("id-ID")} pcs terjual
                </p>
              </div>
            </div>
          ))}
          {topProducts.length === 0 && (
            <p className="text-slate-400 text-sm">Belum ada data penjualan</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-1 text-sm flex items-center gap-2">
          <TrendingUp size={15} className="text-amber-500" /> Prediksi Bulan
          Depan
        </h3>
        <p className="text-xs text-slate-400 mb-3">
          {nextMonth} — Moving Average 3 bln
        </p>
        <p
          className="text-2xl font-bold text-amber-600"
          style={{ fontFamily: "DM Mono, monospace" }}
        >
          {fmtRp(maPredict)}
        </p>
        <button
          onClick={() => onNavigate("predictions")}
          className="text-xs text-blue-600 mt-2 block"
        >
          Lihat detail prediksi →
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-3 text-sm flex items-center gap-2">
          <AlertTriangle size={15} className="text-red-500" /> Stok Menipis
        </h3>
        {lowStock.length === 0 ? (
          <p className="text-emerald-600 text-sm flex items-center gap-1.5">
            <CheckCircle size={15} /> Semua stok aman
          </p>
        ) : (
          <div className="space-y-2">
            {lowStock.slice(0, 4).map((p) => (
              <div key={p.id} className="flex justify-between items-center">
                <p className="text-xs text-slate-700 truncate flex-1">
                  {p.name}
                </p>
                <span
                  className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-md ml-2"
                  style={{ fontFamily: "DM Mono, monospace" }}
                >
                  {p.stock} pcs
                </span>
              </div>
            ))}
            {lowStock.length > 4 && (
              <p className="text-xs text-slate-400">
                +{lowStock.length - 4} lainnya
              </p>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-3 text-sm">
          Transaksi Terbaru
        </h3>
        <div className="space-y-2">
          {transactions.slice(0, 4).map((t) => (
            <div key={t.id} className="flex justify-between items-center">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-800 truncate">
                  {t.customerName}
                </p>
                <p className="text-xs text-slate-400">{fmtDate(t.date)}</p>
              </div>
              <span
                className="text-xs font-bold text-blue-700 ml-2 flex-shrink-0"
                style={{ fontFamily: "DM Mono, monospace" }}
              >
                {fmtRp(t.total)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
