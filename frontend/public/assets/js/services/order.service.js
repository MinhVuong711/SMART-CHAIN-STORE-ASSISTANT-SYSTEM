import api from "../core/api-client.js"; export const getOrders=id=>api.get(`/orders?store_id=${id}`).then(r=>r.data);
