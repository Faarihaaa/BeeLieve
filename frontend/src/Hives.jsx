import { useEffect, useState } from "react";
import {
  Plus,
  MapPin,
  Thermometer,
  Droplets,
  CloudSun,
  Navigation,
  X,
  LoaderCircle,
  ArrowRight,
} from "lucide-react";
import "./Hives.css";

function Hives() {
  const [hives, setHives] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [newHive, setNewHive] = useState({
    id: "",
    location: "",
    latitude: "",
    longitude: "",
    temperature: "",
    humidity: "",
  });

  useEffect(() => {
    loadHives();
  }, []);

  const loadHives = () => {
    fetch("http://localhost:5000/api/hives")
      .then((response) => response.json())
      .then((data) => setHives(data))
      .catch((error) => {
        console.error("Error loading hives:", error);
      });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("GPS is not supported by this browser.");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const locationResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const locationData = await locationResponse.json();
          const address = locationData.address || {};

          const placeName =
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            address.county ||
            "Current Location";

          const state = address.state || "";
          const country = address.country || "";

          const readableLocation = [placeName, state, country]
            .filter(Boolean)
            .join(", ");

          const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m`
          );

          const weatherData = await weatherResponse.json();

          const temperature =
            weatherData.current?.temperature_2m ?? "";

          const humidity =
            weatherData.current?.relative_humidity_2m ?? "";

          setNewHive((previousHive) => ({
            ...previousHive,
            location: readableLocation,
            latitude,
            longitude,
            temperature,
            humidity,
          }));
        } catch (error) {
          console.error("Location/weather error:", error);

          setNewHive((previousHive) => ({
            ...previousHive,
            latitude,
            longitude,
          }));

          alert(
            "GPS detected, but place name or weather could not be loaded."
          );
        } finally {
          setLoadingLocation(false);
        }
      },
      () => {
        setLoadingLocation(false);
        alert(
          "Unable to get your location. Please allow location access."
        );
      }
    );
  };

  const addHive = async () => {
    if (!newHive.id || !newHive.location) {
      alert("Please enter Hive ID and Location.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/hives",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newHive),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to add hive.");
        return;
      }

      setHives((previousHives) => [
        ...previousHives,
        data.hive,
      ]);

      setNewHive({
        id: "",
        location: "",
        latitude: "",
        longitude: "",
        temperature: "",
        humidity: "",
      });

      setShowForm(false);

      alert("🐝 Hive added successfully!");
    } catch (error) {
      console.error("Error adding hive:", error);
      alert("Could not connect to BeeLieve server.");
    }
  };

  const getStatusClass = (status) => {
    if (status === "Critical") return "hive-status critical";
    if (status === "Needs Attention")
      return "hive-status attention";

    return "hive-status healthy";
  };

  return (
    <div className="hives-page">

      {/* HEADER */}
      <div className="hives-page-header">
        <div>
          <div className="title-with-icon">
            <div className="page-title-icon">
              🐝
            </div>

            <div>
              <h1>My Hives</h1>
              <p>
                Manage and monitor all your beehives from one place.
              </p>
            </div>
          </div>
        </div>

        <button
          className="add-hive-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <>
              <X size={18} />
              Close
            </>
          ) : (
            <>
              <Plus size={18} />
              Add New Hive
            </>
          )}
        </button>
      </div>

      {/* ADD HIVE FORM */}
      {showForm && (
        <div className="new-hive-form">

          <div className="form-heading">
            <div>
              <h2>Add a New Hive</h2>
              <p>
                Enter the hive details or use GPS to detect its location.
              </p>
            </div>
          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>Hive ID</label>
              <input
                type="text"
                placeholder="Example: H-004"
                value={newHive.id}
                onChange={(e) =>
                  setNewHive({
                    ...newHive,
                    id: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Location</label>

              <input
                type="text"
                placeholder="Farm / village / area"
                value={newHive.location}
                onChange={(e) =>
                  setNewHive({
                    ...newHive,
                    location: e.target.value,
                  })
                }
              />
            </div>

          </div>

          <button
            className="gps-button"
            onClick={getCurrentLocation}
            disabled={loadingLocation}
          >
            {loadingLocation ? (
              <>
                <LoaderCircle
                  size={18}
                  className="spin"
                />
                Detecting location...
              </>
            ) : (
              <>
                <Navigation size={18} />
                Use My Current Location
              </>
            )}
          </button>

          {newHive.location && (
            <div className="location-preview">
              <MapPin size={17} />

              <div>
                <strong>{newHive.location}</strong>

                {newHive.temperature !== "" && (
                  <span>
                    Outdoor weather:{" "}
                    {newHive.temperature}°C ·{" "}
                    {newHive.humidity}% humidity
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="form-buttons">
            <button
              className="save-hive-button"
              onClick={addHive}
            >
              <Plus size={17} />
              Save Hive
            </button>

            <button
              className="cancel-hive-button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>

        </div>
      )}

      {/* HIVE COUNT */}
      <div className="hive-list-header">
        <div>
          <h2>Your Hives</h2>
          <span>
            {hives.length}{" "}
            {hives.length === 1 ? "hive" : "hives"} registered
          </span>
        </div>
      </div>

      {/* HIVE CARDS */}
      {hives.length === 0 ? (
        <div className="no-hives">
          <div className="no-hives-icon">🐝</div>
          <h3>No hives added yet</h3>
          <p>
            Add your first hive to start monitoring it.
          </p>

          <button
            className="add-hive-button"
            onClick={() => setShowForm(true)}
          >
            <Plus size={17} />
            Add Hive
          </button>
        </div>
      ) : (
        <div className="new-hive-grid">

          {hives.map((hive) => (
            <div className="new-hive-card" key={hive.id}>

              {/* CARD HEADER */}
              <div className="new-hive-card-header">

                <div className="hive-card-title">

                  <div className="hive-bee-icon">
                    🐝
                  </div>

                  <div>
                    <h3>{hive.id}</h3>

                    <div className="hive-location">
                      <MapPin size={13} />
                      <span>{hive.location}</span>
                    </div>
                  </div>

                </div>

                <span className={getStatusClass(hive.status)}>
                  <span className="status-dot-small"></span>
                  {hive.status}
                </span>

              </div>

              {/* WEATHER / READINGS */}
              <div className="hive-reading-grid">

                <div className="hive-reading">

                  <div className="reading-icon temperature">
                    <Thermometer size={18} />
                  </div>

                  <div>
                    <span>Temperature</span>
                    <strong>
                      {hive.temperature !== null &&
                      hive.temperature !== undefined
                        ? `${hive.temperature}°C`
                        : "--"}
                    </strong>
                  </div>

                </div>

                <div className="hive-reading">

                  <div className="reading-icon humidity">
                    <Droplets size={18} />
                  </div>

                  <div>
                    <span>Humidity</span>
                    <strong>
                      {hive.humidity !== null &&
                      hive.humidity !== undefined
                        ? `${hive.humidity}%`
                        : "--"}
                    </strong>
                  </div>

                </div>

              </div>

              {/* WEATHER NOTE */}
              <div className="weather-note">
                <CloudSun size={18} />

                <div>
                  <strong>Outdoor weather</strong>
                  <span>
                    Current environmental conditions
                  </span>
                </div>
              </div>

              {/* CARD FOOTER */}
              <button className="view-hive-button">
                View Hive Details
                <ArrowRight size={16} />
              </button>

            </div>
          ))}

        </div>
      )}

      {/* IMPORTANT DEMO NOTE */}
      <div className="hive-info-note">
        <div>ⓘ</div>

        <p>
          <strong>About these readings:</strong>{" "}
          Temperature and humidity shown here are currently
          outdoor weather readings. Actual hive sensor readings
          will come from the ESP32 sensor system when connected.
        </p>
      </div>

    </div>
  );
}

export default Hives;