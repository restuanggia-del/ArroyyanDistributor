import React, { useState, useMemo } from "react";
import { Toaster } from "sonner";

import type {
  Product,
  StockMovement,
  Transaction,
  Customer,
  Profile,
  Page,
} from "./types";
import { K, load, persist } from "./lib/storage";
import {
  DEF_PROFILE,
  DEF_PRODUCTS,
  DEF_CUSTOMERS,
  DEF_STOCK,
  seedTransactions,
} from "./data/seed";

import ProductsPage from "./components/pages/ProductsPage";
import StockPage from "./components/pages/StockPage";
import TransactionsPage from "./components/pages/TransactionsPage";
import CustomersPage from "./components/pages/CustomersPage";
import HistoryPage from "./components/pages/HistoryPage";
import ReportsPage from "./components/pages/ReportsPage";
import PredictionsPage from "./components/pages/PredictionsPage";
import ProfilePage from "./components/pages/ProfilePage";
import MobileHeader from "./components/layout/MobileHeader";
import BottomNav from "./components/layout/BottomNav";
import LoginPage from "./components/pages/LoginPage";
import Dashboard from "./components/pages/Dashboard";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => load<{ ok: boolean }>(K.session, { ok: false }).ok,
  );
  const [page, setPage] = useState<Page>("dashboard");

  const [products, setProductsRaw] = useState<Product[]>(() =>
    load(K.products, DEF_PRODUCTS),
  );
  const [stockMovements, setStockMovementsRaw] = useState<StockMovement[]>(() =>
    load(K.stock, DEF_STOCK),
  );
  const [transactions, setTransactionsRaw] = useState<Transaction[]>(() =>
    load(K.transactions, seedTransactions()),
  );
  const [customers, setCustomersRaw] = useState<Customer[]>(() =>
    load(K.customers, DEF_CUSTOMERS),
  );
  const [profile, setProfileRaw] = useState<Profile>(() =>
    load(K.profile, DEF_PROFILE),
  );

  function setProducts(p: Product[]) {
    setProductsRaw(p);
    persist(K.products, p);
  }
  function setStockMovements(s: StockMovement[]) {
    setStockMovementsRaw(s);
    persist(K.stock, s);
  }
  function setTransactions(t: Transaction[]) {
    setTransactionsRaw(t);
    persist(K.transactions, t);
  }
  function setCustomers(c: Customer[]) {
    setCustomersRaw(c);
    persist(K.customers, c);
  }
  function setProfile(p: Profile) {
    setProfileRaw(p);
    persist(K.profile, p);
  }

  const lowStockCount = useMemo(
    () => products.filter((p) => p.stock <= p.minStock).length,
    [products],
  );

  const PAGE_TITLES: Record<Page, { title: string; subtitle: string }> = {
    dashboard: {
      title: "Dashboard",
      subtitle: new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    },
    products: {
      title: "Manajemen Produk",
      subtitle: `${products.length} produk terdaftar`,
    },
    stock: {
      title: "Manajemen Stok",
      subtitle: `${lowStockCount} produk menipis`,
    },
    transactions: {
      title: "Transaksi Penjualan",
      subtitle: "Buat transaksi baru",
    },
    customers: {
      title: "Pelanggan",
      subtitle: `${customers.length} pelanggan`,
    },
    history: {
      title: "Riwayat Transaksi",
      subtitle: `${transactions.length} transaksi`,
    },
    reports: { title: "Laporan", subtitle: "Ringkasan penjualan & stok" },
    predictions: {
      title: "Prediksi Penjualan",
      subtitle: "Moving Average 3 bulan",
    },
    profile: { title: "Profil", subtitle: profile.name },
  };

  function logout() {
    persist(K.session, { ok: false });
    setIsLoggedIn(false);
    setPage("dashboard");
  }

  if (!isLoggedIn) {
    return (
      <>
        <Toaster position="top-center" richColors />
        <LoginPage onLogin={() => setIsLoggedIn(true)} profile={profile} />
      </>
    );
  }

  const pt = PAGE_TITLES[page];

  return (
    <>
      <Toaster position="top-center" richColors />
      {/* Mobile shell: single column, content scrolls, bottom nav fixed */}
      <div
        className="flex flex-col h-screen w-full overflow-hidden bg-[#f0f5ff]"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <MobileHeader
          title={pt.title}
          subtitle={pt.subtitle}
          lowStockCount={lowStockCount}
          onStockClick={() => setPage("stock")}
          onProfileClick={() => setPage("profile")}
          profile={profile}
        />

        <main className="flex-1 overflow-y-auto pb-24">
          <div className="p-4">
            {page === "dashboard" && (
              <Dashboard
                transactions={transactions}
                products={products}
                onNavigate={setPage}
              />
            )}
            {page === "products" && (
              <ProductsPage products={products} setProducts={setProducts} />
            )}
            {page === "stock" && (
              <StockPage
                products={products}
                setProducts={setProducts}
                stockMovements={stockMovements}
                setStockMovements={setStockMovements}
              />
            )}
            {page === "transactions" && (
              <TransactionsPage
                products={products}
                setProducts={setProducts}
                transactions={transactions}
                setTransactions={setTransactions}
                customers={customers}
                stockMovements={stockMovements}
                setStockMovements={setStockMovements}
              />
            )}
            {page === "customers" && (
              <CustomersPage
                customers={customers}
                setCustomers={setCustomers}
                transactions={transactions}
              />
            )}
            {page === "history" && <HistoryPage transactions={transactions} />}
            {page === "reports" && (
              <ReportsPage transactions={transactions} products={products} />
            )}
            {page === "predictions" && (
              <PredictionsPage transactions={transactions} />
            )}
            {page === "profile" && (
              <ProfilePage
                profile={profile}
                setProfile={setProfile}
                onLogout={logout}
              />
            )}
          </div>
        </main>

        <BottomNav
          current={page}
          onChange={setPage}
          lowStockCount={lowStockCount}
        />
      </div>
    </>
  );
}
