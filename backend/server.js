const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


// =======================================
// HOME / HEALTH CHECK
// =======================================

app.get("/", (req, res) => {
  res.json({
    message: "🐝 BeeLieve backend is running",
  });
});


// =======================================
// DATABASE TEST
// =======================================

app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "🐝 PostgreSQL connected successfully!",
      time: result.rows[0].now,
    });

  } catch (error) {
    console.error("PostgreSQL connection error:", error);

    res.status(500).json({
      message: "PostgreSQL connection failed",
      error: error.message,
    });
  }
});


// =======================================
// HIVE ROUTES
// =======================================

// Get all hives
app.get("/api/hives", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        location,
        latitude,
        longitude,
        status,
        colony_info,
        created_at
      FROM hives
      ORDER BY created_at DESC
    `);

    const hives = result.rows.map((hive) => ({
      id: hive.id,
      location: hive.location,
      latitude: hive.latitude,
      longitude: hive.longitude,
      status: hive.status,
      colonyInfo: hive.colony_info,
      createdAt: hive.created_at,
    }));

    res.json(hives);

  } catch (error) {
    console.error("Error fetching hives:", error);

    res.status(500).json({
      message: "Failed to fetch hives",
      error: error.message,
    });
  }
});


// Add new hive
app.post("/api/hives", async (req, res) => {
  try {
    const {
      id,
      location,
      latitude,
      longitude,
      temperature,
      humidity,
      colonyInfo,
    } = req.body;

    if (!id || !location) {
      return res.status(400).json({
        message: "Hive ID and location are required",
      });
    }

    // Check duplicate Hive ID
    const existingHive = await pool.query(
      "SELECT id FROM hives WHERE id = $1",
      [id]
    );

    if (existingHive.rows.length > 0) {
      return res.status(400).json({
        message: "Hive ID already exists",
      });
    }

    // Determine initial hive status
    let status = "Healthy";

    const temp =
      temperature !== undefined && temperature !== ""
        ? Number(temperature)
        : null;

    const hum =
      humidity !== undefined && humidity !== ""
        ? Number(humidity)
        : null;

    if (
      (temp !== null && temp >= 40) ||
      (hum !== null && hum >= 80)
    ) {
      status = "Critical";
    } else if (
      (temp !== null && temp >= 37) ||
      (hum !== null && hum >= 70)
    ) {
      status = "Needs Attention";
    }

    const result = await pool.query(
      `
      INSERT INTO hives
      (
        id,
        location,
        latitude,
        longitude,
        status,
        colony_info
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        id,
        location,
        latitude || null,
        longitude || null,
        status,
        colonyInfo || null,
      ]
    );

    const hive = result.rows[0];

    res.status(201).json({
      message: "Hive added successfully",

      hive: {
        id: hive.id,
        location: hive.location,
        latitude: hive.latitude,
        longitude: hive.longitude,
        status: hive.status,
        colonyInfo: hive.colony_info,
        createdAt: hive.created_at,
      },
    });

  } catch (error) {
    console.error("Error adding hive:", error);

    res.status(500).json({
      message: "Failed to add hive",
      error: error.message,
    });
  }
});


// Get single hive
app.get("/api/hives/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM hives WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Hive not found",
      });
    }

    const hive = result.rows[0];

    res.json({
      id: hive.id,
      location: hive.location,
      latitude: hive.latitude,
      longitude: hive.longitude,
      status: hive.status,
      colonyInfo: hive.colony_info,
      createdAt: hive.created_at,
    });

  } catch (error) {
    console.error("Error fetching hive:", error);

    res.status(500).json({
      message: "Failed to fetch hive",
      error: error.message,
    });
  }
});


// Delete hive
app.delete("/api/hives/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM hives WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Hive not found",
      });
    }

    res.json({
      message: "Hive deleted successfully",
      id,
    });

  } catch (error) {
    console.error("Error deleting hive:", error);

    res.status(500).json({
      message: "Failed to delete hive",
      error: error.message,
    });
  }
});


// =======================================
// SENSOR ROUTES
// =======================================

// Get sensor readings for a hive
app.get("/api/sensor-readings/:hiveId", async (req, res) => {
  try {
    const { hiveId } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        hive_id,
        temperature,
        humidity,
        weight,
        sound,
        recorded_at
      FROM sensor_readings
      WHERE hive_id = $1
      ORDER BY recorded_at DESC
      `,
      [hiveId]
    );

    const readings = result.rows.map((reading) => ({
      id: reading.id,
      hiveId: reading.hive_id,
      temperature: reading.temperature,
      humidity: reading.humidity,
      weight: reading.weight,
      sound: reading.sound,
      recordedAt: reading.recorded_at,
    }));

    res.json(readings);

  } catch (error) {
    console.error("Error fetching sensor readings:", error);

    res.status(500).json({
      message: "Failed to fetch sensor readings",
      error: error.message,
    });
  }
});


// Add sensor reading
app.post("/api/sensor-readings", async (req, res) => {
  try {
    const {
      hiveId,
      temperature,
      humidity,
      weight,
      sound,
    } = req.body;

    if (!hiveId) {
      return res.status(400).json({
        message: "Hive ID is required",
      });
    }


    // ---------------------------------------
    // CHECK HIVE
    // ---------------------------------------

    const hive = await pool.query(
      "SELECT id FROM hives WHERE id = $1",
      [hiveId]
    );

    if (hive.rows.length === 0) {
      return res.status(404).json({
        message: "Hive not found",
      });
    }


    // ---------------------------------------
    // SAVE SENSOR READING
    // ---------------------------------------

    const result = await pool.query(
      `
      INSERT INTO sensor_readings
      (
        hive_id,
        temperature,
        humidity,
        weight,
        sound
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        hiveId,
        temperature ?? null,
        humidity ?? null,
        weight ?? null,
        sound ?? null,
      ]
    );

    const reading = result.rows[0];


    // ---------------------------------------
    // CHECK ENVIRONMENTAL CONDITIONS
    // ---------------------------------------

    const temp =
      temperature !== undefined && temperature !== ""
        ? Number(temperature)
        : null;

    const hum =
      humidity !== undefined && humidity !== ""
        ? Number(humidity)
        : null;


    let status = "Healthy";
    let severity = null;
    let alertType = null;
    let message = null;
    let recommendedAction = null;


    // ---------------------------------------
    // CRITICAL CONDITION
    // ---------------------------------------

    if (
      (temp !== null && temp >= 40) ||
      (hum !== null && hum >= 80)
    ) {
      status = "Critical";

      severity = "Critical";

      alertType = "High Environmental Stress";

      message =
        "Hive environmental conditions are outside the safe monitored range.";

      recommendedAction =
        "Inspect the hive immediately and check ventilation, shade, and surrounding conditions.";
    }


    // ---------------------------------------
    // NEEDS ATTENTION CONDITION
    // ---------------------------------------

    else if (
      (temp !== null && temp >= 37) ||
      (hum !== null && hum >= 70)
    ) {
      status = "Needs Attention";

      severity = "Needs Attention";

      alertType = "Environmental Warning";

      message =
        "Hive temperature or humidity is approaching the monitored limit.";

      recommendedAction =
        "Monitor the hive closely and check ventilation and surrounding conditions.";
    }


    // ---------------------------------------
    // UPDATE HIVE STATUS
    // ---------------------------------------

    await pool.query(
      `
      UPDATE hives
      SET status = $1
      WHERE id = $2
      `,
      [status, hiveId]
    );


    // ---------------------------------------
    // CREATE ALERT
    // ---------------------------------------

    if (severity) {
      await pool.query(
        `
        INSERT INTO alerts
        (
          hive_id,
          alert_type,
          severity,
          message,
          recommended_action
        )
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          hiveId,
          alertType,
          severity,
          message,
          recommendedAction,
        ]
      );
    }


    // ---------------------------------------
    // RESPONSE
    // ---------------------------------------

    res.status(201).json({
      message: "Sensor reading saved successfully",

      reading: {
        id: reading.id,
        hiveId: reading.hive_id,
        temperature: reading.temperature,
        humidity: reading.humidity,
        weight: reading.weight,
        sound: reading.sound,
        recordedAt: reading.recorded_at,
      },

      alert: severity
        ? {
            severity,
            type: alertType,
            message,
            recommendedAction,
          }
        : null,
    });

  } catch (error) {
    console.error("Error saving sensor reading:", error);

    res.status(500).json({
      message: "Failed to save sensor reading",
      error: error.message,
    });
  }
});


// =======================================
// ALERT ROUTES
// =======================================

// Get all alerts
app.get("/api/alerts", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        hive_id,
        alert_type,
        severity,
        message,
        recommended_action,
        is_resolved,
        created_at
      FROM alerts
      ORDER BY created_at DESC
    `);

    const alerts = result.rows.map((alert) => ({
      id: alert.id,
      hiveId: alert.hive_id,
      alertType: alert.alert_type,
      severity: alert.severity,
      message: alert.message,
      recommendedAction: alert.recommended_action,
      isResolved: alert.is_resolved,
      createdAt: alert.created_at,
    }));

    res.json(alerts);

  } catch (error) {
    console.error("Error fetching alerts:", error);

    res.status(500).json({
      message: "Failed to fetch alerts",
      error: error.message,
    });
  }
});


// Get alerts for a specific hive
app.get("/api/alerts/:hiveId", async (req, res) => {
  try {
    const { hiveId } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        hive_id,
        alert_type,
        severity,
        message,
        recommended_action,
        is_resolved,
        created_at
      FROM alerts
      WHERE hive_id = $1
      ORDER BY created_at DESC
      `,
      [hiveId]
    );

    const alerts = result.rows.map((alert) => ({
      id: alert.id,
      hiveId: alert.hive_id,
      alertType: alert.alert_type,
      severity: alert.severity,
      message: alert.message,
      recommendedAction: alert.recommended_action,
      isResolved: alert.is_resolved,
      createdAt: alert.created_at,
    }));

    res.json(alerts);

  } catch (error) {
    console.error("Error fetching hive alerts:", error);

    res.status(500).json({
      message: "Failed to fetch hive alerts",
      error: error.message,
    });
  }
});


// =======================================
// START SERVER
// =======================================

// =======================================
// HONEY HARVEST ROUTES
// =======================================

// Get all harvest records
app.get("/api/harvests", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        hive_id,
        batch_id,
        quantity,
        harvest_date,
        notes,
        created_at
      FROM harvest_records
      ORDER BY harvest_date DESC, created_at DESC
    `);

    const harvests = result.rows.map((harvest) => ({
      id: harvest.id,
      hive: harvest.hive_id,
      batchId: harvest.batch_id,
      quantity: Number(harvest.quantity),
      date: harvest.harvest_date,
      notes: harvest.notes,
      createdAt: harvest.created_at,
    }));

    res.json(harvests);

  } catch (error) {
    console.error("Error fetching harvests:", error);

    res.status(500).json({
      message: "Failed to fetch harvest records",
      error: error.message,
    });
  }
});


// Add a new harvest
app.post("/api/harvests", async (req, res) => {
  try {
    const {
      date,
      hive,
      quantity,
      type,
      notes,
    } = req.body;

    if (!date || !hive || !quantity || !type) {
      return res.status(400).json({
        message: "Date, hive, quantity and honey type are required",
      });
    }

    // Check hive exists
    const hiveResult = await pool.query(
      "SELECT id FROM hives WHERE id = $1",
      [hive]
    );

    if (hiveResult.rows.length === 0) {
      return res.status(404).json({
        message: "Hive not found",
      });
    }

    // Store honey type inside notes for now.
    // The current harvest_records table does not have
    // a separate honey_type column.
    const harvestNotes = notes
      ? `Honey Type: ${type} | ${notes}`
      : `Honey Type: ${type}`;

    const result = await pool.query(
      `
      INSERT INTO harvest_records
      (
        hive_id,
        quantity,
        harvest_date,
        notes
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        hive,
        Number(quantity),
        date,
        harvestNotes,
      ]
    );

    const harvest = result.rows[0];

    res.status(201).json({
      message: "Harvest saved successfully",

      harvest: {
        id: harvest.id,
        hive: harvest.hive_id,
        quantity: Number(harvest.quantity),
        date: harvest.harvest_date,
        notes: harvest.notes,
        createdAt: harvest.created_at,
      },
    });

  } catch (error) {
    console.error("Error saving harvest:", error);

    res.status(500).json({
      message: "Failed to save harvest",
      error: error.message,
    });
  }
});
// =======================================
// HONEY BATCH ROUTES
// =======================================

// Get all honey batches
app.get("/api/batches", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        batch_id,
        hive_id,
        honey_type,
        quantity,
        harvest_date,
        status,
        created_at
      FROM honey_batches
      ORDER BY harvest_date DESC, created_at DESC
    `);

    const batches = result.rows.map((batch) => ({
      id: batch.batch_id,
      date: batch.harvest_date,
      hive: batch.hive_id,
      quantity: Number(batch.quantity),
      type: batch.honey_type,
      status: batch.status,
      createdAt: batch.created_at,
    }));

    res.json(batches);

  } catch (error) {
    console.error("Error fetching batches:", error);

    res.status(500).json({
      message: "Failed to fetch batches",
      error: error.message,
    });
  }
});


// Create a new honey batch
app.post("/api/batches", async (req, res) => {
  try {
    const {
      batchId,
      date,
      hive,
      quantity,
      type,
    } = req.body;

    if (
      !batchId ||
      !date ||
      !hive ||
      !quantity ||
      !type
    ) {
      return res.status(400).json({
        message: "All batch details are required",
      });
    }

    const cleanBatchId = batchId.trim().toUpperCase();
    const cleanHiveId = hive.trim().toUpperCase();

    // Check hive exists
    const hiveResult = await pool.query(
      "SELECT id FROM hives WHERE id = $1",
      [cleanHiveId]
    );

    if (hiveResult.rows.length === 0) {
      return res.status(404).json({
        message: "Hive not found",
      });
    }

    // Check duplicate Batch ID
    const existingBatch = await pool.query(
      "SELECT batch_id FROM honey_batches WHERE batch_id = $1",
      [cleanBatchId]
    );

    if (existingBatch.rows.length > 0) {
      return res.status(400).json({
        message: "Batch ID already exists",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO honey_batches
      (
        batch_id,
        hive_id,
        honey_type,
        quantity,
        harvest_date,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        cleanBatchId,
        cleanHiveId,
        type,
        Number(quantity),
        date,
        "Pending Verification",
      ]
    );

    const batch = result.rows[0];

    res.status(201).json({
      message: "Honey batch created successfully",

      batch: {
        id: batch.batch_id,
        date: batch.harvest_date,
        hive: batch.hive_id,
        quantity: Number(batch.quantity),
        type: batch.honey_type,
        status: batch.status,
        createdAt: batch.created_at,
      },
    });

  } catch (error) {
    console.error("Error creating batch:", error);

    res.status(500).json({
      message: "Failed to create honey batch",
      error: error.message,
    });
  }
});
// =======================================
// QR VERIFICATION ROUTES
// =======================================

// Verify a honey batch using Batch ID
app.get("/api/verify/:batchId", async (req, res) => {
  try {
    const batchId = req.params.batchId.trim().toUpperCase();

    // Find the batch and its hive information
    const result = await pool.query(
      `
      SELECT
        hb.batch_id,
        hb.honey_type,
        hb.quantity,
        hb.harvest_date,
        hb.status,
        h.id AS hive_id,
        h.location,
        h.latitude,
        h.longitude
      FROM honey_batches hb
      LEFT JOIN hives h
        ON hb.hive_id = h.id
      WHERE hb.batch_id = $1
      `,
      [batchId]
    );

    // Batch not found
    if (result.rows.length === 0) {
      return res.status(404).json({
        verified: false,
        message: "Batch not found",
      });
    }

    const batch = result.rows[0];

    // Create verification record
    const recordId = `VER-${Date.now()}`;

    await pool.query(
      `
      INSERT INTO verification_records
      (
        batch_id,
        verification_status,
        verification_method,
        record_id
      )
      VALUES ($1, $2, $3, $4)
      `,
      [
        batch.batch_id,
        "Verified",
        "QR",
        recordId,
      ]
    );

    // Send verification information
    res.json({
      verified: true,

      message: "Honey batch verified successfully",

      batch: {
        batchId: batch.batch_id,
        honeyType: batch.honey_type,
        quantity: Number(batch.quantity),
        harvestDate: batch.harvest_date,
        status: batch.status,
      },

      hive: {
        hiveId: batch.hive_id,
        location: batch.location,
        latitude: batch.latitude,
        longitude: batch.longitude,
      },

      verification: {
        status: "Verified",
        method: "QR",
        recordId: recordId,
        verifiedAt: new Date(),
      },
    });

  } catch (error) {
    console.error("QR verification error:", error);

    res.status(500).json({
      verified: false,
      message: "Failed to verify batch",
      error: error.message,
    });
  }
});
const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `🐝 BeeLieve backend running on http://localhost:${PORT}`
  );
});