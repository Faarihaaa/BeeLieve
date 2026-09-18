import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Sensors() {
  const [hives, setHives] = useState([]);
  const [selectedHive, setSelectedHive] = useState("");
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get hives from PostgreSQL
  useEffect(() => {
    fetch("http://localhost:5000/api/hives")
      .then((response) => response.json())
      .then((data) => {
        setHives(data);

        if (data.length > 0) {
          setSelectedHive(data[0].id);
        }
      })
      .catch((error) => {
        console.error("Error fetching hives:", error);
      });
  }, []);

  // Get sensor readings for selected hive
  useEffect(() => {
    if (!selectedHive) return;

    setLoading(true);

    fetch(
      `http://localhost:5000/api/sensor-readings/${selectedHive}`
    )
      .then((response) => response.json())
      .then((data) => {
        // Convert database data into chart-friendly format
        const formattedData = data
          .slice()
          .reverse()
          .map((reading) => ({
            time: new Date(reading.recordedAt).toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ),
            temperature:
              reading.temperature !== null
                ? Number(reading.temperature)
                : null,
            humidity:
              reading.humidity !== null
                ? Number(reading.humidity)
                : null,
            weight:
              reading.weight !== null
                ? Number(reading.weight)
                : null,
            sound:
              reading.sound !== null
                ? Number(reading.sound)
                : null,
          }));

        setSensorData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching sensor readings:", error);
        setSensorData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedHive]);

  const latestReading =
    sensorData.length > 0
      ? sensorData[sensorData.length - 1]
      : null;

  return (
    <div className="sensors-page">

      {/* Header */}
      <div className="sensors-header">
        <div>
          <h1>Sensor Monitoring</h1>
          <p>
            Monitor temperature, humidity and hive weight in real time.
          </p>
        </div>

        <div className="sensor-hive-selector">
          <label>Select Hive</label>

          <select
            value={selectedHive}
            onChange={(e) => setSelectedHive(e.target.value)}
          >
            {hives.length === 0 ? (
              <option value="">No hives available</option>
            ) : (
              hives.map((hive) => (
                <option key={hive.id} value={hive.id}>
                  {hive.id} — {hive.location}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Data Status */}
      <div className="sensor-data-status">
        <span className="status-dot"></span>

        <div>
          <strong>Live Database Data</strong>
          <p>
            Readings are retrieved from the BeeLieve PostgreSQL database.
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="sensor-empty">
          Loading sensor readings...
        </div>
      )}

      {/* No Data */}
      {!loading && sensorData.length === 0 && (
        <div className="sensor-empty">
          <h3>No sensor readings yet</h3>
          <p>
            No readings are available for {selectedHive}.
          </p>
        </div>
      )}

      {/* Latest Reading Cards */}
      {!loading && latestReading && (
        <>
          <div className="sensor-summary-grid">

            <div className="sensor-summary-card">
              <span>Temperature</span>
              <strong>
                {latestReading.temperature ?? "--"}°C
              </strong>
            </div>

            <div className="sensor-summary-card">
              <span>Humidity</span>
              <strong>
                {latestReading.humidity ?? "--"}%
              </strong>
            </div>

            <div className="sensor-summary-card">
              <span>Hive Weight</span>
              <strong>
                {latestReading.weight ?? "--"} kg
              </strong>
            </div>

            <div className="sensor-summary-card">
              <span>Sound</span>
              <strong>
                {latestReading.sound ?? "--"}
              </strong>
            </div>

          </div>

          {/* Temperature Chart */}
          <div className="sensor-chart-card">
            <div className="sensor-chart-header">
              <div>
                <h3>Temperature</h3>
                <p>Hive temperature over time</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sensorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Humidity Chart */}
          <div className="sensor-chart-card">
            <div className="sensor-chart-header">
              <div>
                <h3>Humidity</h3>
                <p>Hive humidity over time</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sensorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Weight Chart */}
          <div className="sensor-chart-card">
            <div className="sensor-chart-header">
              <div>
                <h3>Hive Weight</h3>
                <p>Hive weight over time</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sensorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

    </div>
  );
}

export default Sensors;