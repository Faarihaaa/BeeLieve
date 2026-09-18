import { useState } from "react";
import QRCode from "qrcode";
import {
  QrCode,
  Search,
  CheckCircle,
  Package,
  Home,
  Calendar,
  Weight,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";

function QRVerification() {
  const [batchId, setBatchId] = useState("");
  const [verifiedBatch, setVerifiedBatch] = useState(null);
  const [searched, setSearched] = useState(false);
  const [qrImage, setQrImage] = useState("");

  // Demo verification records
  const demoBatches = [
    {
      id: "BATCH-001",
      hiveId: "H-001",
      harvestDate: "2026-08-15",
      quantity: 18,
      location: "Farm A",
      status: "Verified",
      verificationId: "VER-001",
      verifiedAt: "2026-08-15 10:30",
    },
    {
      id: "BATCH-002",
      hiveId: "H-002",
      harvestDate: "2026-08-20",
      quantity: 22,
      location: "Farm B",
      status: "Verified",
      verificationId: "VER-002",
      verifiedAt: "2026-08-20 14:15",
    },
    {
      id: "BATCH-003",
      hiveId: "H-003",
      harvestDate: "2026-08-25",
      quantity: 15,
      location: "Hill Area",
      status: "Verified",
      verificationId: "VER-003",
      verifiedAt: "2026-08-25 09:45",
    },
  ];

  const getAllBatches = () => {
    try {
      const saved = localStorage.getItem("beelieve_batches");

      if (saved) {
        const savedBatches = JSON.parse(saved);

        if (Array.isArray(savedBatches) && savedBatches.length > 0) {
          return [...demoBatches, ...savedBatches];
        }
      }
    } catch (error) {
      console.log("Could not read saved batches");
    }

    return demoBatches;
  };

  const generateQR = async (batch) => {
    try {
      const qrData = `BeeLieve Batch Verification | Batch ID: ${batch.id}`;

      const image = await QRCode.toDataURL(qrData, {
        width: 220,
        margin: 2,
      });

      setQrImage(image);
    } catch (error) {
      console.error("QR generation failed:", error);
      setQrImage("");
    }
  };

  const verifyBatch = async (id = batchId) => {
    const searchId = id.trim().toUpperCase();

    if (!searchId) {
      setSearched(false);
      setVerifiedBatch(null);
      setQrImage("");
      return;
    }

    const allBatches = getAllBatches();

    const found = allBatches.find(
      (batch) => batch.id.toUpperCase() === searchId
    );

    setSearched(true);

    if (found) {
      const verified = {
        ...found,
        status: "Verified",
        verificationId: found.verificationId || `VER-${searchId.slice(-3)}`,
        verifiedAt: found.verifiedAt || "Verification record available",
      };

      setVerifiedBatch(verified);
      await generateQR(verified);
    } else {
      setVerifiedBatch(null);
      setQrImage("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyBatch();
  };

  const selectDemo = (id) => {
    setBatchId(id);
    verifyBatch(id);
  };

  return (
    <div className="qr-page">

      {/* Header */}
      <div className="qr-page-header">
        <div className="qr-title-section">
          <div className="qr-main-icon">
            <QrCode size={32} />
          </div>

          <div>
            <h1>QR Verification</h1>
            <p>
              Verify honey authenticity and traceability
            </p>
          </div>
        </div>

        <div className="secure-verification">
          <ShieldCheck size={20} />
          <span>Secure Verification</span>
        </div>
      </div>

      {/* Search Card */}
      <div className="qr-search-card">

        <div className="qr-card-heading">
          <div className="qr-small-icon">
            <QrCode size={25} />
          </div>

          <div>
            <h2>Verify Your Honey</h2>
            <p>
              Enter the Batch ID printed on the honey package to view
              its origin, harvest details and traceability information.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="qr-search-form">

          <div className="qr-input-wrapper">
            <Package size={20} />
            <input
              type="text"
              placeholder="Enter Batch ID"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
            />
          </div>

          <button type="submit" className="qr-verify-button">
            <Search size={18} />
            Verify
          </button>

        </form>

        <div className="demo-section">
          <span>Try demo:</span>

          <button onClick={() => selectDemo("BATCH-001")}>
            BATCH-001
          </button>

          <button onClick={() => selectDemo("BATCH-002")}>
            BATCH-002
          </button>

          <button onClick={() => selectDemo("BATCH-003")}>
            BATCH-003
          </button>
        </div>

      </div>

      {/* Verified Result */}
      {searched && verifiedBatch && (
        <div className="verification-result">

          {/* Result Header */}
          <div className="verification-result-header">

            <div className="verified-title">
              <CheckCircle size={30} />

              <div>
                <h2>Honey Batch Verified</h2>
                <p>Authentic traceability record found</p>
              </div>
            </div>

            <span className="verified-badge">
              VERIFIED
            </span>

          </div>

          {/* Batch ID */}
          <div className="batch-id-section">
            <span>Batch ID</span>
            <strong>{verifiedBatch.id}</strong>
          </div>

          {/* Information Grid */}
          <div className="verification-info-grid">

            <div className="verification-info-card">
              <Home size={22} />
              <div>
                <span>Hive ID</span>
                <strong>{verifiedBatch.hiveId}</strong>
              </div>
            </div>

            <div className="verification-info-card">
              <MapPin size={22} />
              <div>
                <span>Origin</span>
                <strong>{verifiedBatch.location}</strong>
              </div>
            </div>

            <div className="verification-info-card">
              <Calendar size={22} />
              <div>
                <span>Harvest Date</span>
                <strong>
                  {verifiedBatch.harvestDate || "Not available"}
                </strong>
              </div>
            </div>

            <div className="verification-info-card">
              <Weight size={22} />
              <div>
                <span>Quantity</span>
                <strong>
                  {verifiedBatch.quantity
                    ? `${verifiedBatch.quantity} kg`
                    : "Not available"}
                </strong>
              </div>
            </div>

          </div>

          {/* QR + Verification Record */}
          <div className="qr-verification-bottom">

            {/* QR Code */}
            <div className="generated-qr-card">
              <div className="generated-qr-header">
                <QrCode size={22} />
                <div>
                  <h3>Batch QR Code</h3>
                  <p>Scan to identify this batch</p>
                </div>
              </div>

              {qrImage ? (
                <img
                  src={qrImage}
                  alt={`QR code for ${verifiedBatch.id}`}
                  className="generated-qr-image"
                />
              ) : (
                <div className="qr-loading">
                  Generating QR...
                </div>
              )}

              <strong>{verifiedBatch.id}</strong>
            </div>

            {/* Verification Record */}
            <div className="verification-record-card">

              <div className="record-header">
                <ShieldCheck size={24} />

                <div>
                  <h3>Verification Record</h3>
                  <p>Traceability confirmation</p>
                </div>
              </div>

              <div className="record-row">
                <span>Record ID</span>
                <strong>
                  {verifiedBatch.verificationId}
                </strong>
              </div>

              <div className="record-row">
                <span>Verification Status</span>
                <strong className="record-status">
                  <CheckCircle size={16} />
                  Verified
                </strong>
              </div>

              <div className="record-row">
                <span>Verified At</span>
                <strong>
                  <Clock size={16} />
                  {verifiedBatch.verifiedAt}
                </strong>
              </div>

            </div>

          </div>

          {/* Traceability Journey */}
          <div className="traceability-section">

            <h3>Traceability Journey</h3>

            <div className="traceability-flow">

              <div className="trace-step">
                <div className="trace-icon">
                  <Home size={20} />
                </div>
                <span>Hive</span>
              </div>

              <ArrowRight className="trace-arrow" size={20} />

              <div className="trace-step">
                <div className="trace-icon">
                  <Package size={20} />
                </div>
                <span>Harvest</span>
              </div>

              <ArrowRight className="trace-arrow" size={20} />

              <div className="trace-step">
                <div className="trace-icon">
                  <ShieldCheck size={20} />
                </div>
                <span>Verification</span>
              </div>

            </div>

          </div>

          {/* Prototype Note */}
          <div className="prototype-note">
            <ShieldCheck size={18} />

            <div>
              <strong>Prototype verification</strong>
              <p>
                This demonstration uses locally stored verification
                records. A cloud database and blockchain verification
                layer can be connected during deployment.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Not Found */}
      {searched && !verifiedBatch && (
        <div className="not-found-card">

          <div className="not-found-icon">
            <QrCode size={35} />
          </div>

          <h2>Batch Not Found</h2>

          <p>
            No verification record was found for
            <strong> {batchId.toUpperCase()}</strong>.
          </p>

          <button
            onClick={() => {
              setBatchId("");
              setSearched(false);
            }}
          >
            Try Another Batch
          </button>

        </div>
      )}

    </div>
  );
}

export default QRVerification;