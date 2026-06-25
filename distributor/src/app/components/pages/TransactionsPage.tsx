import React, { useState } from "react";
import {
  Plus,
  Minus,
  Search,
  ShoppingCart,
  X,
  AlertTriangle,
  Wallet,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import type {
  Product,
  Transaction,
  TransactionItem,
  Customer,
  StockMovement,
} from "../../types";
import { fmtRp, uid, now } from "../../lib/utils";
import Modal from "../shared/Modal";
import { inputCls } from "../shared/FieldRow";

export default function TransactionsPage({
  products,
  setProducts,
  transactions,
  setTransactions,
  customers,
  stockMovements,
  setStockMovements,
}: {
  products: Product[];
  setProducts: (p: Product[]) => void;
  transactions: Transaction[];
  setTransactions: (t: Transaction[]) => void;
  customers: Customer[];
  stockMovements: StockMovement[];
  setStockMovements: (s: StockMovement[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<"all" | "cup" | "botol">("all");
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [customerName, setCustomerName] = useState("Umum");
  const [payMethod, setPayMethod] = useState<"cash" | "transfer">("cash");

  const filtered = products.filter(
    (p) =>
      (cat === "all" || p.category === cat) &&
      p.name.toLowerCase().includes(search.toLowerCase()),
  );
  const cartTotal = cart.reduce((s, c) => s + c.product.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  function addToCart(product: Product) {
    if (product.stock === 0) {
      toast.error("Stok produk habis!");
      return;
    }
    setCart((prev) => {
      const ex = prev.find((c) => c.product.id === product.id);
      if (ex) {
        if (ex.qty >= product.stock) {
          toast.error(`Stok ${product.name} hanya ${product.stock} pcs`);
          return prev;
        }
        return prev.map((c) =>
          c.product.id === product.id ? { ...c, qty: c.qty + 1 } : c,
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  }

  function adjustQty(id: string, delta: number) {
    setCart((prev) =>
      prev.flatMap((c) => {
        if (c.product.id !== id) return [c];
        const newQty = c.qty + delta;
        if (newQty <= 0) return [];
        if (newQty > c.product.stock) {
          toast.error(`Stok tidak mencukupi (maks. ${c.product.stock})`);
          return [c];
        }
        return [{ ...c, qty: newQty }];
      }),
    );
  }

  function saveTransaction() {
    if (cart.length === 0) {
      toast.error("Keranjang masih kosong");
      return;
    }
    if (!customerName.trim()) {
      toast.error("Nama pelanggan wajib diisi");
      return;
    }

    const items: TransactionItem[] = cart.map((c) => ({
      productId: c.product.id,
      productName: c.product.name,
      qty: c.qty,
      price: c.product.price,
    }));
    const txn: Transaction = {
      id: uid(),
      customerName: customerName.trim(),
      items,
      total: cartTotal,
      paymentMethod: payMethod,
      date: now(),
    };

    const newMovements: StockMovement[] = [];
    const newProducts = products.map((p) => {
      const c = cart.find((x) => x.product.id === p.id);
      if (!c) return p;
      const stockAfter = p.stock - c.qty;
      newMovements.push({
        id: uid(),
        productId: p.id,
        productName: p.name,
        type: "keluar",
        quantity: c.qty,
        stockBefore: p.stock,
        stockAfter,
        note: `Penjualan ke ${customerName.trim()}`,
        date: now(),
      });
      return { ...p, stock: stockAfter };
    });

    setTransactions([txn, ...transactions]);
    setProducts(newProducts);
    setStockMovements([...newMovements, ...stockMovements]);
    setCart([]);
    setCustomerName("Umum");
    setPayMethod("cash");
    setShowCart(false);
    toast.success(`Transaksi disimpan! Total ${fmtRp(cartTotal)}`);
    newProducts
      .filter((p) => p.stock <= p.minStock)
      .forEach((p) =>
        toast.warning(`Stok ${p.name} tersisa ${p.stock} pcs`, {
          duration: 5000,
        }),
      );
  }

  return (
    <div className="space-y-4 relative">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Transaksi</h2>
        <p className="text-slate-500 text-xs">
          Pilih produk untuk ditambahkan ke keranjang
        </p>
      </div>

      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari produk..."
          className={inputCls + " pl-9"}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {(["all", "cup", "botol"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${cat === c ? "bg-blue-600 text-white" : "bg-white border border-blue-100 text-slate-600"}`}
          >
            {c === "all" ? "Semua" : c === "cup" ? "Cup" : "Botol"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 pb-20">
        {filtered.map((p) => {
          const inCart = cart.find((c) => c.product.id === p.id);
          return (
            <button
              key={p.id}
              onClick={() => addToCart(p)}
              disabled={p.stock === 0}
              className={`bg-white border rounded-2xl p-3.5 text-left transition-all relative ${p.stock === 0 ? "opacity-50 border-slate-100" : "border-blue-100 active:scale-95"} ${inCart ? "border-blue-400 ring-2 ring-blue-100" : ""}`}
            >
              {inCart && (
                <span
                  className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full"
                  style={{ fontFamily: "DM Mono, monospace" }}
                >
                  {inCart.qty}
                </span>
              )}
              <div className="flex items-center gap-1.5 mb-1.5">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.category === "cup" ? "bg-sky-100 text-sky-700" : "bg-indigo-100 text-indigo-700"}`}
                >
                  {p.category === "cup" ? "Cup" : "Botol"}
                </span>
                {p.stock <= p.minStock && p.stock > 0 && (
                  <AlertTriangle size={11} className="text-orange-400" />
                )}
              </div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                {p.name}
              </p>
              <p
                className="text-blue-700 font-bold text-sm mt-1.5"
                style={{ fontFamily: "DM Mono, monospace" }}
              >
                {fmtRp(p.price)}
              </p>
              <p
                className={`text-xs mt-1 ${p.stock === 0 ? "text-red-500 font-medium" : "text-slate-400"}`}
              >
                {p.stock === 0 ? "Stok Habis" : `Stok: ${p.stock} pcs`}
              </p>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-10 text-slate-400 text-sm">
            Tidak ada produk ditemukan
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-24 left-4 right-4 bg-blue-600 active:bg-blue-700 text-white rounded-2xl py-3.5 px-4 flex items-center justify-between shadow-xl shadow-blue-300/50 z-30"
        >
          <span className="flex items-center gap-2.5">
            <span className="relative">
              <ShoppingCart size={19} />
              <span className="absolute -top-2 -right-2 bg-white text-blue-700 text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                {cartCount}
              </span>
            </span>
            <span className="text-sm font-semibold">Lihat Keranjang</span>
          </span>
          <span
            className="text-sm font-bold"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            {fmtRp(cartTotal)}
          </span>
        </button>
      )}

      {showCart && (
        <Modal title="Keranjang" onClose={() => setShowCart(false)}>
          <div className="flex items-center justify-end mb-2 -mt-2">
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="text-xs text-slate-400"
              >
                Kosongkan
              </button>
            )}
          </div>

          <div className="space-y-1">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-28 text-slate-300">
                <ShoppingCart size={28} className="mb-2" />
                <p className="text-sm">Keranjang kosong</p>
              </div>
            ) : (
              cart.map((c) => (
                <div
                  key={c.product.id}
                  className="flex items-center gap-2 py-2.5 border-b border-slate-50 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {c.product.name}
                    </p>
                    <p
                      className="text-xs text-blue-600 mt-0.5"
                      style={{ fontFamily: "DM Mono, monospace" }}
                    >
                      {fmtRp(c.product.price * c.qty)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => adjustQty(c.product.id, -1)}
                      className="w-8 h-8 bg-blue-50 active:bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"
                    >
                      <Minus size={13} />
                    </button>
                    <span
                      className="w-8 text-center text-sm font-bold"
                      style={{ fontFamily: "DM Mono, monospace" }}
                    >
                      {c.qty}
                    </span>
                    <button
                      onClick={() => adjustQty(c.product.id, 1)}
                      className="w-8 h-8 bg-blue-50 active:bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"
                    >
                      <Plus size={13} />
                    </button>
                    <button
                      onClick={() =>
                        setCart((prev) =>
                          prev.filter((x) => x.product.id !== c.product.id),
                        )
                      }
                      className="w-8 h-8 bg-red-50 active:bg-red-100 text-red-400 rounded-lg flex items-center justify-center ml-0.5"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100 mt-3">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  Pelanggan
                </label>
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  list="cust-list"
                  className={inputCls}
                  placeholder="Nama pelanggan"
                />
                <datalist id="cust-list">
                  <option value="Umum" />
                  {customers.map((c) => (
                    <option key={c.id} value={c.name} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPayMethod("cash")}
                    className={`py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${payMethod === "cash" ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "border border-slate-200 text-slate-600"}`}
                  >
                    <Wallet size={13} /> Cash
                  </button>
                  <button
                    onClick={() => setPayMethod("transfer")}
                    className={`py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${payMethod === "transfer" ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "border border-slate-200 text-slate-600"}`}
                  >
                    <CreditCard size={13} /> Transfer
                  </button>
                </div>
              </div>
              <div className="bg-blue-600 rounded-xl p-3.5 flex justify-between items-center">
                <span className="text-blue-100 text-sm font-medium">
                  Total Bayar
                </span>
                <span
                  className="text-white text-xl font-bold"
                  style={{ fontFamily: "DM Mono, monospace" }}
                >
                  {fmtRp(cartTotal)}
                </span>
              </div>
              <button
                onClick={saveTransaction}
                className="w-full bg-slate-900 active:bg-slate-800 text-white rounded-xl py-3.5 text-sm font-bold flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} /> Simpan Transaksi
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
