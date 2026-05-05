import { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ピン修正
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// データ
import { spots } from "./data/spots";
import { courses } from "./data/courses";

function App() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lang, setLang] = useState("ja");

  // 座標安全版
  const coords = selectedCourse
    ? selectedCourse.spots
        .map(id => {
          const s = spots.find(sp => sp.id === id);
          if (!s) return null;
          return [s.lat, s.lng];
        })
        .filter(Boolean)
    : [];

  return (
    <div className="container">

      {/* タイトル */}
      <h1>今治観光ナビ</h1>

      {/* 言語 */}
      <div>
        <button onClick={()=>setLang("ja")}>日本語</button>
        <button onClick={()=>setLang("en")}>English</button>
        <button onClick={()=>setLang("zh")}>中文</button>
        <button onClick={()=>setLang("ko")}>한국어</button>
      </div>

      {/* コース */}
      <h2>コース</h2>
      <div className="course-buttons">
        {courses.map(c => (
          <button key={c.id} onClick={()=>setSelectedCourse(c)}>
            {c.name}
          </button>
        ))}
      </div>

      {/* 地図 */}
      {selectedCourse && (
        <div className="map-wrap">
          <MapContainer
            center={coords[0] || [34.06,133.0]}
            zoom={13}
            style={{ height:"350px", width:"100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {coords.map((pos,i)=>(
              <Marker key={i} position={pos} />
            ))}

            <Polyline positions={coords} />
          </MapContainer>
        </div>
      )}

      {/* 詳細 */}
      {selectedCourse && (
        <>
          <h2>場所の詳細</h2>

          <div className="spots-grid">
            {selectedCourse.spots.map(id => {
              const spot = spots.find(s=>s.id === id);
              if(!spot) return null;

              return (
                <div key={id} className="card">

                  <img
                    src={spot.image || "https://via.placeholder.com/300"}
                  />

                  <h3>{spot.name?.[lang] || spot.name?.ja}</h3>

                  <p>{spot.desc?.[lang] || spot.desc?.ja}</p>

                  <p>📍 {spot.address?.[lang] || spot.address}</p>
                  <p>⏰ {spot.hours?.[lang] || spot.hours}</p>

                  <button>☆ お気に入り</button>
                  <button>🔊 音声</button>
                  <button>🚗 ナビ開始</button>

                </div>
              );
            })}
          </div>
        </>
      )}

    </div>
  );
}

export default App;