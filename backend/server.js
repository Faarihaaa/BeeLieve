const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Temporary hive data
// Later we will connect this to PostgreSQL
let hives = [
  {
    id: "H-001",
    location: "Farm A",
    latitude: 12.9716,
    longitude: 77.5946,
    status: "Healthy",
    temperature: 34.5,
    humidity: 62,
  },
  {
    id: "H-002",
    location: "Farm B",
    latitude: 13.0827,
    longitude: 80.2707,
    status: "Healthy",
    temperature: 35.1,
    humidity: 65,
  },
  {
    id: "H-003",
    location: "Hill Area",
    latitude: 34.0837,
    longitude: 74.7973,
    status: "Needs Attention",
    temperature: 38.2,
    humidity: 71,
  },
];

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "BeeLieve backend is running 🐝",
  });
});

// Get all hives
app.get("/api/hives", (req, res) => {
  res.json(hives);
});

// Add a new hive
app.post("/api/hives", (req, res) => {
  const {
    id,
    location,
    latitude,
    longitude,
    temperature,
    humidity,
  } = req.body;

  // Check required fields
  if (!id || !location) {
    return res.status(400).json({
      message: "Hive ID and location are required",
    });
  }

  // Check duplicate Hive ID
  const existingHive = hives.find(
    (hive) => hive.id === id
  );

  if (existingHive) {
    return res.status(400).json({
      message: "Hive ID already exists",
    });
  }

  // Create new hive
  let status = "Healthy";

const temp = Number(temperature);
const hum = Number(humidity);

if (
  (temperature !== undefined && temperature !== "" && temp >= 40) ||
  (humidity !== undefined && humidity !== "" && hum >= 80)
) {
  status = "Critical";
} else if (
  (temperature !== undefined && temperature !== "" && temp >= 37) ||
  (humidity !== undefined && humidity !== "" && hum >= 70)
) {
  status = "Needs Attention";
}

const hive = {
  id,
  location,
  latitude: latitude || null,
  longitude: longitude || null,
  status: status,
    temperature:
      temperature !== undefined && temperature !== ""
        ? temperature
        : null,
    humidity:
      humidity !== undefined && humidity !== ""
        ? humidity
        : null,
  };

  // Store hive
  hives.push(hive);

  res.status(201).json({
    message: "Hive added successfully",
    hive: hive,
  });
});

// Start server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `BeeLieve backend running on http://localhost:${PORT}`
  );
});