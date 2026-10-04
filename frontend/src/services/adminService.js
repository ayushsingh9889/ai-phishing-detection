// frontend/src/services/adminService.js

import axios from "axios";

const API_URL = "http://localhost:5000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
}

export async function getAdminStats() {
  const res = await axios.get(`${API_URL}/admin/stats`, getAuthHeaders());
  return res.data;
}

export async function getAllUsers() {
  const res = await axios.get(`${API_URL}/admin/users`, getAuthHeaders());
  return res.data;
}

export async function getAllLogs() {
  const res = await axios.get(`${API_URL}/admin/logs`, getAuthHeaders());
  return res.data;
}

export async function updateUserRole(id, role) {
  const res = await axios.patch(
    `${API_URL}/admin/users/${id}/role`,
    { role },
    getAuthHeaders(),
  );
  return res.data;
}
