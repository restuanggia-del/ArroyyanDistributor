import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Transaction } from "../../types";
import { fmtRp } from "../../lib/utils";

export default function PredictionsPage({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const today = new Date();

  const monthData = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - (11 - i), 1);
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
      d,
    };
  });

  const last3 = monthData.slice(-3);
  const maValue = Math.round(last3.reduce((s, m) => s + m.total, 0) / 3);

  const predictions = Array.from({ length: 3 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() + i + 1, 1);
    return {
      label: d.toLocaleDateString("id-ID", { month: "short", year: "2-digit" }),
      predicted: maValue,
      longLabel: d.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      }),
    };
  });

  const chartData = [
    ...monthData.map((m) => ({
      label: m.label,
      actual: m.total,
      predicted: null as number | null,
    })),
    {
      label: monthData[monthData.length - 1].label,
      actual: monthData[monthData.length - 1].total,
      predicted: maValue,
    },
    ...predictions.map((p) => ({
      label: p.label,
      actual: null as number | null,
      predicted: p.predicted,
    })),
  ].filter(
    (v, i, arr) =>
      !(i > 0 && arr[i - 1].label === v.label && v.actual !== null),
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Prediksi Penjualan</h2>
        <p className="text-slate-500 text-xs">Metode Moving Average 3 Bulan</p>
      </div>

      <div className="bg-blue-900 rounded-2xl p-5 text-white">
        <p className="text-blue-300 text-xs font-medium uppercase tracking-wider mb-3">
          Formula Moving Average
        </p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {last3.map((m, i) => (
            <div
              key={i}
              className="bg-blue-800/50 rounded-xl p-2.5 border border-blue-700/50"
            >
              <p className="text-blue-300 text-xs truncate">
                {m.d.toLocaleDateString("id-ID", { month: "short" })}
              </p>
              <p
                className="text-white font-bold mt-1 text-xs"
                style={{ fontFamily: "DM Mono, monospace" }}
              >
                {fmtRp(m.total)}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center text-blue-300 text-xs mb-4 leading-relaxed">
          ({fmtRp(last3[0].total)} + {fmtRp(last3[1].total)} +{" "}
          {fmtRp(last3[2].total)}) ÷ 3
        </div>
        <div className="bg-blue-500 rounded-xl p-4 flex justify-between items-center gap-2">
          <div className="min-w-0">
            <p className="text-blue-100 text-xs">Prediksi Bulan Depan</p>
            <p className="text-blue-100 text-xs truncate">
              {predictions[0].longLabel}
            </p>
          </div>
          <p
            className="text-white text-xl font-bold flex-shrink-0"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            {fmtRp(maValue)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-blue-100 p-4 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-3 text-sm">
          Aktual vs Prediksi
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              interval={1}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip
              formatter={(v: number, name: string) => [
                fmtRp(v),
                name === "actual" ? "Aktual" : "Prediksi",
              ]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #dbeafe",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
              connectNulls={false}
              name="actual"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#f59e0b"
              strokeWidth={2.5}
              strokeDasharray="6 3"
              dot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }}
              connectNulls={false}
              name="predicted"
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-5 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-0.5 bg-blue-500 rounded-full" />
            <span className="text-xs text-slate-500">Aktual</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              style={{ borderTop: "2px dashed #f59e0b", width: 20, height: 0 }}
            />
            <span className="text-xs text-slate-500">Prediksi</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {predictions.map((p, i) => (
          <div
            key={i}
            className="bg-white border border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-sm"
          >
            <div>
              <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide">
                {i === 0
                  ? "Bulan Depan"
                  : i === 1
                    ? "2 Bulan Lagi"
                    : "3 Bulan Lagi"}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">{p.longLabel}</p>
            </div>
            <div className="text-right">
              <p
                className="text-lg font-bold text-amber-700"
                style={{ fontFamily: "DM Mono, monospace" }}
              >
                {fmtRp(p.predicted)}
              </p>
              <p className="text-xs text-amber-500">Prediksi MA3</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
