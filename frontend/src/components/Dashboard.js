import React, { useEffect, useState } from "react";
import { getTransactions, getAlerts, getStats, resolveAlert } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TransactionForm from "./TransactionForm";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showForm, setShowForm] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [txRes, alertRes, statsRes] = await Promise.all([
        getTransactions(),
        getAlerts(),
        getStats(),
      ]);
      setTransactions(txRes.data);
      setAlerts(alertRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleResolve = async (id) => {
    try {
      await resolveAlert(id);
      fetchData();
    } catch (err) {
      console.error("Error resolving alert:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getStatusBadge = (status) => {
    const map = {
      FRAUD: "badge-danger",
      SUSPICIOUS: "badge-warning",
      NORMAL: "badge-success",
    };
    return `badge ${map[status] || "badge-default"}`;
  };

  const getSeverityBadge = (severity) => {
    const map = {
      CRITICAL: "badge-danger",
      HIGH: "badge-warning",
      MEDIUM: "badge-info",
      LOW: "badge-success",
    };
    return `badge ${map[severity] || "badge-default"}`;
  };

  const getRiskBar = (score) => {
    const percent = (score || 0) * 100;
    let color = "var(--color-success)";
    if (percent >= 70) color = "var(--color-danger)";
    else if (percent >= 40) color = "var(--color-warning)";
    return (
      <div className="risk-bar">
        <div
          className="risk-bar-fill"
          style={{ width: `${percent}%`, backgroundColor: color }}
        ></div>
        <span className="risk-bar-text">{percent.toFixed(0)}%</span>
      </div>
    );
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="url(#sgrad)" />
            <path d="M12 28V18l8-6 8 6v10H22v-6h-4v6H12z" fill="#fff" />
            <defs>
              <linearGradient id="sgrad" x1="0" y1="0" x2="40" y2="40">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <span>FCD System</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`sidebar-link ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
            id="nav-overview"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Overview
          </button>
          <button
            className={`sidebar-link ${activeTab === "transactions" ? "active" : ""}`}
            onClick={() => setActiveTab("transactions")}
            id="nav-transactions"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
            Transactions
          </button>
          <button
            className={`sidebar-link ${activeTab === "alerts" ? "active" : ""}`}
            onClick={() => setActiveTab("alerts")}
            id="nav-alerts"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            Alerts
            {alerts.filter((a) => !a.resolved).length > 0 && (
              <span className="sidebar-badge">
                {alerts.filter((a) => !a.resolved).length}
              </span>
            )}
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.username || "User"}</span>
              <span className="user-role">{user?.role || "ANALYST"}</span>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout} id="btn-logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header">
          <div>
            <h1>
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "transactions" && "Transaction Monitor"}
              {activeTab === "alerts" && "Fraud Alerts"}
            </h1>
            <p className="header-subtitle">
              Real-time financial crime detection and monitoring
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
            id="btn-new-transaction"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Transaction
          </button>
        </header>

        {/* Overview Tab */}
        {activeTab === "overview" && stats && (
          <div className="fade-in">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon stat-icon-blue">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                  </svg>
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Transactions</span>
                  <span className="stat-value">{stats.totalTransactions}</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon stat-icon-red">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
                  </svg>
                </div>
                <div className="stat-info">
                  <span className="stat-label">Fraudulent</span>
                  <span className="stat-value stat-danger">{stats.fraudulentTransactions}</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon stat-icon-yellow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div className="stat-info">
                  <span className="stat-label">Suspicious</span>
                  <span className="stat-value stat-warning">{stats.suspiciousTransactions}</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon stat-icon-green">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="stat-info">
                  <span className="stat-label">Normal</span>
                  <span className="stat-value stat-success">{stats.normalTransactions}</span>
                </div>
              </div>
            </div>

            <div className="cards-row">
              <div className="card">
                <div className="card-header">
                  <h3>Financial Summary</h3>
                </div>
                <div className="card-body">
                  <div className="summary-item">
                    <span>Total Volume</span>
                    <span className="summary-value">
                      ${stats.totalAmount?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || "0.00"}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span>Fraud Amount</span>
                    <span className="summary-value stat-danger">
                      ${stats.fraudAmount?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || "0.00"}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span>Detection Rate</span>
                    <span className="summary-value">
                      {stats.totalTransactions > 0
                        ? (
                            ((stats.fraudulentTransactions + stats.suspiciousTransactions) /
                              stats.totalTransactions) *
                            100
                          ).toFixed(1)
                        : "0"}
                      %
                    </span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3>Alert Status</h3>
                </div>
                <div className="card-body">
                  <div className="summary-item">
                    <span>Active Alerts</span>
                    <span className="summary-value stat-danger">{stats.activeAlerts}</span>
                  </div>
                  <div className="summary-item">
                    <span>Resolved Alerts</span>
                    <span className="summary-value stat-success">{stats.resolvedAlerts}</span>
                  </div>
                  <div className="summary-item">
                    <span>Resolution Rate</span>
                    <span className="summary-value">
                      {stats.activeAlerts + stats.resolvedAlerts > 0
                        ? (
                            (stats.resolvedAlerts /
                              (stats.activeAlerts + stats.resolvedAlerts)) *
                            100
                          ).toFixed(1)
                        : "100"}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions preview */}
            <div className="card">
              <div className="card-header">
                <h3>Recent Transactions</h3>
                <button
                  className="btn btn-ghost"
                  onClick={() => setActiveTab("transactions")}
                >
                  View All →
                </button>
              </div>
              <div className="card-body table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Amount</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>Risk</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 5).map((txn) => (
                      <tr key={txn.id}>
                        <td className="td-mono">#{txn.id}</td>
                        <td className="td-amount">${txn.amount?.toLocaleString()}</td>
                        <td>{txn.location}</td>
                        <td>{txn.type || "—"}</td>
                        <td>{getRiskBar(txn.riskScore)}</td>
                        <td>
                          <span className={getStatusBadge(txn.status)}>
                            {txn.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan="6" className="td-empty">
                          No transactions yet. Create one to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="fade-in">
            <div className="card">
              <div className="card-header">
                <h3>All Transactions</h3>
                <span className="card-count">{transactions.length} total</span>
              </div>
              <div className="card-body table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Amount</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Risk Score</th>
                      <th>Status</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn) => (
                      <tr key={txn.id} className={txn.status === "FRAUD" ? "row-fraud" : txn.status === "SUSPICIOUS" ? "row-suspicious" : ""}>
                        <td className="td-mono">#{txn.id}</td>
                        <td>User {txn.userId}</td>
                        <td className="td-amount">${txn.amount?.toLocaleString()}</td>
                        <td>{txn.location}</td>
                        <td>{txn.type || "—"}</td>
                        <td className="td-desc">{txn.description || "—"}</td>
                        <td>{getRiskBar(txn.riskScore)}</td>
                        <td>
                          <span className={getStatusBadge(txn.status)}>
                            {txn.status}
                          </span>
                        </td>
                        <td className="td-time">
                          {txn.timestamp
                            ? new Date(txn.timestamp).toLocaleString()
                            : "—"}
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan="9" className="td-empty">
                          No transactions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === "alerts" && (
          <div className="fade-in">
            <div className="card">
              <div className="card-header">
                <h3>Fraud Alerts</h3>
                <span className="card-count">
                  {alerts.filter((a) => !a.resolved).length} active
                </span>
              </div>
              <div className="card-body">
                {alerts.length === 0 ? (
                  <div className="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <h3>All Clear</h3>
                    <p>No fraud alerts at this time. The system is continuously monitoring.</p>
                  </div>
                ) : (
                  <div className="alert-list">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`alert-item ${alert.resolved ? "alert-resolved" : ""}`}
                      >
                        <div className="alert-left">
                          <span className={getSeverityBadge(alert.severity)}>
                            {alert.severity}
                          </span>
                          <div className="alert-details">
                            <span className="alert-txn">
                              Transaction #{alert.transactionId}
                            </span>
                            <p className="alert-message">{alert.message}</p>
                            <span className="alert-time">
                              {alert.timestamp
                                ? new Date(alert.timestamp).toLocaleString()
                                : "—"}
                            </span>
                          </div>
                        </div>
                        <div className="alert-right">
                          {alert.resolved ? (
                            <span className="badge badge-success">Resolved</span>
                          ) : (
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() => handleResolve(alert.id)}
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Transaction Form Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>New Transaction</h2>
                <button className="modal-close" onClick={() => setShowForm(false)}>
                  ×
                </button>
              </div>
              <TransactionForm
                onSuccess={() => {
                  setShowForm(false);
                  fetchData();
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;