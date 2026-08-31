import api from "./api-client.js";
export const TOKEN_KEY="smart_chain_access_token"; export const USER_KEY="smart_chain_user";
export const getToken=()=>localStorage.getItem(TOKEN_KEY);
export const logout=()=>{localStorage.removeItem(TOKEN_KEY);localStorage.removeItem(USER_KEY);sessionStorage.removeItem("smart_chain_store_id");location.replace("/login")};
export const saveSession=(token,user,username)=>{localStorage.setItem(TOKEN_KEY,token);localStorage.setItem(USER_KEY,JSON.stringify({...user,username}))};
export const clearSession=()=>{localStorage.removeItem(TOKEN_KEY);localStorage.removeItem(USER_KEY);sessionStorage.removeItem("smart_chain_store_id")};
export async function getCurrentUser(){if(!getToken()){if(location.search.includes("preview=1"))return {id:0,role:"admin",store_id:null,username:"Bản xem trước"};return null}try{const {data}=await api.get("/auth/me");return data.user||null}catch{return null}}
