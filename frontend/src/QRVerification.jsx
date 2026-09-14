import { useEffect, useState } from "react";
import {
  QrCode,
  Search,
  CheckCircle,
  Package,
  Home,
  Calendar,
  Weight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

function QRVerification() {
  const [batches, setBatches] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const savedBatches = localStorage.getItem("beelieve_batches");

    if (savedBatches) {
      setBatches(JSON.parse(savedBatches));
    } else {
      setBatches([
        {
          id: "BATCH-001",
          hiveId: "H-001",
          harvestDate: "2026-09-01",
          quantity: 25,
          status: "Verified",
        },
        {
          id: "BATCH-002",
          hiveId: "H-002",
          harvestDate: "2026-09-05",
          quantity: 18,
          status: "Verified",
        },
        {
          id: "BATCH-003",
          hiveId: "H-003",
          harvestDate: "2026-09-08",
          quantity: 30,
          status: "Pending Verification",
        },
      ]);
    }
  }, []);

  // Read Batch ID from QR URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verifyId = params.get("verify");

    if (verifyId) {
      setSearchId(verifyId);
      verifyBatch(verifyId);
    }
  }, [batches]);

  function verifyBatch(id) {
    if (!id) return;

    const cleanId = id.trim().toUpperCase();

    const batch = batches.find(
      (item) => item.id.toUpperCase() === cleanId
    );

    setSelectedBatch(batch || null);
    setSearched(true);
  }

  function handleSearch(e) {
    e.preventDefault();
    verifyBatch(searchId);
  }

  return (
    <div className="qr-page">
      {/* Header */}
      <div className="qr-page-header">
        <div className="title-with-icon">
          <div className="page-title-icon">
            <QrCode size={28} />
          </div>

          <div>
            <h1>QR Verification</h1>
            <p>Verify honey batch information and traceability.</p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="qr-search-card">
        <div className="qr-search-icon">
          <QrCode size={45} />
        </div>

        <h2>Verify Honey Batch</h2>

        <p>
          Enter the Batch ID printed on the honey package or scan its
          QR code.
        </p>

        <form onSubmit={handleSearch} className="qr-search-form">
          <input
            type="text"
            placeholder="Example: BATCH-001"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />

          <button type="submit">
            <Search size={18} />
            Verify
          </button>
        </form>

        {/* Demo buttons */}
        <div className="qr-demo-buttons">
          <span>Try demo:</span>

          {batches.slice(0, 3).map((batch) => (
            <button
              key={batch.id}
              onClick={() => {
                setSearchId(batch.id);
                verifyBatch(batch.id);
              }}
            >
              {batch.id}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result */}
      {searched && selectedBatch && (
        <div className="verification-result verified">
          <div className="verification-header">
            <div className="verification-success-icon">
              <CheckCircle size={35} />
            </div>

            <div>
              <h2>Batch Verified</h2>
              <p>This batch exists in the BeeLieve traceability system.</p>
            </div>

            <div className="verified-badge">
              <ShieldCheck size={18} />
              {selectedBatch.status}
            </div>
          </div>

          <div className="batch-details-grid">
            <div className="batch-detail">
              <Package size={22} />
              <div>
                <span>Batch ID</span>
                <strong>{selectedBatch.id}</strong>
              </div>
            </div>

            <div className="batch-detail">
              <Home size={22} />
              <div>
                <span>Hive ID</span>
                <strong>{selectedBatch.hiveId}</strong>
              </div>
            </div>

            <div className="batch-detail">
              <Calendar size={22} />
              <div>
                <span>Harvest Date</span>
                <strong>{selectedBatch.harvestDate}</strong>
              </div>
            </div>

            <div className="batch-detail">
              <Weight size={22} />
              <div>
                <span>Quantity</span>
                <strong>{selectedBatch.quantity} kg</strong>
              </div>
            </div>
          </div>

          <div className="traceability-note">
            <ShieldCheck size={20} />

            <div>
              <strong>Traceability Record</strong>
              <p>
                This batch can be traced back to its registered hive
                and harvest information.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Not Found */}
      {searched && !selectedBatch && (
        <div className="verification-result not-found">
          <AlertCircle size={45} />

          <h2>Batch Not Found</h2>

          <p>
            We couldn't find a batch with ID{" "}
            <strong>{searchId}</strong>.
          </p>

          <p>
            Please check the Batch ID and try again.
          </p>
        </div>
      )}

      {/* Information */}
      <div className="qr-info-card">
        <QrCode size={25} />

        <div>
          <strong>How BeeLieve QR Verification works</strong>

          <p>
            Each honey batch receives a unique Batch ID and QR code.
            Consumers can scan the code to view the registered batch
            information and traceability record.
          </p>

          <small>
            Prototype: verification records are currently stored
            locally. A cloud database and blockchain verification
            layer can be connected during deployment.
          </small>
        </div>
      </div>
    </div>
  );
}

export default QRVerification;