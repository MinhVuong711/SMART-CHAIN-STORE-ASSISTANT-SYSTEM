export const money=value=>Number.isFinite(Number(value))?`${Number(value).toLocaleString("vi-VN")} ₫` : "—";
export const integer=value=>Number.isFinite(Number(value))?Number(value).toLocaleString("vi-VN"):"—";
export const date=value=>{const d=new Date(value);return value&&!Number.isNaN(d.getTime())?d.toLocaleDateString("vi-VN"):"—"};
