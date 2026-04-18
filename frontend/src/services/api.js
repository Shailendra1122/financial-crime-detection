import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080"
});

export const sendTransaction = (data) => {
  return API.post("/transactions", data);
};