import { useEffect, useState } from "react";
import {
  Package,
  Plus,
  Calendar,
  Weight,
  Home,
  X,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function HoneyProduction() {
  const [showForm, setShowForm] = useState(false);

  // Harvest data from PostgreSQL
  const [harvests, setHarvests] = useState([]);

  const [formData, setFormData] = useState({
    date: "",
    hive: "",
    quantity: "",
    type: "",
  });

  const [loading, setLoading] = useState(true);

  // =======================================
  // LOAD HARVESTS FROM DATABASE
  // =======================================

  const fetchHarvests = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/harvests"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch harvests");
      }

      const data = await response.json();

      setHarvests(data);

    } catch (error) {
      console.error("Error loading harvests:", error);
      alert("Could not load harvest records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHarvests();
  }, []);

  // =======================================
  // CALCULATIONS
  // =======================================

  const totalProduction = harvests.reduce(
    (total, harvest) => total + Number(harvest.quantity || 0),
    0
  );

  const totalHarvests = harvests.length;

  const hiveProduction = {};

  harvests.forEach((harvest) => {
    if (!hiveProduction[harvest.hive]) {
      hiveProduction[harvest.hive] = 0;
    }

    hiveProduction[harvest.hive] += Number(harvest.quantity || 0);
  });

  const hiveChartData = Object.entries(hiveProduction).map(
    ([hive, quantity]) => ({
      hive,
      quantity: Number(quantity.toFixed(1)),
    })
  );

  // =======================================
  // MONTHLY PRODUCTION
  // =======================================

  const monthlyProduction = {};

  harvests.forEach((harvest) => {
    if (!harvest.date) return;

    const date = new Date(harvest.date);

    const month = date.toLocaleString("en-US", {
      month: "short",
    });

    if (!monthlyProduction[month]) {
      monthlyProduction[month] = 0;
    }

    monthlyProduction[month] += Number(harvest.quantity || 0);
  });

  const monthOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyData = monthOrder
    .filter((month) => monthlyProduction[month] !== undefined)
    .map((month) => ({
      month,
      production: Number(monthlyProduction[month].toFixed(1)),
    }));

  // =======================================
  // FORM INPUT
  // =======================================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // =======================================
  // ADD HARVEST
  // =======================================

  const addHarvest = async (event) => {
    event.preventDefault();

    if (
      !formData.date ||
      !formData.hive ||
      !formData.quantity ||
      !formData.type
    ) {
      alert("Please fill all harvest details.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/harvests",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            date: formData.date,
            hive: formData.hive,
            quantity: Number(formData.quantity),
            type: formData.type,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save harvest"
        );
      }

      alert("Harvest saved successfully! 🐝");

      // Reset form
      setFormData({
        date: "",
        hive: "",
        quantity: "",
        type: "",
      });

      setShowForm(false);

      // Reload database records
      fetchHarvests();

    } catch (error) {
      console.error("Error saving harvest:", error);

      alert(error.message);
    }
  };

  // =======================================
  // UI
  // =======================================

  return (
    <div className="production-page">

      {/* HEADER */}
      <div className="production-header">

        <div className="production-title">

          <div className="production-title-icon">
            <Package size={27} />
          </div>

          <div>
            <h1>Honey Production</h1>

            <p>
              Track honey harvests and monitor production from your hives.
            </p>
          </div>

        </div>

        <button
          className="add-harvest-button"
          onClick={() => setShowForm(true)}
        >
          <Plus size={17} />
          Add Harvest
        </button>

      </div>


      {/* SUMMARY CARDS */}
      <div className="production-summary">

        <div className="production-card">

          <div className="production-card-icon">
            <Weight size={22} />
          </div>

          <div>
            <span>Total Honey Produced</span>

            <strong>
              {totalProduction.toFixed(1)} kg
            </strong>
          </div>

        </div>


        <div className="production-card">

          <div className="production-card-icon harvest-icon">
            <Package size={22} />
          </div>

          <div>
            <span>Total Harvests</span>

            <strong>
              {totalHarvests}
            </strong>
          </div>

        </div>


        <div className="production-card">

          <div className="production-card-icon hive-production-icon">
            <Home size={22} />
          </div>

          <div>
            <span>Active Hives</span>

            <strong>
              {Object.keys(hiveProduction).length}
            </strong>
          </div>

        </div>

      </div>


      {/* CHARTS */}
      <div className="production-charts">

        {/* MONTHLY PRODUCTION */}
        <div className="production-chart-card">

          <div className="production-section-header">

            <div>
              <h2>Monthly Production</h2>

              <p>
                Honey production trend from recorded harvests
              </p>
            </div>

          </div>


          <div className="production-chart">

            {monthlyData.length === 0 ? (

              <div className="empty-state">
                No production data available yet.
              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height={280}
              >

                <BarChart data={monthlyData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="production"
                    fill="#f5b719"
                    radius={[6, 6, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            )}

          </div>

        </div>


        {/* HIVE-WISE PRODUCTION */}
        <div className="production-chart-card">

          <div className="production-section-header">

            <div>
              <h2>Hive-wise Production</h2>

              <p>
                Total honey collected from each hive
              </p>
            </div>

          </div>


          <div className="production-chart">

            {hiveChartData.length === 0 ? (

              <div className="empty-state">
                No harvest records available yet.
              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height={280}
              >

                <BarChart data={hiveChartData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="hive" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="quantity"
                    fill="#0b6549"
                    radius={[6, 6, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            )}

          </div>

        </div>

      </div>


      {/* HARVEST HISTORY */}
      <div className="harvest-history-card">

        <div className="production-section-header">

          <div>

            <h2>Harvest History</h2>

            <p>
              Recent honey collection records
            </p>

          </div>

        </div>


        <div className="harvest-table-wrapper">

          {loading ? (

            <div className="empty-state">
              Loading harvest records...
            </div>

          ) : harvests.length === 0 ? (

            <div className="empty-state">
              No harvest records yet. Click "Add Harvest" to create one.
            </div>

          ) : (

            <table className="harvest-table">

              <thead>

                <tr>
                  <th>Date</th>
                  <th>Hive</th>
                  <th>Honey Type</th>
                  <th>Quantity</th>
                </tr>

              </thead>


              <tbody>

                {harvests.map((harvest) => (

                  <tr key={harvest.id}>

                    <td>

                      <div className="table-date">

                        <Calendar size={15} />

                        {harvest.date}

                      </div>

                    </td>


                    <td>
                      <strong>
                        {harvest.hive}
                      </strong>
                    </td>


                    <td>

                      <span className="honey-type">

                        {harvest.notes
                          ? harvest.notes.replace(
                              "Honey Type: ",
                              ""
                            ).split(" | ")[0]
                          : "—"}

                      </span>

                    </td>


                    <td>

                      <strong>
                        {Number(harvest.quantity).toFixed(1)} kg
                      </strong>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>


      {/* ADD HARVEST MODAL */}
      {showForm && (

        <div className="harvest-modal-overlay">

          <div className="harvest-modal">

            <div className="harvest-modal-header">

              <div>

                <h2>Add Honey Harvest</h2>

                <p>
                  Record a new honey collection.
                </p>

              </div>


              <button
                className="close-modal-button"
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>

            </div>


            <form onSubmit={addHarvest}>

              <div className="harvest-form-grid">

                {/* DATE */}
                <div className="harvest-form-group">

                  <label>
                    Harvest Date
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                  />

                </div>


                {/* HIVE */}
                <div className="harvest-form-group">

                  <label>
                    Hive ID
                  </label>

                  <input
                    type="text"
                    name="hive"
                    placeholder="Example: H-101"
                    value={formData.hive}
                    onChange={handleInputChange}
                  />

                </div>


                {/* QUANTITY */}
                <div className="harvest-form-group">

                  <label>
                    Quantity (kg)
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    name="quantity"
                    placeholder="Example: 10.5"
                    value={formData.quantity}
                    onChange={handleInputChange}
                  />

                </div>


                {/* HONEY TYPE */}
                <div className="harvest-form-group">

                  <label>
                    Honey Type
                  </label>

                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
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


              {/* BUTTONS */}
              <div className="harvest-form-buttons">

                <button
                  type="button"
                  className="cancel-harvest-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="save-harvest-button"
                >

                  <Plus size={16} />

                  Save Harvest

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default HoneyProduction;