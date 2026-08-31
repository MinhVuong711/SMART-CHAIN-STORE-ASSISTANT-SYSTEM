import api from "../core/api-client.js";
const id=n=>{if(!Number.isInteger(Number(n))||Number(n)<=0)throw new Error("Mã cửa hàng không hợp lệ.");return Number(n)};
export const getStores=(page=1,limit=10)=>location.search.includes("preview=1")?Promise.resolve([]):api.get(`/stores?page=${page}&limit=${limit}`).then(r=>r.data);
export const getStoreById=n=>api.get(`/stores/${id(n)}`).then(r=>r.data);
export const createStore=payload=>api.post("/stores",payload).then(r=>r.data);
export const updateStore=(n,payload)=>api.put(`/stores/${id(n)}`,payload).then(r=>r.data);
export const deleteStore=n=>api.delete(`/stores/${id(n)}`).then(r=>r.data);
