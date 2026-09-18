import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Thermometer,
  Droplets,
  RefreshCw,
  ShieldAlert,
  Clock,
  ArrowRight,
} from "lucide-react";

function Alerts() {
  const [hives, setHives] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // =======================================
  // FETCH HIVES
  // =======================================

  const fetchHives = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/hives"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch hives");
      }

      const data = await response.json();
      setHives(data);

      return data;
    } catch (error) {
      console.error("Could not fetch hives:", error);
      return [];
    }
  };


  // =======================================
  // FETCH ALERTS FROM POSTGRESQL
  // =======================================

  const fetchAlerts = async () => {
    try {
      setLoading(true);

      const [hivesData, alertsResponse] = await Promise.all([
        fetchHives(),
        fetch("http://localhost:5000/api/alerts"),
      ]);

      if (!alertsResponse.ok) {
        throw new Error("Failed to fetch alerts");
      }

      const alertsData = await alertsResponse.json();

      // Add hive location to each alert
      const formattedAlerts = alertsData
        .filter((alert) => !alert.isResolved)
        .map((alert) => {
          const hive = hivesData.find(
            (h) => h.id === alert.hiveId
          );

          const isCritical = alert.severity === "Critical";

          return {
            id: alert.id,
            hive: alert.hiveId,
            location: hive?.location || "Location unavailable",
            type: alert.severity,
            title: isCritical
              ? "Critical hive condition detected"
              : "Hive needs attention",
            message: alert.message,
            action: alert.recommendedAction,
            createdAt: alert.createdAt,

            icon:
              alert.alertType?.toLowerCase().includes("humidity") ? (
                <Droplets size={22} />
              ) : (
                <Thermometer size={22} />
              ),
          };
        });

      setAlerts(formattedAlerts);
      setLastUpdated(new Date());

    } catch (error) {
      console.error("Could not fetch alerts:", error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };


  // =======================================
  // INITIAL LOAD
  // =======================================

  useEffect(() => {
    fetchAlerts();
  }, []);


  // =======================================
  // ALERT COUNTS
  // =======================================

  const criticalCount = alerts.filter(
    (alert) => alert.type === "Critical"
  ).length;

  const attentionCount = alerts.filter(
    (alert) => alert.type === "Needs Attention"
  ).length;

  const alertHiveIds = new Set(
    alerts.map((alert) => alert.hive)
  );

  const healthyCount = hives.filter(
    (hive) =>
      hive.status === "Healthy" &&
      !alertHiveIds.has(hive.id)
  ).length;


  return (
    <div className="alerts-page">

      {/* ===================================
          HEADER
      =================================== */}

      <div className="alerts-header">

        <div className="alerts-title-section">

          <div className="alerts-title-icon">
            <Bell size={29} />
          </div>

          <div>
            <h1>Alerts & Notifications</h1>

            <p>
              Monitor important hive conditions and take action early.
            </p>
          </div>

        </div>


        <button
          className="refresh-alerts-button"
          onClick={fetchAlerts}
          disabled={loading}
        >

          <RefreshCw
            size={17}
            className={loading ? "spin-icon" : ""}
          />

          Refresh

        </button>

      </div>


      {/* ===================================
          SUMMARY CARDS
      =================================== */}

      <div className="alert-summary-grid">

        {/* CRITICAL */}

        <div className="alert-summary-card critical-summary">

          <div className="summary-icon">
            <ShieldAlert size={24} />
          </div>

          <div>

            <span>Critical Alerts</span>

            <strong>{criticalCount}</strong>

            <small>
              Requires immediate attention
            </small>

          </div>

        </div>


        {/* ATTENTION */}

        <div className="alert-summary-card attention-summary">

          <div className="summary-icon">
            <AlertTriangle size={24} />
          </div>

          <div>

            <span>Needs Attention</span>

            <strong>{attentionCount}</strong>

            <small>
              Monitor these hives
            </small>

          </div>

        </div>


        {/* HEALTHY */}

        <div className="alert-summary-card healthy-summary">

          <div className="summary-icon">
            <CheckCircle2 size={24} />
          </div>

          <div>

            <span>Healthy Hives</span>

            <strong>{healthyCount}</strong>

            <small>
              Currently within normal range
            </small>

          </div>

        </div>


        {/* TOTAL */}

        <div className="alert-summary-card total-summary">

          <div className="summary-icon">
            <Bell size={24} />
          </div>

          <div>

            <span>Total Alerts</span>

            <strong>{alerts.length}</strong>

            <small>
              Active notifications
            </small>

          </div>

        </div>

      </div>


      {/* ===================================
          MAIN CONTENT
      =================================== */}

      <div className="alerts-content-grid">

        {/* =================================
            ALERT LIST
        ================================= */}

        <div className="alerts-panel">

          <div className="alerts-panel-header">

            <div>

              <h2>
                <Bell size={19} />
                Active Alerts
              </h2>

              <p>
                Conditions detected from your hive monitoring system.
              </p>

            </div>

            <span className="alert-count-badge">
              {alerts.length} Active
            </span>

          </div>


          {/* LOADING */}

          {loading && (

            <div className="alerts-empty-state">

              <RefreshCw
                className="spin-icon"
                size={30}
              />

              <p>
                Loading alerts from database...
              </p>

            </div>

          )}


          {/* NO ALERTS */}

          {!loading && alerts.length === 0 && (

            <div className="alerts-empty-state success-empty">

              <div className="empty-success-icon">

                <CheckCircle2 size={35} />

              </div>

              <h3>
                All hives are healthy
              </h3>

              <p>
                No active alerts have been detected.
              </p>

            </div>

          )}


          {/* ALERTS */}

          {!loading && alerts.length > 0 && (

            <div className="alerts-list">

              {alerts.map((alert) => (

                <div
                  className={`alert-item ${
                    alert.type === "Critical"
                      ? "critical-alert"
                      : "attention-alert"
                  }`}
                  key={alert.id}
                >

                  {/* ALERT ICON */}

                  <div className="alert-item-icon">

                    {alert.icon}

                  </div>


                  {/* ALERT DETAILS */}

                  <div className="alert-item-content">

                    <div className="alert-item-top">

                      <div>

                        <span
                          className={`severity-badge ${
                            alert.type === "Critical"
                              ? "critical-badge"
                              : "attention-badge"
                          }`}
                        >
                          {alert.type}
                        </span>

                        <h3>
                          {alert.title}
                        </h3>

                      </div>


                      <span className="alert-time">

                        <Clock size={13} />

                        {new Date(
                          alert.createdAt
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}

                      </span>

                    </div>


                    <p className="alert-message">
                      {alert.message}
                    </p>


                    <div className="alert-hive-info">

                      <span>
                        Hive <strong>{alert.hive}</strong>
                      </span>

                      <span>•</span>

                      <span>
                        {alert.location}
                      </span>

                    </div>


                    {/* RECOMMENDED ACTION */}

                    <div className="recommended-action">

                      <div className="recommended-icon">

                        <ArrowRight size={16} />

                      </div>

                      <div>

                        <strong>
                          Recommended action
                        </strong>

                        <p>
                          {alert.action}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* =================================
            RIGHT SIDE
        ================================= */}

        <div className="alerts-side-column">


          {/* ALERT SYSTEM */}

          <div className="alerts-panel system-panel">

            <div className="side-alert-title">

              <div className="system-icon">
                <ShieldAlert size={21} />
              </div>

              <div>

                <h2>
                  Alert System
                </h2>

                <p>
                  Automatic hive monitoring
                </p>

              </div>

            </div>


            <div className="system-status">

              <span className="online-dot"></span>

              <strong>
                Monitoring Active
              </strong>

            </div>


            <div className="system-details">

              <div>
                <span>Temperature</span>
                <b>≥ 37 °C</b>
              </div>

              <div>
                <span>Humidity</span>
                <b>≥ 70 %</b>
              </div>

              <div>
                <span>Critical temperature</span>
                <b>≥ 40 °C</b>
              </div>

              <div>
                <span>Critical humidity</span>
                <b>≥ 80 %</b>
              </div>

            </div>

          </div>


          {/* HOW IT WORKS */}

          <div className="alerts-panel how-alerts-panel">

            <div className="side-alert-title">

              <div className="how-icon">
                <Bell size={20} />
              </div>

              <div>

                <h2>
                  How Alerts Work
                </h2>

                <p>
                  Automatic condition detection
                </p>

              </div>

            </div>


            <div className="how-step">

              <span>1</span>

              <p>
                Sensors collect hive conditions.
              </p>

            </div>


            <div className="how-step">

              <span>2</span>

              <p>
                BeeLieve checks readings against safe ranges.
              </p>

            </div>


            <div className="how-step">

              <span>3</span>

              <p>
                An alert is created when an abnormal condition is detected.
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ===================================
          FOOTER STATUS
      =================================== */}

      <div className="alerts-footer-status">

        <CheckCircle2 size={16} />

        <span>

          Monitoring {hives.length} hive
          {hives.length !== 1 ? "s" : ""} •
          Last checked{" "}
          {lastUpdated.toLocaleTimeString()}

        </span>

      </div>

    </div>
  );
}

export default Alerts;