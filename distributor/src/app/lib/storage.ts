// ─── Storage ──────────────────────────────────────────────────────────────────

export const K = {
    products: "d_products",
    stock: "d_stock",
    transactions: "d_txns",
    customers: "d_customers",
    profile: "d_profile",
    session: "d_session",
};

export function load<T>(key: string, def: T): T {
    try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : def;
    } catch {
        return def;
    }
}

export function persist<T>(key: string, v: T) {
    localStorage.setItem(key, JSON.stringify(v));
}
