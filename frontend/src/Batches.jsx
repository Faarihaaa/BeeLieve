import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  Package,
  Plus,
  QrCode,
  Calendar,
  Weight,
  X,
  CheckCircle,
} from "lucide-react";

function Batches() {
  const [showForm, setShowForm] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [qrImage, setQrImage] = useState("");

  const [batches, setBatches] = useState(() => {
    const savedBatches = localStorage.getItem("beelieve_batches");

    if (savedBatches) {
      return JSON.parse(savedBatches);
    }

    return [
      {
        id: "BATCH-001",
        date: "2026-09-05",
        hive: "H-001",
        quantity: 12.5,
        type: "Wildflower",
        status: "Verified",
      },
      {
        id: "BATCH-002",
        date: "2026-09-02",
        hive: "H-002",
        quantity: 9.8,
        type: "Multifloral",
        status: "Verified",
      },
      {
        id: "BATCH-003",
        date: "2026-08-20",
        hive: "H-003",
        quantity: 7.2,
        type: "Forest Honey",
        status: "Verified",
      },
    ];
  });

  const [formData, setFormData] = useState({
    batchId: "",
    date: "",
    hive: "",
    quantity: "",
    type: "",
  });

  // SAVE BATCHES
  useEffect(() => {
    localStorage.setItem(
      "beelieve_batches",
      JSON.stringify(batches)
    );
  }, [batches]);

  // HANDLE FORM INPUT
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // CREATE BATCH
  const createBatch = (event) => {
    event.preventDefault();

    if (
      !formData.batchId ||
      !formData.date ||
      !formData.hive ||
      !formData.quantity ||
      !formData.type
    ) {
      alert("Please fill all batch details.");
      return;
    }

    const batchId = formData.batchId.trim().toUpperCase();
    const hiveId = formData.hive.trim().toUpperCase();

    const existingBatch = batches.find(
      (batch) => batch.id.toUpperCase() === batchId
    );

    if (existingBatch) {
      alert("Batch ID already exists.");
      return;
    }

    const newBatch = {
      id: batchId,
      date: formData.date,
      hive: hiveId,
      quantity: Number(formData.quantity),
      type: formData.type,
      status: "Pending Verification",
    };

    setBatches((previousBatches) => [
      newBatch,
      ...previousBatches,
    ]);

    setFormData({
      batchId: "",
      date: "",
      hive: "",
      quantity: "",
      type: "",
    });

    setShowForm(false);

    alert("Honey batch created successfully.");
  };

  // GENERATE REAL QR
  const openQR = async (batch) => {
    try {
      /*
       * For now the QR contains the Batch ID.
       *
       * Later this can become:
       * https://your-public-site.com/verify/BATCH-004
       */

      const qrData = `http://localhost:5173/?verify=${batch.id}`;
      const generatedQR = await QRCode.toDataURL(qrData, {
        width: 240,
        margin: 2,
      });

      setQrImage(generatedQR);
      setSelectedBatch(batch);
    } catch (error) {
      console.error("QR generation failed:", error);
      alert("Unable to generate QR code.");
    }
  };

  const closeQR = () => {
    setSelectedBatch(null);
    setQrImage("");
  };

  const totalQuantity = batches.reduce(
    (total, batch) =>
      total + Number(batch.quantity),
    0
  );

  const verifiedCount = batches.filter(
    (batch) => batch.status === "Verified"
  ).length;

  return (
    <div className="batches-page">

      {/* HEADER */}

      <div className="batches-header">

        <div className="batches-title">

          <div className="batches-title-icon">
            <Package size={27} />
          </div>

          <div>
            <h1>Honey Batches</h1>

            <p>
              Create and manage traceable honey
              production batches.
            </p>
          </div>

        </div>

        <button
          className="create-batch-button"
          onClick={() => setShowForm(true)}
        >
          <Plus size={17} />
          Create Batch
        </button>

      </div>

      {/* SUMMARY */}

      <div className="batch-summary">

        <div className="batch-summary-card">

          <div className="batch-summary-icon">
            <Package size={21} />
          </div>

          <div>
            <span>Total Batches</span>
            <strong>{batches.length}</strong>
          </div>

        </div>

        <div className="batch-summary-card">

          <div className="batch-summary-icon quantity">
            <Weight size={21} />
          </div>

          <div>
            <span>Total Honey</span>
            <strong>
              {totalQuantity.toFixed(1)} kg
            </strong>
          </div>

        </div>

        <div className="batch-summary-card">

          <div className="batch-summary-icon verified">
            <CheckCircle size={21} />
          </div>

          <div>
            <span>Verified Batches</span>
            <strong>{verifiedCount}</strong>
          </div>

        </div>

      </div>

      {/* TRACEABILITY INFO */}

      <div className="traceability-info">

        <div className="traceability-icon">
          <QrCode size={23} />
        </div>

        <div>
          <strong>Honey Traceability</strong>

          <p>
            Each honey batch receives a unique Batch ID
            that can be linked to hive information,
            harvest records and QR-based verification.
          </p>
        </div>

      </div>

      {/* PROTOTYPE NOTE */}

      <div className="batch-prototype-note">

        <strong>Prototype:</strong>

        <span>
          Batch records are currently stored locally.
          Public verification can be connected during
          deployment.
        </span>

      </div>

      {/* BATCH LIST */}

      <div className="batch-list-card">

        <div className="batch-section-header">

          <div>
            <h2>Batch Records</h2>

            <p>
              Recently created honey batches
            </p>
          </div>

        </div>

        <div className="batch-table-wrapper">

          <table className="batch-table">

            <thead>

              <tr>
                <th>Batch ID</th>
                <th>Harvest Date</th>
                <th>Hive</th>
                <th>Honey Type</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>QR</th>
              </tr>

            </thead>

            <tbody>

              {batches.map((batch) => (

                <tr key={batch.id}>

                  <td>
                    <strong>{batch.id}</strong>
                  </td>

                  <td>

                    <div className="batch-date">

                      <Calendar size={14} />

                      {batch.date}

                    </div>

                  </td>

                  <td>{batch.hive}</td>

                  <td>

                    <span className="batch-honey-type">
                      {batch.type}
                    </span>

                  </td>

                  <td>

                    <strong>
                      {Number(batch.quantity).toFixed(1)} kg
                    </strong>

                  </td>

                  <td>

                    {batch.status === "Verified" ? (

                      <span className="verified-badge">

                        <CheckCircle size={13} />

                        Verified

                      </span>

                    ) : (

                      <span className="pending-badge">

                        <CheckCircle size={13} />

                        Pending Verification

                      </span>

                    )}

                  </td>

                  <td>

                    <button
                      className="batch-qr-button"
                      onClick={() => openQR(batch)}
                    >
                      <QrCode size={16} />
                      View QR
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* CREATE BATCH MODAL */}

      {showForm && (

        <div className="batch-modal-overlay">

          <div className="batch-modal">

            <div className="batch-modal-header">

              <div>

                <h2>Create Honey Batch</h2>

                <p>
                  Create a unique traceability record.
                </p>

              </div>

              <button
                className="close-batch-modal"
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>

            </div>

            <form onSubmit={createBatch}>

              <div className="batch-form-grid">

                <div className="batch-form-group">

                  <label>Batch ID</label>

                  <input
                    type="text"
                    name="batchId"
                    placeholder="Example: BATCH-004"
                    value={formData.batchId}
                    onChange={handleChange}
                  />

                </div>

                <div className="batch-form-group">

                  <label>Harvest Date</label>

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />

                </div>

                <div className="batch-form-group">

                  <label>Hive ID</label>

                  <input
                    type="text"
                    name="hive"
                    placeholder="Example: H-001"
                    value={formData.hive}
                    onChange={handleChange}
                  />

                </div>

                <div className="batch-form-group">

                  <label>Quantity (kg)</label>

                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    name="quantity"
                    placeholder="Example: 10.5"
                    value={formData.quantity}
                    onChange={handleChange}
                  />

                </div>

                <div className="batch-form-group full-width">

                  <label>Honey Type</label>

                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >

                    <option value="">
                      Select honey type
                    </option>

                    <option value="Wildflower">
                      Wildflower
                    </option>

                    <option value="Multifloral">
                      Multifloral
                    </option>

                    <option value="Forest Honey">
                      Forest Honey
                    </option>

                    <option value="Acacia">
                      Acacia
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

              </div>

              <div className="batch-form-buttons">

                <button
                  type="button"
                  className="cancel-batch-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-batch-button"
                >
                  <Plus size={16} />
                  Create Batch
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* QR PREVIEW */}

      {selectedBatch && (

        <div className="batch-modal-overlay">

          <div className="qr-preview-modal">

            <button
              className="close-batch-modal qr-close"
              onClick={closeQR}
            >
              <X size={20} />
            </button>

            <div className="qr-preview-icon">

              <QrCode size={28} />

            </div>

            <h2>{selectedBatch.id}</h2>

            <p>
              Honey batch verification QR
            </p>

            {/* REAL QR */}

            <div className="real-qr-container">

              {qrImage && (
                <img
                  src={qrImage}
                  alt={`QR code for ${selectedBatch.id}`}
                  className="real-qr-image"
                />
              )}

            </div>

            <div className="qr-batch-details">

              <div>

                <span>Hive</span>

                <strong>
                  {selectedBatch.hive}
                </strong>

              </div>

              <div>

                <span>Honey Type</span>

                <strong>
                  {selectedBatch.type}
                </strong>

              </div>

              <div>

                <span>Quantity</span>

                <strong>
                  {Number(selectedBatch.quantity).toFixed(1)} kg
                </strong>

              </div>

              <div>

                <span>Status</span>

                <strong
                  className={
                    selectedBatch.status === "Verified"
                      ? "qr-verified"
                      : "qr-pending"
                  }
                >

                  <CheckCircle size={14} />

                  {selectedBatch.status}

                </strong>

              </div>

            </div>

            <p className="qr-demo-note">

              This QR currently identifies the batch.
              Public verification will be connected
              to the BeeLieve verification page.

            </p>

          </div>

        </div>

      )}

    </div>
  );
}

export default Batches;