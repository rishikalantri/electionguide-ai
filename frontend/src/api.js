/**
 * Centralized API client for ElectionGuide AI.
 *
 * VITE_API_URL is baked in at build time by Vite (it reads from the
 * VITE_API_URL environment variable / Docker ARG during `npm run build`).
 *
 * Fallback chain:
 *   1. VITE_API_URL set at build time  → production Cloud Run backend URL
 *   2. Hard-coded localhost:5001        → local development
 *
 * Never use relative paths like '/api/chat' — they resolve to the frontend
 * service URL in production, not the backend service.
 */

import axios from 'axios';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

export default api;
