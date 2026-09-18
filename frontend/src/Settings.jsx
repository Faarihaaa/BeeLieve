import { useState } from "react";
import {
  User,
  Bell,
  Globe,
  RefreshCw,
  Info,
  ShieldCheck,
  Save,
  CheckCircle,
} from "lucide-react";

function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [language, setLanguage] = useState("English");
  const [saved, setSaved] = useState(false);

  const saveSettings = () => {
    localStorage.setItem(
      "beelieve_settings",
      JSON.stringify({
        notifications,
        autoSync,
        language,
      })
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="settings-page">

      {/* HEADER */}
      <div className="settings-header">
        <div className="settings-title-section">
          <div className="settings-main-icon">
            <User size={30} />
          </div>

          <div>
            <h1>Settings</h1>
            <p>Manage your BeeLieve preferences and application settings.</p>
          </div>
        </div>

        <button
          className="save-settings-button"
          onClick={saveSettings}
        >
          {saved ? <CheckCircle size={18} /> : <Save size={18} />}
          {saved ? "Saved" : "Save Changes"}
        </button>
      </div>

      {/* ACCOUNT */}
      <section className="settings-card">

        <div className="settings-card-header">
          <div className="settings-section-icon">
            <User size={20} />
          </div>

          <div>
            <h2>Account</h2>
            <p>Your BeeLieve account information.</p>
          </div>
        </div>

        <div className="settings-account">

          <div className="profile-avatar">
            B
          </div>

          <div className="profile-details">
            <strong>BeeLieve User</strong>
            <span>Beekeeper / Administrator</span>
          </div>

          <span className="account-status">
            <CheckCircle size={15} />
            Active
          </span>

        </div>

      </section>

      {/* PREFERENCES */}
      <section className="settings-card">

        <div className="settings-card-header">
          <div className="settings-section-icon">
            <Bell size={20} />
          </div>

          <div>
            <h2>Preferences</h2>
            <p>Customize how BeeLieve behaves.</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="setting-row">

          <div className="setting-row-info">
            <div className="setting-icon-small">
              <Bell size={18} />
            </div>

            <div>
              <strong>Hive Alerts</strong>
              <span>
                Receive notifications when hive conditions need attention.
              </span>
            </div>
          </div>

          <button
            className={`toggle ${notifications ? "active" : ""}`}
            onClick={() => setNotifications(!notifications)}
            aria-label="Toggle notifications"
          >
            <span></span>
          </button>

        </div>

        {/* Auto Sync */}
        <div className="setting-row">

          <div className="setting-row-info">
            <div className="setting-icon-small">
              <RefreshCw size={18} />
            </div>

            <div>
              <strong>Automatic Sync</strong>
              <span>
                Synchronize pending field data when internet is available.
              </span>
            </div>
          </div>

          <button
            className={`toggle ${autoSync ? "active" : ""}`}
            onClick={() => setAutoSync(!autoSync)}
            aria-label="Toggle automatic sync"
          >
            <span></span>
          </button>

        </div>

        {/* Language */}
        <div className="setting-row">

          <div className="setting-row-info">
            <div className="setting-icon-small">
              <Globe size={18} />
            </div>

            <div>
              <strong>Language</strong>
              <span>
                Select the language used by the BeeLieve interface.
              </span>
            </div>
          </div>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="language-select"
          >
            <option>English</option>
            <option>Tamil</option>
            <option>Hindi</option>
          </select>

        </div>

      </section>

      {/* SECURITY */}
      <section className="settings-card">

        <div className="settings-card-header">
          <div className="settings-section-icon">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h2>Security & Data</h2>
            <p>Information about data protection.</p>
          </div>
        </div>

        <div className="security-items">

          <div className="security-item">
            <CheckCircle size={18} />
            <div>
              <strong>Protected Application Data</strong>
              <span>
                BeeLieve is designed to protect hive and honey records.
              </span>
            </div>
          </div>

          <div className="security-item">
            <CheckCircle size={18} />
            <div>
              <strong>Offline Data Support</strong>
              <span>
                Field records can remain available when connectivity is unavailable.
              </span>
            </div>
          </div>

          <div className="security-item">
            <CheckCircle size={18} />
            <div>
              <strong>Traceability Records</strong>
              <span>
                Honey batches can be linked to their hive and harvest information.
              </span>
            </div>
          </div>

        </div>

      </section>

      {/* ABOUT */}
      <section className="settings-card about-card">

        <div className="settings-card-header">
          <div className="settings-section-icon">
            <Info size={20} />
          </div>

          <div>
            <h2>About BeeLieve</h2>
            <p>Smart beekeeping and honey traceability platform.</p>
          </div>
        </div>

        <div className="about-content">

          <div className="about-logo">
            🐝
          </div>

          <div>
            <h3>BeeLieve</h3>
            <p>
              A smart beekeeping management and honey traceability
              platform designed to help beekeepers monitor hive health,
              manage harvests and provide transparent honey records.
            </p>

            <span className="prototype-badge">
              SIH 2026 Prototype
            </span>
          </div>

        </div>

      </section>

      {/* FOOTER */}
      <div className="settings-footer">
        <span>BeeLieve</span>
        <span>Smart Beekeeping • Honey Traceability</span>
      </div>

    </div>
  );
}

export default Settings;