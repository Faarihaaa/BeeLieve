import QRVerification from "./QRVerification.jsx";
import Batches from "./Batches.jsx";
import HoneyProduction from "./HoneyProduction.jsx";
import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  Home,
  Activity,
  Bell,
  Brain,
  Package,
  QrCode,
  RefreshCw,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Wifi,
} from "lucide-react";

import Hives from "./Hives.jsx";
import Sensors from "./Sensors.jsx";
import Alerts from "./Alerts.jsx";
import AIInsights from "./AIInsights.jsx";

import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [hives, setHives] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =====================================================
  // LOAD HIVES FROM BACKEND
  // =====================================================

  const loadHives = () => {
    fetch("http://localhost:5000/api/hives")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load hives");
        }

        return response.json();
      })
      .then((data) => {
        setHives(data);
      })
      .catch((error) => {
        console.error("Error loading hives:", error);
      });
  };

  // =====================================================
  // AUTO REFRESH
  // =====================================================

  useEffect(() => {
    loadHives();

    const interval = setInterval(() => {
      loadHives();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // =====================================================
  // DASHBOARD COUNTS
  // =====================================================

  const totalHives = hives.length;

  const healthyHives = hives.filter(
    (hive) => hive.status === "Healthy"
  ).length;

  const attentionHives = hives.filter(
    (hive) => hive.status === "Needs Attention"
  ).length;

  const criticalHives = hives.filter(
    (hive) => hive.status === "Critical"
  ).length;

  const healthPercentage =
    totalHives > 0
      ? Math.round((healthyHives / totalHives) * 100)
      : 0;

  // =====================================================
  // NAVIGATION
  // =====================================================

  const navigateTo = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  // =====================================================
  // PAGE TITLE
  // =====================================================

  const getPageTitle = () => {
    switch (activePage) {
      case "dashboard":
        return "Dashboard";

      case "hives":
        return "Hives";

      case "sensors":
        return "Sensors";

      case "alerts":
        return "Alerts";

      case "ai":
        return "AI Insights";

      case "production":
        return "Honey Production";

      case "batches":
        return "Honey Batches";

      case "qr":
        return "QR Verification";

      case "sync":
        return "Sync Center";

      case "settings":
        return "Settings";

      default:
        return "Dashboard";
    }
  };

  // =====================================================
  // DASHBOARD
  // =====================================================

  const Dashboard = () => {
    return (
      <div className="page-content">

        {/* ================= HEADER ================= */}

        <div className="dashboard-header">
          <div>
            <h1>Good morning 👋</h1>

            <p>
              Monitor your hives and manage your beekeeping operations.
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={loadHives}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* ================= STAT CARDS ================= */}

        <div className="stats-grid">

          {/* TOTAL HIVES */}

          <div className="stat-card">
            <div className="stat-icon">
              <Home size={24} />
            </div>

            <div>
              <span>Total Hives</span>
              <strong>{totalHives}</strong>
            </div>
          </div>

          {/* HEALTHY */}

          <div className="stat-card">
            <div className="stat-icon healthy-icon">
              <Activity size={24} />
            </div>

            <div>
              <span>Healthy</span>
              <strong>{healthyHives}</strong>
            </div>
          </div>

          {/* ATTENTION */}

          <div className="stat-card">
            <div className="stat-icon attention-icon">
              <Bell size={24} />
            </div>

            <div>
              <span>Needs Attention</span>
              <strong>{attentionHives}</strong>
            </div>
          </div>

          {/* CRITICAL */}

          <div className="stat-card">
            <div className="stat-icon critical-icon">
              <Bell size={24} />
            </div>

            <div>
              <span>Critical</span>
              <strong>{criticalHives}</strong>
            </div>
          </div>
        </div>

        {/* ================= DASHBOARD GRID ================= */}

        <div className="dashboard-grid">

          {/* HIVE HEALTH */}

          <div className="dashboard-card health-card">

            <div className="card-header">
              <div>
                <h2>Hive Health</h2>
                <p>Current overall hive condition</p>
              </div>

              <Activity size={22} />
            </div>

            <div className="health-content">

              <div className="health-circle">
                <div>
                  <strong>{healthPercentage}%</strong>
                  <span>Healthy</span>
                </div>
              </div>

              <div className="health-details">

                <div>
                  <span className="health-dot healthy-dot"></span>
                  <p>Healthy</p>
                  <strong>{healthyHives}</strong>
                </div>

                <div>
                  <span className="health-dot attention-dot"></span>
                  <p>Attention</p>
                  <strong>{attentionHives}</strong>
                </div>

                <div>
                  <span className="health-dot critical-dot"></span>
                  <p>Critical</p>
                  <strong>{criticalHives}</strong>
                </div>

              </div>
            </div>
          </div>

          {/* ACTIVE ALERTS */}

          <div className="dashboard-card">

            <div className="card-header">
              <div>
                <h2>Active Alerts</h2>
                <p>Issues requiring attention</p>
              </div>

              <Bell size={22} />
            </div>

            <div className="dashboard-alerts">

              {/* CRITICAL ALERT */}

              {criticalHives > 0 && (
                <div className="dashboard-alert critical-alert">

                  <Bell size={18} />

                  <div>
                    <strong>
                      {criticalHives} critical hive
                      {criticalHives > 1 ? "s" : ""}
                    </strong>

                    <p>
                      Immediate inspection recommended.
                    </p>
                  </div>

                </div>
              )}

              {/* ATTENTION ALERT */}

              {attentionHives > 0 && (
                <div className="dashboard-alert attention-alert">

                  <Bell size={18} />

                  <div>
                    <strong>
                      {attentionHives} hive
                      {attentionHives > 1 ? "s" : ""}
                      {" "}need attention
                    </strong>

                    <p>
                      Monitor environmental conditions.
                    </p>
                  </div>

                </div>
              )}

              {/* NO ALERTS */}

              {criticalHives === 0 &&
                attentionHives === 0 && (
                  <div className="no-dashboard-alerts">

                    <Activity size={25} />

                    <p>
                      All hives are currently healthy.
                    </p>

                  </div>
                )}

            </div>
          </div>
        </div>

        {/* ================= RECENT HIVE READINGS ================= */}

        <div className="dashboard-card recent-hives-card">

          <div className="card-header">

            <div>
              <h2>Recent Hive Readings</h2>

              <p>
                Latest environmental information from your hives
              </p>
            </div>

            <button
              className="view-all-button"
              onClick={() => navigateTo("hives")}
            >
              View All
              <ChevronRight size={16} />
            </button>

          </div>

          {/* NO HIVES */}

          {hives.length === 0 ? (

            <div className="empty-dashboard">

              <Home size={35} />

              <h3>No hives added</h3>

              <p>
                Add your first hive to start monitoring.
              </p>

              <button
                className="primary-button"
                onClick={() => navigateTo("hives")}
              >
                Add Hive
              </button>

            </div>

          ) : (

            /* HIVES */

            <div className="dashboard-hive-list">

              {hives.slice(0, 5).map((hive) => (

                <div
                  className="dashboard-hive-row"
                  key={hive.id}
                >

                  {/* HIVE */}

                  <div className="dashboard-hive-name">

                    <div className="small-bee-icon">
                      🐝
                    </div>

                    <div>

                      <strong>
                        {hive.id}
                      </strong>

                      <span>
                        {hive.location}
                      </span>

                    </div>

                  </div>

                  {/* TEMPERATURE */}

                  <div className="dashboard-reading">

                    <span>
                      Temperature
                    </span>

                    <strong>
                      {hive.temperature ?? "--"}°C
                    </strong>

                  </div>

                  {/* HUMIDITY */}

                  <div className="dashboard-reading">

                    <span>
                      Humidity
                    </span>

                    <strong>
                      {hive.humidity ?? "--"}%
                    </strong>

                  </div>

                  {/* STATUS */}

                  <div
                    className={`dashboard-status ${
                      hive.status === "Healthy"
                        ? "status-healthy"
                        : hive.status === "Critical"
                        ? "status-critical"
                        : "status-attention"
                    }`}
                  >
                    {hive.status}
                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
    );
  };

  // =====================================================
  // COMING SOON
  // =====================================================

  const ComingSoon = ({
    title,
    description,
    icon,
  }) => {
    return (
      <div className="page-content">

        <div className="coming-soon">

          <div className="coming-soon-icon">
            {icon}
          </div>

          <h1>
            {title}
          </h1>

          <p>
            {description}
          </p>

          <span className="coming-badge">
            Coming Soon
          </span>

        </div>

      </div>
    );
  };

  // =====================================================
  // PAGE ROUTER
  // =====================================================

  const renderPage = () => {

    switch (activePage) {

      case "dashboard":
        return <Dashboard />;

      case "hives":
        return <Hives />;

      case "sensors":
        return <Sensors />;

      case "alerts":
        return <Alerts />;

      case "ai":
        return <AIInsights />;

      case "production":
  return <HoneyProduction />;

      case "batches":
  return <Batches />;

case "qr":
  return <QRVerification />;
      case "sync":
        return (
          <ComingSoon
            title="Sync Center"
            description="Manage offline data and synchronize it when internet is available."
            icon={<RefreshCw size={45} />}
          />
        );

      case "settings":
        return (
          <ComingSoon
            title="Settings"
            description="Manage BeeLieve preferences and system settings."
            icon={<Settings size={45} />}
          />
        );

      default:
        return <Dashboard />;
    }
  };

  // =====================================================
  // APP UI
  // =====================================================

  return (
    <div className="app">

      {/* ================= MOBILE MENU ================= */}

      <button
        className="mobile-menu-button"
        onClick={() =>
          setSidebarOpen(!sidebarOpen)
        }
      >
        {sidebarOpen ? (
          <X size={22} />
        ) : (
          <Menu size={22} />
        )}
      </button>

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >

        {/* ================= BRAND ================= */}

        <div className="brand">

          <div className="brand-bee">
            🐝
          </div>

          <div>

            <h2>
              BeeLieve
            </h2>

            <span>
              Smart Beekeeping
            </span>

          </div>

        </div>

        {/* ================= MAIN MENU ================= */}

        <div className="nav-section">

          <p className="nav-title">
            MAIN MENU
          </p>

          {/* DASHBOARD */}

          <button
            className={`nav-item ${
              activePage === "dashboard"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigateTo("dashboard")
            }
          >
            <LayoutDashboard size={21} />

            <span>
              Dashboard
            </span>
          </button>

          {/* HIVES */}

          <button
            className={`nav-item ${
              activePage === "hives"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigateTo("hives")
            }
          >
            <Home size={21} />

            <span>
              Hives
            </span>
          </button>

          {/* SENSORS */}

          <button
            className={`nav-item ${
              activePage === "sensors"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigateTo("sensors")
            }
          >
            <Activity size={21} />

            <span>
              Sensors
            </span>
          </button>

          {/* ALERTS */}

          <button
            className={`nav-item ${
              activePage === "alerts"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigateTo("alerts")
            }
          >
            <Bell size={21} />

            <span>
              Alerts
            </span>

            {criticalHives + attentionHives > 0 && (
              <span className="nav-badge">
                {criticalHives + attentionHives}
              </span>
            )}
          </button>

          {/* AI INSIGHTS */}

          <button
            className={`nav-item ${
              activePage === "ai"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigateTo("ai")
            }
          >
            <Brain size={21} />

            <span>
              AI Insights
            </span>
          </button>

        </div>

        {/* ================= MANAGEMENT ================= */}

        <div className="nav-section">

          <p className="nav-title">
            MANAGEMENT
          </p>

          {/* HONEY PRODUCTION */}

          <button
            className={`nav-item ${
              activePage === "production"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigateTo("production")
            }
          >
            <Package size={21} />

            <span>
              Honey Production
            </span>
          </button>

          {/* HONEY BATCHES */}

          <button
            className={`nav-item ${
              activePage === "batches"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigateTo("batches")
            }
          >
            <Package size={21} />

            <span>
              Honey Batches
            </span>
          </button>

          {/* QR VERIFICATION */}

          <button
            className={`nav-item ${
              activePage === "qr"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigateTo("qr")
            }
          >
            <QrCode size={21} />

            <span>
              QR Verification
            </span>
          </button>

          {/* SYNC CENTER */}

          <button
            className={`nav-item ${
              activePage === "sync"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigateTo("sync")
            }
          >
            <RefreshCw size={21} />

            <span>
              Sync Center
            </span>
          </button>

        </div>

        {/* ================= SIDEBAR FOOTER ================= */}

        <div className="sidebar-footer">

          {/* SETTINGS */}

          <button
            className={`nav-item ${
              activePage === "settings"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigateTo("settings")
            }
          >
            <Settings size={21} />

            <span>
              Settings
            </span>
          </button>

          {/* SYSTEM STATUS */}

          <div className="system-status">

            <div className="system-status-icon">
              <Wifi size={16} />
            </div>

            <div>

              <strong>
                System Online
              </strong>

              <span>
                BeeLieve connected
              </span>

            </div>

          </div>

          {/* LOGOUT */}

          <button
            className="logout-button"
            onClick={() =>
              alert(
                "Logout functionality will be added later."
              )
            }
          >
            <LogOut size={19} />

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="main">

        {/* ================= TOP BAR ================= */}

        <header className="topbar">

          <div className="breadcrumb">

            <span>
              BeeLieve
            </span>

            <ChevronRight size={16} />

            <strong>
              {getPageTitle()}
            </strong>

          </div>

          <div className="topbar-right">

            <div className="live-system">

              <span className="live-dot"></span>

              Live System

            </div>

          </div>

        </header>

        {/* ================= PAGE CONTENT ================= */}

        {renderPage()}

      </main>

    </div>
  );
}

// =====================================================
// IMPORTANT: APP.JSX MUST EXPORT APP
// =====================================================

export default App;