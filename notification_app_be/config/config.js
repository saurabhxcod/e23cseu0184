import dotenv from 'dotenv';
dotenv.config();
export const BASE_URL = "http://4.224.186.213/evaluation-service";
export const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
export const PORT = process.env.PORT || 5000;