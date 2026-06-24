// ─── Types ───────────────────────────────────────────────────────────────────

export interface Product {
    id: string;
    name: string;
    category: "cup" | "botol";
    price: number;
    stock: number;
    minStock: number;
}

export interface StockMovement {
    id: string;
    productId: string;
    productName: string;
    type: "masuk" | "keluar" | "penyesuaian";
    quantity: number;
    stockBefore: number;
    stockAfter: number;
    note: string;
    date: string;
}

export interface TransactionItem {
    productId: string;
    productName: string;
    qty: number;
    price: number;
}

export interface Transaction {
    id: string;
    customerName: string;
    items: TransactionItem[];
    total: number;
    paymentMethod: "cash" | "transfer";
    date: string;
}

export interface Customer {
    id: string;
    name: string;
    phone: string;
    address: string;
    createdAt: string;
}

export interface Profile {
    name: string;
    phone: string;
    address: string;
    email: string;
    password: string;
}

export type Page =
    | "dashboard"
    | "products"
    | "stock"
    | "transactions"
    | "customers"
    | "history"
    | "reports"
    | "predictions"
    | "profile";
    