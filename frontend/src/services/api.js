import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

// CREATE transaction
export const createTransaction = (data) =>
  API.post("/transactions", data);

// GET all transactions
export const getTransactions = () =>
  API.get("/transactions");

// GET all alerts
export const getAlerts = () =>
  API.get("/alerts");