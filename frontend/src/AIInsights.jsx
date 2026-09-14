import { useEffect, useState } from "react";

import {
  Brain,
  Thermometer,
  Droplets,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  RefreshCw,
  Activity,
} from "lucide-react";

function AIInsights() {
  const [hives, setHives] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD HIVE DATA
  // =====================================================

  const loadHives = () => {
    setLoading(true);

    fetch("http://localhost:5000/api/hives")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load hive data");
        }

        return response.json();
      })
      .then((data) => {
        setHives(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading AI data:", error);
        setLoading(false);
      });
  };

  // =====================================================
  // LOAD DATA WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    loadHives();
  }, []);

  // =====================================================
  // AI ANALYSIS
  // =====================================================

  const getInsight = (hive) => {
    const temperature = Number(hive.temperature);
    const humidity = Number(hive.humidity);

    // CRITICAL CONDITION

    if (temperature >= 40 || humidity >= 80) {
      return {
        type: "Critical",

        title: "High environmental stress detected",

        description:
          "The current environmental readings are outside the safe monitored range.",

        action:
          "Inspect the hive immediately and check ventilation, colony condition, and the surrounding environment.",

        icon: <AlertTriangle size={20} />,
      };
    }

    // NEEDS ATTENTION

    if (temperature >= 37 || humidity >= 70) {
      return {
        type: "Needs Attention",

        title: "Environmental condition needs monitoring",

        description:
          "The current readings indicate a possible environmental stress condition.",

        action:
          "Monitor this hive closely and inspect the colony if the condition continues.",

        icon: <TrendingUp size={20} />,
      };
    }

    // HEALTHY

    return {
      type: "Healthy",

      title: "Hive conditions look stable",

      description:
        "Current temperature and humidity readings are within the monitored range.",

      action:
        "Continue regular monitoring and maintain the current hive conditions.",

      icon: <CheckCircle size={20} />,
    };
  };

  // =====================================================
  // SUMMARY COUNTS
  // =====================================================

  const healthyCount = hives.filter(
    (hive) => hive.status === "Healthy"
  ).length;

  const attentionCount = hives.filter(
    (hive) => hive.status === "Needs Attention"
  ).length;

  const criticalCount = hives.filter(
    (hive) => hive.status === "Critical"
  ).length;

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="ai-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="ai-header">

        <div className="ai-title">

          <div className="ai-title-icon">
            <Brain size={28} />
          </div>

          <div>
            <h1>AI Insights</h1>

            <p>
              Intelligent analysis of hive conditions and environmental data.
            </p>
          </div>

        </div>

        <div className="ai-prototype-badge">
          <Brain size={15} />
          AI Prototype
        </div>

      </div>

      {/* =================================================
          INFORMATION CARD
      ================================================= */}

      <div className="ai-info">

        <Brain size={20} />

        <div>

          <strong>
            AI-powered hive analysis
          </strong>

          <p>
            BeeLieve analyzes hive sensor readings to identify
            abnormal conditions and provide early recommendations.
          </p>

        </div>

      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="ai-summary">

        {/* HIVES ANALYSED */}

        <div className="ai-summary-card">

          <div className="ai-summary-icon">
            <Brain size={22} />
          </div>

          <div>

            <span>
              Hives Analysed
            </span>

            <strong>
              {hives.length}
            </strong>

          </div>

        </div>

        {/* STABLE */}

        <div className="ai-summary-card">

          <div className="ai-summary-icon healthy-ai">
            <CheckCircle size={22} />
          </div>

          <div>

            <span>
              Stable
            </span>

            <strong>
              {healthyCount}
            </strong>

          </div>

        </div>

        {/* ATTENTION */}

        <div className="ai-summary-card">

          <div className="ai-summary-icon attention-ai">
            <AlertTriangle size={22} />
          </div>

          <div>

            <span>
              Needs Monitoring
            </span>

            <strong>
              {attentionCount}
            </strong>

          </div>

        </div>

        {/* CRITICAL */}

        <div className="ai-summary-card">

          <div className="ai-summary-icon critical-ai">
            <AlertTriangle size={22} />
          </div>

          <div>

            <span>
              Critical
            </span>

            <strong>
              {criticalCount}
            </strong>

          </div>

        </div>

      </div>

      {/* =================================================
          AI ANALYSIS SECTION
      ================================================= */}

      <div className="ai-analysis-container">

        {/* SECTION HEADER */}

        <div className="ai-section-header">

          <div>

            <h2>
              Hive Health Analysis
            </h2>

            <p>
              AI-based interpretation of current hive conditions
            </p>

          </div>

          <button
            className="refresh-button"
            onClick={loadHives}
          >
            <RefreshCw size={16} />

            Refresh Analysis
          </button>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="ai-loading">

            <RefreshCw
              size={30}
              className="spin"
            />

            <h3>
              Analysing hive data...
            </h3>

            <p>
              Connecting to BeeLieve backend.
            </p>

          </div>

        ) : hives.length === 0 ? (

          /* =================================================
              NO HIVES
          ================================================= */

          <div className="ai-loading">

            <Brain size={35} />

            <h3>
              No hive data available
            </h3>

            <p>
              Add a hive to generate AI insights.
            </p>

          </div>

        ) : (

          /* =================================================
              HIVE LIST
          ================================================= */

          <div className="ai-hive-list">

            {hives.map((hive) => {

              const insight = getInsight(hive);

              return (

                <div
                  className="ai-hive-card"
                  key={hive.id}
                >

                  {/* =================================================
                      HIVE HEADER
                  ================================================= */}

                  <div className="ai-hive-top">

                    <div className="ai-hive-name">

                      <div className="ai-hive-icon">
                        🐝
                      </div>

                      <div>

                        <h3>
                          {hive.id}
                        </h3>

                        <span>
                          {hive.location}
                        </span>

                      </div>

                    </div>

                    {/* STATUS */}

                    <div
                      className={`ai-status ${
                        insight.type === "Healthy"
                          ? "ai-status-healthy"
                          : insight.type === "Critical"
                          ? "ai-status-critical"
                          : "ai-status-attention"
                      }`}
                    >

                      {insight.icon}

                      {insight.type}

                    </div>

                  </div>

                  {/* =================================================
                      SENSOR READINGS
                  ================================================= */}

                  <div className="ai-readings">

                    {/* TEMPERATURE */}

                    <div className="ai-reading">

                      <div className="ai-reading-icon temperature">
                        <Thermometer size={19} />
                      </div>

                      <div>

                        <span>
                          Temperature
                        </span>

                        <strong>
                          {hive.temperature ?? "--"}°C
                        </strong>

                      </div>

                    </div>

                    {/* HUMIDITY */}

                    <div className="ai-reading">

                      <div className="ai-reading-icon humidity">
                        <Droplets size={19} />
                      </div>

                      <div>

                        <span>
                          Humidity
                        </span>

                        <strong>
                          {hive.humidity ?? "--"}%
                        </strong>

                      </div>

                    </div>

                  </div>

                  {/* =================================================
                      AI RESULT
                  ================================================= */}

                  <div
                    className={`ai-result ${
                      insight.type === "Healthy"
                        ? "ai-result-healthy"
                        : insight.type === "Critical"
                        ? "ai-result-critical"
                        : "ai-result-attention"
                    }`}
                  >

                    <div className="ai-result-icon">

                      {insight.icon}

                    </div>

                    <div>

                      <strong>
                        {insight.title}
                      </strong>

                      <p>
                        {insight.description}
                      </p>

                    </div>

                  </div>

                  {/* =================================================
                      RECOMMENDED ACTION
                  ================================================= */}

                  <div className="ai-recommendation">

                    <Lightbulb size={18} />

                    <div>

                      <strong>
                        Recommended Action
                      </strong>

                      <p>
                        {insight.action}
                      </p>

                    </div>

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </div>

      {/* =================================================
          FUTURE AI NOTE
      ================================================= */}

      <div className="ai-future-note">

        <Activity size={18} />

        <p>

          <strong>
            Future AI integration:
          </strong>{" "}

          BeeLieve can connect machine-learning models trained
          on hive sensor and disease data for predictive health
          monitoring, swarm-risk detection and productivity prediction.

        </p>

      </div>

    </div>
  );
}

// =====================================================
// IMPORTANT
// AIINSIGHTS.JSX MUST EXPORT AIINSIGHTS
// =====================================================

export default AIInsights;