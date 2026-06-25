import React from "react";

export function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700 mb-1 block">
        {label}
      </label>
      {children}
    </div>
  );
}

export const inputCls =
  "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";
export const selectCls = inputCls;
