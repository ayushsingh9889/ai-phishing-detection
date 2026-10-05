// frontend/src/services/scanService.js

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Get JWT token from localStorage
 */
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
}

/**
 * POST /api/scan/url
 */
export async function scanUrl(url) {
  const response = await axios.post(
    `${API_URL}/scan/url`,
    { url },
    getAuthHeaders(),
  );
  return response.data;
}

export async function scanEmail(content) {
  const response = await axios.post(
    `${API_URL}/scan/email`,
    { content },
    getAuthHeaders(),
  );
  return response.data;
}

/**
 * GET /api/scan/history
 */
export async function getScanHistory() {
  const response = await axios.get(`${API_URL}/scan/history`, getAuthHeaders());
  return response.data;
}

// frontend/src/services/scanService.js

// Existing functions ke baad add karo:

export async function getDashboardStats() {
  const response = await axios.get(`${API_URL}/scan/stats`, getAuthHeaders());
  return response.data;
}
