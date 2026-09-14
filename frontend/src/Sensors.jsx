import { useState } from "react";
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
  const [selectedHive, setSelectedHive] = useState("H-001");

  const sensorData = [
    { time: "08:00", temperature: 33, humidity: 61, weight: 42 },
    { time: "10:00", temperature: 34, humidity: 63, weight: 42.4 },
    { time: "12:00", temperature: 35, humidity: 65, weight: 42.8 },
    { time: "14:00", temperature: 35.5, humidity: 66, weight: 43 },
    { time: "16:00", temperature: 34, humidity: 64, weight: 43.2 },
    { time: "18:00", temperature: 32, humidity: 62, weight: 43.5 },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>📡 Sensors</h1>
          <p>Monitor hive sensor readings in real time.</p>
        </div>

        <select
          value={selectedHive}
          onChange={(e) => setSelectedHive(e.target.value)}
          className="hive-select"
        >
          <option>H-001</option>
          <option>H-002</option>
          <option>H-003</option>
        </select>
      </div>

      <div className="sensor-summary">
        <div className="sensor-box">
          <span>🌡️</span>
          <strong>34.5°C</strong>
          <small>Temperature</small>
        </div>

        <div className="sensor-box">
          <span>💧</span>
          <strong>62%</strong>
          <small>Humidity</small>
        </div>

        <div className="sensor-box">
          <span>⚖️</span>
          <strong>43.5 kg</strong>
          <small>Hive Weight</small>
        </div>

        <div className="sensor-box">
          <span>🔊</span>
          <strong>Normal</strong>
          <small>Hive Sound</small>
        </div>
      </div>

      <div className="chart-card">
        <h2>🌡️ Temperature</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sensorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#f4b400"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h2>💧 Humidity</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sensorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#2196f3"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h2>⚖️ Hive Weight</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sensorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#4caf50"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="demo-note">
        ℹ️ Sensor readings shown here are demo data until ESP32
        sensors are connected.
      </p>
    </div>
  );
}

export default Sensors;