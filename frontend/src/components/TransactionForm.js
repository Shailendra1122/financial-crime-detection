import React, { useState } from "react";
import { createTransaction } from "../services/api";

function TransactionForm() {
  const [amount, setAmount] = useState("");
  const [location, setLocation] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      userId: 1,
      amount: parseFloat(amount),
      location: location,
    };

    try {
      const res = await createTransaction(data);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Add Transaction</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="text"
          placeholder="Location (e.g. FOREIGN)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>

      {result && (
        <div>
          <h3>Result:</h3>
          <p>Status: {result.status}</p>
        </div>
      )}
    </div>
  );
}

export default TransactionForm;