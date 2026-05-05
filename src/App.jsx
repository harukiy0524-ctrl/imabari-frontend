import { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { spots } from "./data/spots";
import { courses } from "./data/courses";

function App() {
  const [selectedCourse, setSelectedCourse] = useState(null);

  return (
    <div className="container">

      <h1>今治観光ナビ</h1>

      {/* コース */}
      <div className="course-buttons">
        {courses.map(c => (
          <button key={c.id} onClick={() => setSelectedCourse(c)}>
            {c.name}
          </button>
        ))}
      </div>

      {/* 地図 */}
      {selectedCourse && (
        <MapContainer
          center={[34.06, 133.0]}
          zoom={10}
          style={{ height: "250px", marginTop: "20px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[34.06, 133.0]} />
        </MapContainer>
      )}

      {/* スポット */}
      {selectedCourse && (
        <div className="spots">
          {selectedCourse.spots.map(id => {
            const spot = spots.find(s => s.id === id);
            if (!spot) return null;

            return (
              <div key={id} className="card">

                {/* 横スクロール画像 */}
                <div className="image-row">
                  <img src={spot.image} />
                </div>

                <h3>{spot.name?.ja}</h3>
                <p>{spot.desc?.ja}</p>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default App;