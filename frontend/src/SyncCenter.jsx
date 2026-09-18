import { useEffect, useState } from "react";
import {
  RefreshCw,
  Wifi,
  WifiOff,
  CheckCircle,
  Clock,
  AlertTriangle,
  Database,
  Cloud,
  Smartphone,
  ArrowUp,
} from "lucide-react";

function SyncCenter() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(
    localStorage.getItem("beelieve_last_sync") || "Not synced yet"
  );
  const [syncing, setSyncing] = useState(false);

  const [syncRecords, setSyncRecords] = useState([
    {
      id: 1,
      type: "Hive Reading",
      description: "Temperature & humidity data",
      status: "Synced",
      time: "Today, 10:30 AM",
    },
    {
      id: 2,
      type: "Hive Health",
      description: "H-001 health status",
      status: "Synced",
      time: "Today, 10:28 AM",
    },
    {
      id: 3,
      type: "Honey Batch",
      description: "BATCH-003 verification record",
      status: "Pending Sync",
      time: "Today, 10:15 AM",
    },
  ]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const syncedCount = syncRecords.filter(
    (record) => record.status === "Synced"
  ).length;

  const pendingCount = syncRecords.filter(
    (record) => record.status === "Pending Sync"
  ).length;

  const failedCount = syncRecords.filter(
    (record) => record.status === "Sync Failed"
  ).length;

  const syncNow = () => {
    if (!isOnline) {
      alert(
        "BeeLieve is currently offline. Pending records will sync automatically when internet connection is restored."
      );
      return;
    }

    setSyncing(true);

    setTimeout(() => {
      const now = new Date();

      const formattedTime = now.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      setSyncRecords((records) =>
        records.map((record) =>
          record.status === "Pending Sync"
            ? {
                ...record,
                status: "Synced",
                time: "Just now",
              }
            : record
        )
      );

      setLastSync(formattedTime);
      localStorage.setItem("beelieve_last_sync", formattedTime);

      setSyncing(false);
    }, 1500);
  };

  return (
    <div className="sync-page">

      {/* HEADER */}
      <div className="sync-page-header">

        <div className="sync-title-section">
          <div className="sync-main-icon">
            <RefreshCw size={30} />
          </div>

          <div>
            <h1>Sync Center</h1>
            <p>
              Manage offline data and synchronize it when connectivity
              is available.
            </p>
          </div>
        </div>

        <div
          className={`connection-badge ${
            isOnline ? "online" : "offline"
          }`}
        >
          {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}

          <span>
            {isOnline ? "Internet Connected" : "Offline Mode"}
          </span>
        </div>

      </div>

      {/* STATUS CARDS */}
      <div className="sync-summary-grid">

        <div className="sync-summary-card">
          <div className="sync-summary-icon synced-icon">
            <CheckCircle size={23} />
          </div>

          <div>
            <span>Synced</span>
            <strong>{syncedCount}</strong>
            <small>Records completed</small>
          </div>
        </div>

        <div className="sync-summary-card">
          <div className="sync-summary-icon pending-icon">
            <Clock size={23} />
          </div>

          <div>
            <span>Pending Sync</span>
            <strong>{pendingCount}</strong>
            <small>Waiting for upload</small>
          </div>
        </div>

        <div className="sync-summary-card">
          <div className="sync-summary-icon failed-icon">
            <AlertTriangle size={23} />
          </div>

          <div>
            <span>Failed</span>
            <strong>{failedCount}</strong>
            <small>Need attention</small>
          </div>
        </div>

        <div className="sync-summary-card">
          <div className="sync-summary-icon storage-icon">
            <Database size={23} />
          </div>

          <div>
            <span>Local Storage</span>
            <strong>Active</strong>
            <small>Offline data protected</small>
          </div>
        </div>

      </div>

      {/* SYNC CONTROL */}
      <div className="sync-control-card">

        <div className="sync-control-left">

          <div className="cloud-icon">
            {isOnline ? (
              <Cloud size={30} />
            ) : (
              <WifiOff size={30} />
            )}
          </div>

          <div>
            <h2>
              {isOnline
                ? "Ready to synchronize"
                : "Working in offline mode"}
            </h2>

            <p>
              {isOnline
                ? "Your connection is available. Pending records can now be synchronized."
                : "Data is being stored locally. It will be synchronized automatically when the connection returns."}
            </p>
          </div>

        </div>

        <button
          className="sync-now-button"
          onClick={syncNow}
          disabled={syncing}
        >
          <RefreshCw
            size={18}
            className={syncing ? "spin-icon" : ""}
          />

          {syncing ? "Synchronizing..." : "Sync Now"}
        </button>

      </div>

      {/* LAST SYNC */}
      <div className="last-sync-card">

        <div className="last-sync-icon">
          <Clock size={20} />
        </div>

        <div>
          <span>Last successful synchronization</span>
          <strong>{lastSync}</strong>
        </div>

      </div>

      {/* DATA FLOW */}
      <div className="sync-flow-card">

        <div className="section-heading">
          <h2>How Offline Sync Works</h2>
          <p>
            BeeLieve protects field data even when the beekeeper has
            no internet connection.
          </p>
        </div>

        <div className="sync-flow">

          <div className="sync-flow-step">
            <div className="flow-step-icon">
              <Smartphone size={23} />
            </div>

            <strong>Field Data</strong>

            <span>
              Sensor readings and records are collected.
            </span>
          </div>

          <ArrowUp
            className="flow-arrow"
            size={22}
          />

          <div className="sync-flow-step">
            <div className="flow-step-icon">
              <Database size={23} />
            </div>

            <strong>Local Storage</strong>

            <span>
              Data is safely kept on the device while offline.
            </span>
          </div>

          <ArrowUp
            className="flow-arrow"
            size={22}
          />

          <div className="sync-flow-step">
            <div className="flow-step-icon">
              <Cloud size={23} />
            </div>

            <strong>Cloud Sync</strong>

            <span>
              Pending records are uploaded when internet returns.
            </span>
          </div>

        </div>

      </div>

      {/* RECORDS */}
      <div className="sync-records-card">

        <div className="sync-records-header">
          <div>
            <h2>Synchronization Activity</h2>
            <p>Recent BeeLieve data synchronization records.</p>
          </div>
        </div>

        <div className="sync-record-list">

          {syncRecords.map((record) => (

            <div
              className="sync-record"
              key={record.id}
            >

              <div className="record-type-icon">
                {record.status === "Synced" ? (
                  <CheckCircle size={20} />
                ) : record.status === "Pending Sync" ? (
                  <Clock size={20} />
                ) : (
                  <AlertTriangle size={20} />
                )}
              </div>

              <div className="sync-record-info">
                <strong>{record.type}</strong>
                <span>{record.description}</span>
              </div>

              <div className="sync-record-time">
                <span>{record.time}</span>

                <span
                  className={`sync-status ${
                    record.status === "Synced"
                      ? "status-synced"
                      : record.status === "Pending Sync"
                      ? "status-pending"
                      : "status-failed"
                  }`}
                >
                  {record.status}
                </span>
              </div>

            </div>

          ))}

        </div>

      </div>

      {/* PROTOTYPE NOTE */}
      <div className="sync-prototype-note">

        <Database size={19} />

        <div>
          <strong>Offline-ready prototype</strong>

          <p>
            The current prototype demonstrates local data storage
            and synchronization states. IndexedDB and a cloud
            database can be connected for production deployment.
          </p>
        </div>

      </div>

    </div>
  );
}

export default SyncCenter;