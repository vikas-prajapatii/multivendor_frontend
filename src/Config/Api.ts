import axios from 'axios';

export const DEPLOYED_URL = "https://multivendor-backend-1-vzb3.onrender.com";
export const API_URL = import.meta.env.VITE_API_BASE_URL || DEPLOYED_URL;

export const api = axios.create({
  baseURL: API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});