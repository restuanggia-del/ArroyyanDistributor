import React from "react";
import { Bell, Package2 } from "lucide-react";
import type { Profile } from "../../types";

export default function MobileHeader({
  title,
  subtitle,
  lowStockCount,
  onStockClick,
  onProfileClick,
  profile,
}: {
  title: string;
  subtitle: string;
  lowStockCount: number;
  onStockClick: () => void;
  onProfileClick: () => void;
  profile: Profile;
}) {
  return (
    <header className="flex-shrink-0 bg-blue-900 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-4 sticky top-0 z-30">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Package2 size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-white font-bold text-sm leading-tight truncate">
              {title}
            </h1>
            <p className="text-blue-300 text-xs truncate">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {lowStockCount > 0 && (
            <button
              onClick={onStockClick}
              className="relative w-9 h-9 bg-blue-800/60 rounded-xl flex items-center justify-center text-blue-100"
            >
              <Bell size={16} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center leading-none font-bold">
                {lowStockCount}
              </span>
            </button>
          )}
          <button
            onClick={onProfileClick}
            className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold"
          >
            {profile.name[0]}
          </button>
        </div>
      </div>
    </header>
  );
}
