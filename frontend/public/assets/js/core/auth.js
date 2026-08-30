import api from "./api-client.js";
export const TOKEN_KEY="smart_chain_access_token";
export const getToken=()=>localStorage.getItem(TOKEN_KEY);
export const logout=()=>{localStorage.removeItem(TOKEN_KEY);window.location.reload()};
export async function getCurrentUser(){if(!getToken()) return null;try{const {data}=await api.get("/auth/me");return data.user||null}catch{return null}}
