import { useState, useEffect, useRef } from "react";
import { spots } from "./data/spots";
import "./App.css";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import "leaflet-routing-machine";
import L from "leaflet";

export default function App() {
  const [lang, setLang] = useState("ja");
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [favorites, setFavorites] = useState([]);
  const [routeTarget, setRouteTarget] = useState(null);
  const [currentPos, setCurrentPos] = useState(null);

  const mapRef = useRef();

  // 多言語
  const getText = (obj) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[lang] || obj.ja || "";
  };

  // 現在地
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCurrentPos([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  // ルート表示
  useEffect(() => {
    if (!mapRef.current || !routeTarget || !currentPos) return;

    const map = mapRef.current;

    L.Routing.control({
      waypoints: [
        L.latLng(currentPos[0], currentPos[1]),
        L.latLng(routeTarget.lat, routeTarget.lng),
      ],
      lineOptions: { styles: [{ color: "#2563eb", weight: 5 }] },
      addWaypoints: false,
    }).addTo(map);
  }, [routeTarget, currentPos]);

  const categories = ["すべて", ...new Set(spots.map((s) => s.category))];

  const filteredSpots =
    selectedCategory === "すべて"
      ? spots
      : spots.filter((s) => s.category === selectedCategory);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="app">
      <h1>今治観光ナビ</h1>

      {/* 言語 */}
      <div className="lang">
        {["ja", "en", "zh", "ko"].map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={lang === l ? "active" : ""}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* カテゴリ */}
      <div className="filter">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={selectedCategory === cat ? "active" : ""}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 地図 */}
      <div className="map-box">
        <MapContainer
          center={[34.06, 133.0]}
          zoom={11}
          className="map"
          whenCreated={(map) => (mapRef.current = map)}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {filteredSpots.map((spot) => (
            <Marker key={spot.id} position={[spot.lat, spot.lng]}>
              <Popup>{getText(spot.name)}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* お気に入り */}
      <h2>⭐ お気に入り</h2>
      <div className="fav-row">
        {favorites.length === 0 && <p>まだなし</p>}
        {favorites.map((id) => {
          const spot = spots.find((s) => s.id === id);
          return <button className="fav-item">{getText(spot.name)}</button>;
        })}
      </div>

      {/* スポット */}
      <h2>詳細</h2>
      <div className="spots-row">
        {filteredSpots.map((spot) => (
          <div key={spot.id} className="card">
            <img
              src={
                spot.image
                  ? `${spot.image}?w=400`
                  : "https://via.placeholder.com/300x200"
              }
            />

            <div className="card-content">
              <h3>{getText(spot.name)}</h3>
              <p>{getText(spot.desc)}</p>

              <div className="btn-row">
                <button
                  className="btn btn-fav"
                  onClick={() => toggleFavorite(spot.id)}
                >
                  ★
                </button>

                <button className="btn btn-speak">🔊</button>

                <button
                  className="btn btn-map"
                  onClick={() => setRouteTarget(spot)}
                >
                  🚗
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}