import React, { useState } from "react";
import { createTransaction } from "../services/api";

function TransactionForm({ onSuccess }) {
  const [form, setForm] = useState({
    amount: "",
    location: "",
    type: "PAYMENT",
    recipientAccount: "",
    description: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);

    const data = {
      userId: 1,
      amount: parseFloat(form.amount),
      location: form.location,
      type: form.type,
      recipientAccount: form.recipientAccount || null,
      description: form.description || null,
    };

    try {
      const res = await createTransaction(data);
      setResult(res.data);
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (err) {
      setError("Failed to create transaction. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getResultClass = () => {
    if (!result) return "";
    if (result.status === "FRAUD") return "result-fraud";
    if (result.status === "SUSPICIOUS") return "result-suspicious";
    return "result-normal";
  };

  return (
    <div className="transaction-form-content">
      {result ? (
        <div className={`result-card ${getResultClass()}`}>
          <div className="result-icon">
            {result.status === "FRAUD" && "🚨"}
            {result.status === "SUSPICIOUS" && "⚠️"}
            {result.status === "NORMAL" && "✅"}
          </div>
          <h3>Transaction #{result.id}</h3>
          <p className="result-status">
            Status: <strong>{result.status}</strong>
          </p>
          <p>Risk Score: <strong>{((result.riskScore || 0) * 100).toFixed(0)}%</strong></p>
          <p>Amount: <strong>${result.amount?.toLocaleString()}</strong></p>
          <button className="btn btn-ghost" onClick={() => setResult(null)}>
            Create Another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="txn-amount">Amount ($)</label>
              <input
                id="txn-amount"
                type="number"
                name="amount"
                placeholder="0.00"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="txn-type">Type</label>
              <select
                id="txn-type"
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                <option value="PAYMENT">Payment</option>
                <option value="TRANSFER">Transfer</option>
                <option value="WITHDRAWAL">Withdrawal</option>
                <option value="DEPOSIT">Deposit</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="txn-location">Location</label>
            <input
              id="txn-location"
              type="text"
              name="location"
              placeholder="e.g. New York, FOREIGN, OFFSHORE"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="txn-recipient">Recipient Account (optional)</label>
            <input
              id="txn-recipient"
              type="text"
              name="recipientAccount"
              placeholder="e.g. ACC-12345"
              value={form.recipientAccount}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="txn-desc">Description (optional)</label>
            <input
              id="txn-desc"
              type="text"
              name="description"
              placeholder="Transaction description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <span className="spinner-inline"></span> : "Submit Transaction"}
          </button>
        </form>
      )}
    </div>
  );
}

export default TransactionForm;