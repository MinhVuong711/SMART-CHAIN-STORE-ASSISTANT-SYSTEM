import axios from "https://cdn.jsdelivr.net/npm/axios@1.7.9/+esm";
const client=axios.create({baseURL:window.APP_CONFIG?.API_GATEWAY_URL||"http://localhost:3000",timeout:8000});
client.interceptors.request.use(config=>{const token=localStorage.getItem("smart_chain_access_token");if(token) config.headers.Authorization=`Bearer ${token}`;return config});
client.interceptors.response.use(r=>r,e=>{if([401,403].includes(e.response?.status)) window.dispatchEvent(new CustomEvent("api:auth-error",{detail:e.response.status}));return Promise.reject(e)});
export default client;
