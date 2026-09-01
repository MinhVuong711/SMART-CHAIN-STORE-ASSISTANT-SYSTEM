import api from '../core/api-client.js';
export async function askQuestion(question,storeId,options={}){if(typeof question!=='string'||!question.trim())throw new Error('QUESTION_REQUIRED');const id=Number(storeId);if(!Number.isInteger(id)||id<=0)throw new Error('INVALID_STORE');const {data}=await api.post('/ai/ask',{question:question.trim(),store_id:id},options);return data}
