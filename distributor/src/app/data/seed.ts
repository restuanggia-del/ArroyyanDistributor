import type { Product, Customer, Profile, StockMovement, Transaction } from "../types";

export const DEF_PROFILE: Profile = {
    name: "CV. Arroyyan Distribusi",
    phone: "081234567890",
    address: "Jl. Raya Distribusi No. 12, Jakarta Selatan",
    email: "admin@arroyyan.com",
    password: "admin123",
};

export const DEF_PRODUCTS: Product[] = [
    { id: "p1", name: "Arroyyan Cup Kecil", category: "cup", price: 500, stock: 130, minStock: 20 },
    { id: "p2", name: "Arroyyan Cup Besar", category: "cup", price: 650, stock: 85, minStock: 20 },
    { id: "p3", name: "Arroyyan Botol 330ml", category: "botol", price: 1200, stock: 60, minStock: 15 },
    { id: "p4", name: "Arroyyan Botol 600ml", category: "botol", price: 1500, stock: 12, minStock: 15 },
    { id: "p5", name: "Arroyyan Botol 1500ml", category: "botol", price: 2000, stock: 8, minStock: 10 },
];

export const DEF_CUSTOMERS: Customer[] = [
    { id: "c1", name: "Toko Berkah Jaya", phone: "081111111111", address: "Jl. Pasar Baru No. 5", createdAt: "2024-01-15" },
    { id: "c2", name: "Warung Makan Sederhana", phone: "082222222222", address: "Jl. Merdeka No. 10", createdAt: "2024-02-01" },
    { id: "c3", name: "Minimarket Maju", phone: "083333333333", address: "Jl. Sudirman No. 88", createdAt: "2024-02-20" },
    { id: "c4", name: "RM. Padang Murah Meriah", phone: "084444444444", address: "Jl. Gatot Subroto No. 3", createdAt: "2024-03-10" },
];

export function seedTransactions(): Transaction[] {
    const list: Transaction[] = [];
    const names = ["Toko Berkah Jaya", "Warung Makan Sederhana", "Minimarket Maju", "RM. Padang Murah Meriah", "Umum"];
    const prods = [
        { id: "p1", name: "Arroyyan Cup Kecil", price: 500 },
        { id: "p2", name: "Arroyyan Cup Besar", price: 650 },
        { id: "p3", name: "Arroyyan Botol 330ml", price: 1200 },
        { id: "p4", name: "Arroyyan Botol 600ml", price: 1500 },
    ];
    const base = Date.now();
    for (let i = 0; i < 70; i++) {
        const dt = new Date(base - Math.floor(Math.random() * 120) * 86400000);
        const itemCount = Math.floor(Math.random() * 3) + 1;
        const items = [];
        for (let j = 0; j < itemCount; j++) {
            const p = prods[Math.floor(Math.random() * prods.length)];
            const qty = (Math.floor(Math.random() * 10) + 1) * 10;
            items.push({ productId: p.id, productName: p.name, qty, price: p.price });
        }
        list.push({
            id: `t${i + 1}`,
            customerName: names[Math.floor(Math.random() * names.length)],
            items,
            total: items.reduce((s, x) => s + x.qty * x.price, 0),
            paymentMethod: Math.random() > 0.4 ? "cash" : "transfer",
            date: dt.toISOString(),
        });
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const DEF_STOCK: StockMovement[] = [
    { id: "s1", productId: "p1", productName: "Arroyyan Cup Kecil", type: "masuk", quantity: 50, stockBefore: 80, stockAfter: 130, note: "Restock dari gudang pusat", date: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: "s2", productId: "p2", productName: "Arroyyan Cup Besar", type: "keluar", quantity: 20, stockBefore: 105, stockAfter: 85, note: "Penjualan ke Toko Berkah Jaya", date: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: "s3", productId: "p4", productName: "Arroyyan Botol 600ml", type: "masuk", quantity: 12, stockBefore: 0, stockAfter: 12, note: "Stok awal", date: new Date(Date.now() - 10 * 86400000).toISOString() },
];
