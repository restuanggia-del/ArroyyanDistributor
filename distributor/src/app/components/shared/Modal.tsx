import React from "react";
import { X } from "lucide-react";

export default function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex flex-col justify-end z-50">
      <button aria-label="Tutup" onClick={onClose} className="flex-1 w-full" />
      <div className="bg-white rounded-t-3xl w-full max-h-[88vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom">
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1.5 bg-slate-200 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 pt-2 pb-4 flex-shrink-0">
          <h3 className="font-bold text-slate-900 text-base">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
