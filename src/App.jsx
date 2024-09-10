import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [location, setLocation] = useState({ lat: "", long: "" });
  const [metroStation, setMetroStation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);

        const options = {
          method: "GET",
          url: "https://nearest-delhi-metro-station.p.rapidapi.com/nearestmetro",
          params: {
            lat,
            long,
          },
          headers: {
            "x-rapidapi-key":
              "ddb8c1c205msh5a3972024ba2835p1cd237jsn893abf873908",
            "x-rapidapi-host": "nearest-delhi-metro-station.p.rapidapi.com",
          },
        };

        try {
          const response = await axios.request(options);
          setMetroStation(response.data.data);
          console.log(response.data.data);
          setError(null);
          setIsLoading(false);
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
    <>
      <div className="container d-flex justify-content-center">
        <div className="col-md-4 m-2 mt-5">
          <div className="row card rounded-5 shadow p-5">
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <h2 className="text-center text-danger">
                Nearest Delhi Metro Station Finder
              </h2>
              <div style={{ marginBottom: "20px" }}>
                <label className="form-label">Latitude </label>
                <input
                  type="text"
                  className="form-control"
                  name="lat"
                  value={location.lat}
                  onChange={handleInputChange}
                  placeholder="Enter latitude"
                  readOnly
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label className="form-label">Longitude </label>
                <input
                  type="text"
                  name="long"
                  className="form-control"
                  value={location.long}
                  onChange={handleInputChange}
                  placeholder="Enter longitude"
                  readOnly
                />
              </div>

              <button className="btn btn-success" onClick={findNearestMetro}>
                <i className="bi bi-train-front"> </i>
                Find Nearest Metro
              </button>

              <div className="container-fluid">
                {isLoading ? (
                  <div className="spinner-border text-info mt-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : null}
                {metroStation && metroStation.length > 0 ? (
                  metroStation.slice(0, 6).map((e) => (
                    <div key={e.id} className="mt-3 container">
                      <h5>{e.station_name} </h5>
                    </div>
                  ))
                ) : (
                  <p className="text-danger">No metro stations found.</p>
                )}
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
