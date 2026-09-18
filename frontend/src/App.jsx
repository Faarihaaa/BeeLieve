import { useEffect, useState } from "react";
import'./App.css';

import {
  LayoutDashboard,
  Home,
  Activity,
  Bell,
  Brain,
  Package,
  QrCode,
  RefreshCw,
  Settings as SettingsIcon,
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
import HoneyProduction from "./HoneyProduction.jsx";
import Batches from "./Batches.jsx";
import QRVerification from "./QRVerification.jsx";
import SyncCenter from "./SyncCenter.jsx";
import Settings from "./Settings.jsx";


function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hives, setHives] = useState([]);

  /* -------------------------------------------------------
     LOAD HIVES FROM BACKEND
     ------------------------------------------------------- */

  const fetchHives = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/hives");

      if (!response.ok) {
        throw new Error("Failed to fetch hives");
      }

      const data = await response.json();
      setHives(data);
    } catch (error) {
      console.error("Error fetching hives:", error);
    }
  };

  useEffect(() => {
    fetchHives();

    const interval = setInterval(() => {
      fetchHives();
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  /* -------------------------------------------------------
     DASHBOARD COUNTS
     ------------------------------------------------------- */

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


  /* -------------------------------------------------------
     PAGE TITLE
     ------------------------------------------------------- */

  const getPageTitle = () => {
    switch (activePage) {
      case "dashboard":
        return "Dashboard";

      case "hives":
        return "Hive Management";

      case "sensors":
        return "Sensor Monitoring";

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


  /* -------------------------------------------------------
     NAVIGATION
     ------------------------------------------------------- */

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "hives",
      label: "Hives",
      icon: Home,
    },
    {
      id: "sensors",
      label: "Sensors",
      icon: Activity,
    },
    {
      id: "alerts",
      label: "Alerts",
      icon: Bell,
    },
    {
      id: "ai",
      label: "AI Insights",
      icon: Brain,
    },
    {
      id: "production",
      label: "Honey Production",
      icon: Package,
    },
    {
      id: "batches",
      label: "Batches",
      icon: Package,
    },
    {
      id: "qr",
      label: "QR Verification",
      icon: QrCode,
    },
    {
      id: "sync",
      label: "Sync Center",
      icon: RefreshCw,
    },
    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
    },
  ];


  /* -------------------------------------------------------
     PAGE CHANGE
     ------------------------------------------------------- */

  const handlePageChange = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };


  /* -------------------------------------------------------
     DASHBOARD
     ------------------------------------------------------- */

  const Dashboard = () => {
    return (
      <div className="dashboard-page">

        <div className="dashboard-welcome">
          <div>
            <h1>Good day, Beekeeper 🐝</h1>

            <p>
              Monitor your hives, track honey production and keep
              your colonies healthy.
            </p>
          </div>

          <div className="dashboard-live-status">
            <Wifi size={16} />
            <span>System Online</span>
          </div>
        </div>


        {/* SUMMARY CARDS */}

        <div className="dashboard-summary-grid">

          <div className="dashboard-summary-card">
            <div className="summary-icon">
              <Home size={22} />
            </div>

            <div>
              <span>Total Hives</span>
              <strong>{totalHives}</strong>
            </div>
          </div>


          <div className="dashboard-summary-card">
            <div className="summary-icon healthy">
              <Activity size={22} />
            </div>

            <div>
              <span>Healthy</span>
              <strong>{healthyHives}</strong>
            </div>
          </div>


          <div className="dashboard-summary-card">
            <div className="summary-icon attention">
              <Bell size={22} />
            </div>

            <div>
              <span>Needs Attention</span>
              <strong>{attentionHives}</strong>
            </div>
          </div>


          <div className="dashboard-summary-card">
            <div className="summary-icon critical">
              <Bell size={22} />
            </div>

            <div>
              <span>Critical</span>
              <strong>{criticalHives}</strong>
            </div>
          </div>

        </div>


        {/* HIVE OVERVIEW */}

        <div className="dashboard-section">

          <div className="dashboard-section-header">

            <div>
              <h2>Hive Overview</h2>
              <p>Current status of your registered hives.</p>
            </div>

            <button
              className="dashboard-view-button"
              onClick={() => handlePageChange("hives")}
            >
              View All
              <ChevronRight size={15} />
            </button>

          </div>


          <div className="dashboard-hive-grid">

            {hives.length === 0 ? (

              <div className="dashboard-empty">
                <Home size={30} />
                <strong>No hives available</strong>
                <span>
                  Add your first hive from Hive Management.
                </span>
              </div>

            ) : (

              hives.slice(0, 4).map((hive) => (

                <div
                  className="dashboard-hive-card"
                  key={hive.id}
                >

                  <div className="dashboard-hive-card-top">

                    <div>
                      <strong>{hive.id}</strong>
                      <span>{hive.location}</span>
                    </div>

                    <span
                      className={`dashboard-status ${hive.status
                        ?.toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {hive.status}
                    </span>

                  </div>


                  <div className="dashboard-reading-row">

                    <div>
                      <span>Temperature</span>
                      <strong>
                        {hive.temperature ?? "--"}°C
                      </strong>
                    </div>

                    <div>
                      <span>Humidity</span>
                      <strong>
                        {hive.humidity ?? "--"}%
                      </strong>
                    </div>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>


        {/* QUICK ACTIONS */}

        <div className="dashboard-section">

          <div className="dashboard-section-header">

            <div>
              <h2>Quick Actions</h2>
              <p>Access important BeeLieve features.</p>
            </div>

          </div>


          <div className="dashboard-actions-grid">

            <button
              onClick={() => handlePageChange("hives")}
            >
              <Home size={20} />
              <span>Manage Hives</span>
            </button>

            <button
              onClick={() => handlePageChange("sensors")}
            >
              <Activity size={20} />
              <span>View Sensors</span>
            </button>

            <button
              onClick={() => handlePageChange("alerts")}
            >
              <Bell size={20} />
              <span>Check Alerts</span>
            </button>

            <button
              onClick={() => handlePageChange("qr")}
            >
              <QrCode size={20} />
              <span>Verify Honey</span>
            </button>

          </div>

        </div>


        {/* SYSTEM STATUS */}

        <div className="dashboard-system-status">

          <div className="system-status-icon">
            <Wifi size={17} />
          </div>

          <div>
            <strong>System Online</strong>
            <span>BeeLieve connected</span>
          </div>

        </div>

      </div>
    );
  };


  /* -------------------------------------------------------
     PAGE RENDER
     ------------------------------------------------------- */

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
        return <SyncCenter />;

      case "settings":
        return <Settings />;

      default:
        return <Dashboard />;
    }
  };


  /* -------------------------------------------------------
     APP UI
     ------------------------------------------------------- */

  return (
    <div className="app-container">


      {/* MOBILE OVERLAY */}

      {mobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}


      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          mobileMenuOpen ? "sidebar-open" : ""
        }`}
      >

        {/* LOGO */}

        <div className="sidebar-logo">

          <div className="logo-bee">
            🐝
          </div>

          <div>
            <h2>BeeLieve</h2>
            <span>Smart Beekeeping</span>
          </div>

        </div>


        {/* CLOSE MOBILE MENU */}

        <button
          className="mobile-close-button"
          onClick={() => setMobileMenuOpen(false)}
        >
          <X size={21} />
        </button>


        {/* NAVIGATION */}

        <nav className="sidebar-navigation">

          <span className="sidebar-label">
            MAIN MENU
          </span>

          {navigationItems.map((item) => {

            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={`sidebar-nav-item ${
                  activePage === item.id ? "active" : ""
                }`}
                onClick={() =>
                  handlePageChange(item.id)
                }
              >

                <Icon size={18} />

                <span>{item.label}</span>

                {activePage === item.id && (
                  <ChevronRight
                    size={15}
                    className="nav-arrow"
                  />
                )}

              </button>
            );

          })}

        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <div className="sidebar-system">

            <div className="system-status-icon">
              <Wifi size={16} />
            </div>

            <div>
              <strong>System Online</strong>
              <span>BeeLieve connected</span>
            </div>

          </div>


          <button className="sidebar-logout">
            <LogOut size={17} />
            <span>Logout</span>
          </button>

        </div>

      </aside>


      {/* MAIN AREA */}

      <main className="main-content">

        {/* TOP HEADER */}

        <header className="top-header">

          <div className="top-header-left">

            <button
              className="mobile-menu-button"
              onClick={() =>
                setMobileMenuOpen(true)
              }
            >
              <Menu size={22} />
            </button>

            <div>
              <span className="breadcrumb">
                BeeLieve
              </span>

              <h2>{getPageTitle()}</h2>
            </div>

          </div>


          <div className="top-header-right">

            <div className="header-status">
              <span className="online-dot"></span>
              Online
            </div>

            <div className="header-profile">
              <div className="header-avatar">
                B
              </div>

              <div>
                <strong>Beekeeper</strong>
                <span>Administrator</span>
              </div>
            </div>

          </div>

        </header>


        {/* PAGE CONTENT */}

        <div className="page-content">
          {renderPage()}
        </div>

      </main>

    </div>
  );
}

export default App;