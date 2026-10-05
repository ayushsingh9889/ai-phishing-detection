// frontend/src/services/authService.js

import axios from "axios";

const API_URL = "https://ai-phishing-detection-0zwg.onrender.com/api";

/**
 * Register a new user
 */
export async function registerUser({ name, email, password }) {
  const response = await axios.post(`${API_URL}/auth/register`, {
    name,
    email,
    password,
  });
  return response.data;
}

/**
 * Login an existing user
 */
export async function loginUser({ email, password }) {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  return response.data;
}

/**
 * Get current user profile (requires token)
 */
export async function getCurrentUser(token) {
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
