import api from "../core/api-client.js"; export const getStores=()=>api.get("/stores?page=1&limit=100").then(r=>r.data);
