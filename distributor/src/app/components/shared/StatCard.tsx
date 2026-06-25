import React from "react";

const ICON_COLOR: Record<string, string> = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-emerald-100 text-emerald-600",
  orange: "bg-orange-100 text-orange-600",
  red: "bg-red-100 text-red-600",
  purple: "bg-purple-100 text-purple-600",
  amber: "bg-amber-100 text-amber-600",
};

export default function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  color = "blue",
}: {
  title: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
            {title}
          </p>
          <p
            className="text-xl font-bold text-slate-900 mt-1 truncate"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            {value}
          </p>
          {sub && <p className="text-slate-400 text-xs mt-1 truncate">{sub}</p>}
        </div>
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ml-2 ${ICON_COLOR[color] || ICON_COLOR.blue}`}
        >
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}
