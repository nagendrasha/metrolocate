import { useState } from "react";
import axios from "axios";

const App = () => {
  const [location, setLocation] = useState({ lat: "", long: "" });
  const [metroStation, setMetroStation] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocation((prev) => ({ ...prev, [name]: value }));
  };

  const findNearestMetro = async () => {
    // Get user location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        
        // Update location state with the user's current coordinates
        setLocation({ lat, long });

        const options = {
          method: "GET",
          url: "https://nearest-delhi-metro-station.p.rapidapi.com/nearestmetro",
          params: {
            lat,
            long,
          },
          headers: {
            "x-rapidapi-key": "ddb8c1c205msh5a3972024ba2835p1cd237jsn893abf873908",
            "x-rapidapi-host": "nearest-delhi-metro-station.p.rapidapi.com",
          },
        };

        try {
          const response = await axios.request(options);
          setMetroStation(response.data.data);
          console.log(response.data.data);
          setError(null);
        } catch (err) {
          setError("Error fetching metro station");
          setMetroStation(null);
        }
      },
      (err) => {
        setError("Error getting location: " + err.message);
        setMetroStation(null);
      }
    );
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Nearest Delhi Metro Station Finder</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>Latitude: </label>
        <input
          type="text"
          name="lat"
          value={location.lat}
          onChange={handleInputChange}
          placeholder="Enter latitude"
          readOnly
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Longitude: </label>
        <input
          type="text"
          name="long"
          value={location.long}
          onChange={handleInputChange}
          placeholder="Enter longitude"
          readOnly
        />
      </div>

      <button onClick={findNearestMetro}>Find Nearest Metro</button>

      {metroStation && metroStation.length > 0 ? (
        metroStation.map((e) => (
          <div key={e.id}>
            <h2>{e.station_name}</h2>
          </div>
        ))
      ) : (
        <p>No metro stations found.</p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default App;
