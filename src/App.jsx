import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
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
  const [favorites, setFavorites] = useState([]);

  // 保存
  useEffect(()=>{
    const saved = localStorage.getItem("fav");
    if(saved) setFavorites(JSON.parse(saved));
  },[]);

  useEffect(()=>{
    localStorage.setItem("fav", JSON.stringify(favorites));
  },[favorites]);

  // 座標
  const coords = selectedCourse
    ? selectedCourse.spots.map(id=>{
        const s = spots.find(sp=>sp.id === id);
        return [s.lat, s.lng];
      })
    : [];

  return (
    <div className="container">

      <h1>🌍 今治観光ナビ</h1>

      {/* 言語 */}
      <div>
        <button onClick={()=>setLang("ja")}>日本語</button>
        <button onClick={()=>setLang("en")}>EN</button>
        <button onClick={()=>setLang("zh")}>中文</button>
        <button onClick={()=>setLang("ko")}>한국어</button>
      </div>

      {/* コース */}
      <h2>コース</h2>
      {courses.map(c=>(
        <button key={c.id} onClick={()=>setSelectedCourse(c)}>
          {c.name}
        </button>
      ))}

      {/* お気に入り */}
      <h2>⭐ お気に入り</h2>
      {favorites.length === 0 && <p>なし</p>}

      {favorites.map(id=>{
        const spot = spots.find(s=>s.id === id);
        if(!spot) return null;

        return (
          <div key={id} className="card">
            <h3>{spot.name?.[lang] || spot.name?.ja}</h3>
            <img src={spot.image || "https://via.placeholder.com/300"} />
          </div>
        );
      })}

      {/* スポット */}
      {selectedCourse && (
        <>
          <h2>スポット</h2>

          {selectedCourse.spots.map(id=>{
            const spot = spots.find(s=>s.id === id);
            if(!spot) return null;

            return (
              <div key={id} className="card">
                <h3>{spot.name?.[lang] || spot.name?.ja}</h3>

                <img
                  src={spot.image || "https://via.placeholder.com/300"}
                />

                <p>{spot.desc?.[lang] || spot.desc?.ja}</p>
                <p>📍 {spot.address?.[lang] || spot.address}</p>
                <p>⏰ {spot.hours?.[lang] || spot.hours}</p>

                <button onClick={()=>{
                  setFavorites(prev=>{
                    if(prev.includes(id)){
                      return prev.filter(i=>i!==id);
                    }else{
                      return [...prev,id];
                    }
                  });
                }}>
                  ⭐
                </button>
              </div>
            );
          })}

          {/* 地図 */}
          <MapContainer
            center={coords[0] || [34.06,133.0]}
            zoom={12}
            style={{height:"300px", marginTop:"20px"}}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {coords.map((pos,i)=>(
              <Marker key={i} position={pos}>
                <Popup>Spot</Popup>
              </Marker>
            ))}

            {/* ルート（改善済み） */}
            <Polyline
              positions={coords}
              pathOptions={{
                color:"blue",
                weight:5,
                dashArray:"8,10"
              }}
            />
          </MapContainer>
        </>
      )}

    </div>
  );
}

export default App;