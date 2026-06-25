import React, { useState } from "react";
import {
  LayoutDashboard,
  Layers,
  ShoppingCart,
  Users,
  MoreHorizontal,
  Package,
  History,
  FileText,
  TrendingUp,
  User,
  ChevronRight,
} from "lucide-react";
import type { Page } from "../../types";
import Modal from "../shared/Modal";

const MAIN_NAV: { page: Page; icon: React.ElementType; label: string }[] = [
  { page: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { page: "transactions", icon: ShoppingCart, label: "Transaksi" },
  { page: "stock", icon: Layers, label: "Stok" },
  { page: "customers", icon: Users, label: "Pelanggan" },
];

const MORE_NAV: {
  page: Page;
  icon: React.ElementType;
  label: string;
  desc: string;
}[] = [
  {
    page: "products",
    icon: Package,
    label: "Produk",
    desc: "Kelola daftar produk & harga",
  },
  {
    page: "history",
    icon: History,
    label: "Riwayat",
    desc: "Riwayat semua transaksi",
  },
  {
    page: "reports",
    icon: FileText,
    label: "Laporan",
    desc: "Ringkasan penjualan & stok",
  },
  {
    page: "predictions",
    icon: TrendingUp,
    label: "Prediksi",
    desc: "Prediksi penjualan bulan depan",
  },
  {
    page: "profile",
    icon: User,
    label: "Profil",
    desc: "Informasi akun & keamanan",
  },
];

export default function BottomNav({
  current,
  onChange,
  lowStockCount,
}: {
  current: Page;
  onChange: (p: Page) => void;
  lowStockCount: number;
}) {
  const [showMore, setShowMore] = useState(false);
  const isMoreActive = MORE_NAV.some((m) => m.page === current);

  function go(page: Page) {
    onChange(page);
    setShowMore(false);
  }

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-100 flex items-stretch z-40"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {MAIN_NAV.map(({ page, icon: Icon, label }) => {
          const active = current === page;
          return (
            <button
              key={page}
              onClick={() => go(page)}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 relative"
            >
              <Icon
                size={20}
                className={active ? "text-blue-600" : "text-slate-400"}
              />
              <span
                className={`text-[11px] font-medium ${active ? "text-blue-600" : "text-slate-400"}`}
              >
                {label}
              </span>
              {page === "stock" && lowStockCount > 0 && (
                <span className="absolute top-1.5 right-1/4 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center leading-none font-bold">
                  {lowStockCount}
                </span>
              )}
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
        <button
          onClick={() => setShowMore(true)}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 relative"
        >
          <MoreHorizontal
            size={20}
            className={isMoreActive ? "text-blue-600" : "text-slate-400"}
          />
          <span
            className={`text-[11px] font-medium ${isMoreActive ? "text-blue-600" : "text-slate-400"}`}
          >
            Lainnya
          </span>
          {isMoreActive && (
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
      </nav>

      {showMore && (
        <Modal title="Menu Lainnya" onClose={() => setShowMore(false)}>
          <div className="space-y-1 pb-2">
            {MORE_NAV.map(({ page, icon: Icon, label, desc }) => (
              <button
                key={page}
                onClick={() => go(page)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors ${current === page ? "bg-blue-50" : "hover:bg-slate-50"}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${current === page ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"}`}
                >
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    {label}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{desc}</p>
                </div>
                <ChevronRight
                  size={16}
                  className="text-slate-300 flex-shrink-0"
                />
              </button>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}
