import React from "react";
import TransactionForm from "./components/TransactionForm";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🚨 Financial Crime Detection System</h1>

      {/* Transaction Input Form */}
      <TransactionForm />

      {/* Dashboard Section */}
      <Dashboard />
    </div>
  );
}

export default App;