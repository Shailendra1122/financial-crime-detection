asimport axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (credentials) => API.post("/auth/login", credentials);
export const register = (data) => API.post("/auth/register", data);

// Transactions
export const createTransaction = (data) => API.post("/transactions", data);
export const getTransactions = () => API.get("/transactions");
export const getTransactionsByStatus = (status) =>
  API.get(`/transactions/status/${status}`);
export const getStats = () => API.get("/transactions/stats");

// Alerts
export const getAlerts = () => API.get("/alerts");
export const getActiveAlerts = () => API.get("/alerts/active");
export const resolveAlert = (id) => API.put(`/alerts/${id}/resolve`);