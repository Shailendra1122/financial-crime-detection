import React, { useEffect, useState } from "react";
import { getTransactions, getAlerts } from "../services/api";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchTransactions();
    fetchAlerts();

    // Auto refresh every 3 seconds
    const interval = setInterval(() => {
      fetchTransactions();
      fetchAlerts();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await getTransactions();
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await getAlerts();
      setAlerts(res.data);
    } catch (err) {
      console.error("Error fetching alerts:", err);
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>📊 Transaction Dashboard</h2>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Amount</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((txn) => (
            <tr
              key={txn.id}
              style={{
                backgroundColor:
                  txn.status === "FRAUD" ? "#ff4d4d" : "#4dff88",
              }}
            >
              <td>{txn.id}</td>
              <td>{txn.userId}</td>
              <td>{txn.amount}</td>
              <td>{txn.location}</td>
              <td>{txn.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Alerts Section */}
      <h2 style={{ marginTop: "30px" }}>🚨 Fraud Alerts</h2>

      {alerts.length === 0 ? (
        <p>No alerts yet</p>
      ) : (
        <ul>
          {alerts.map((alert) => (
            <li key={alert.id}>
              🚨 <b>Transaction ID:</b> {alert.transactionId} |{" "}
              <b>Message:</b> {alert.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;