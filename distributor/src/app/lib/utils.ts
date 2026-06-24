// ─── Utils ───────────────────────────────────────────────────────────────────

export const uid = () => Math.random().toString(36).slice(2, 9);

export const now = () => new Date().toISOString();

export const fmtRp = (n: number) => "Rp " + n.toLocaleString("id-ID");

export const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

export const fmtDT = (s: string) =>
    new Date(s).toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
    