import { useEffect, useState } from "react";
import {
  TriangleAlert,
  Thermometer,
  Droplets,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

function Alerts() {
  const [hives, setHives] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHives = () => {
    setLoading(true);

    fetch("http://localhost:5000/api/hives")
      .then((response) => response.json())
      .then((data) => {
        setHives(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading alerts:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadHives();
  }, []);

  // Create alerts from hive readings
  const alerts = [];

  hives.forEach((hive) => {
    const temperature = Number(hive.temperature);
    const humidity = Number(hive.humidity);

    if (
      hive.status === "Critical" ||
      temperature >= 40 ||
      humidity >= 80
    ) {
      alerts.push({
        id: `${hive.id}-critical`,
        hive: hive.id,
        severity: "Critical",
        message:
          temperature >= 40
            ? `Temperature is high at ${temperature}°C.`
            : `Humidity is high at ${humidity}%.`,
        action:
          "Check the hive environment and inspect the colony.",
        icon:
          temperature >= 40
            ? <Thermometer size={21} />
            : <Droplets size={21} />,
      });
    } else if (
      hive.status === "Needs Attention" ||
      temperature >= 37 ||
      humidity >= 70
    ) {
      alerts.push({
        id: `${hive.id}-attention`,
        hive: hive.id,
        severity: "Needs Attention",
        message:
          temperature >= 37
            ? `Temperature is elevated at ${temperature}°C.`
            : `Humidity needs monitoring at ${humidity}%.`,
        action:
          "Monitor the hive and check environmental conditions.",
        icon:
          temperature >= 37
            ? <Thermometer size={21} />
            : <Droplets size={21} />,
      });
    }
  });

  const criticalCount = alerts.filter(
    (alert) => alert.severity === "Critical"
  ).length;

  const attentionCount = alerts.filter(
    (alert) => alert.severity === "Needs Attention"
  ).length;

  return (
    <div>

      {/* HEADER */}
      <div className="page-header">

        <div>
          <h1>
            <TriangleAlert
              size={28}
              style={{ verticalAlign: "middle", marginRight: "9px" }}
            />
            Hive Alerts
          </h1>

          <p>
            Monitor conditions that may require beekeeper attention.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={loadHives}
        >
          <RefreshCw size={17} />
          Refresh
        </button>

      </div>


      {/* SUMMARY */}
      <div className="alert-summary">

        <div className="alert-summary-card critical-summary">

          <div className="summary-icon">
            <TriangleAlert size={22} />
          </div>

          <div>
            <span>Critical</span>
            <strong>{criticalCount}</strong>
          </div>

        </div>


        <div className="alert-summary-card attention-summary">

          <div className="summary-icon">
            <TriangleAlert size={22} />
          </div>

          <div>
            <span>Needs Attention</span>
            <strong>{attentionCount}</strong>
          </div>

        </div>


        <div className="alert-summary-card">

          <div className="summary-icon healthy-summary">
            <CheckCircle size={22} />
          </div>

          <div>
            <span>Monitored Hives</span>
            <strong>{hives.length}</strong>
          </div>

        </div>

      </div>


      {/* ALERT LIST */}
      <div className="alerts-container">

        <div className="alerts-title">

          <div>
            <h2>Active Alerts</h2>
            <p>
              Automatically generated from hive readings
            </p>
          </div>

          <span>
            {alerts.length} alert
            {alerts.length !== 1 ? "s" : ""}
          </span>

        </div>


        {loading ? (

          <div className="empty-alerts">
            <RefreshCw size={28} />
            <h3>Loading hive data...</h3>
            <p>
              Connecting to BeeLieve backend.
            </p>
          </div>

        ) : alerts.length === 0 ? (

          <div className="empty-alerts">

            <div className="empty-alert-icon">
              <CheckCircle size={32} />
            </div>

            <h3>All hives are healthy</h3>

            <p>
              No active health alerts have been detected.
            </p>

          </div>

        ) : (

          <div className="alert-cards">

            {alerts.map((alert) => (

              <div
                className={`alert-card ${
                  alert.severity === "Critical"
                    ? "critical-alert"
                    : "attention-alert"
                }`}
                key={alert.id}
              >

                <div className="alert-card-icon">
                  {alert.icon}
                </div>


                <div className="alert-card-content">

                  <div className="alert-card-top">

                    <span className="alert-hive">
                      🐝 {alert.hive}
                    </span>

                    <span
                      className={`severity-badge ${
                        alert.severity === "Critical"
                          ? "critical-badge"
                          : "attention-badge"
                      }`}
                    >
                      {alert.severity}
                    </span>

                  </div>


                  <h3>
                    {alert.message}
                  </h3>

                  <p>
                    💡 <strong>Recommended action:</strong>{" "}
                    {alert.action}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* DATA NOTE */}
      <div className="dashboard-note">

        <span>●</span>

        Alerts are generated automatically from the
        temperature and humidity data received from the
        BeeLieve backend.

      </div>

    </div>
  );
}

export default Alerts;