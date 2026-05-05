import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { spots } from "./data/spots";
import { courses } from "./data/courses";
import "./App.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapFocus({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);

  return null;
}

function App() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lang, setLang] = useState("ja");
  const [favorites, setFavorites] = useState([]);
  const [activeSpot, setActiveSpot] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const getText = (obj) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[lang] || obj.ja || "";
  };

  const courseSpots = selectedCourse
    ? selectedCourse.spots
        .map((id) => spots.find((s) => s.id === id))
        .filter(Boolean)
    : [];

  const coords = courseSpots
    .filter((s) => s.lat && s.lng)
    .map((s) => [s.lat, s.lng]);

  const activeSpotData =
    spots.find((s) => s.id === activeSpot) || courseSpots[0];

  const mapCenter = activeSpotData
    ? [activeSpotData.lat, activeSpotData.lng]
    : [34.06, 133.0];

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const speak = (spot) => {
    const text = `${getText(spot.name)}。${getText(spot.desc)}`;
    const msg = new SpeechSynthesisUtterance(text);

    msg.lang =
      lang === "ja"
        ? "ja-JP"
        : lang === "zh"
        ? "zh-CN"
        : lang === "ko"
        ? "ko-KR"
        : "en-US";

    speechSynthesis.cancel();
    speechSynthesis.speak(msg);
  };

  const openMap = (spot) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`,
      "_blank"
    );
  };

  return (
    <div className="app">
      <header className="hero">
        <h1>今治観光ナビ</h1>
        <p>モデルコースから今治の観光スポットを探せるナビアプリ</p>

        <div className="lang">
          {[
            ["ja", "日本語"],
            ["en", "English"],
            ["zh", "中文"],
            ["ko", "한국어"],
          ].map(([code, label]) => (
            <button
              key={code}
              className={lang === code ? "active" : ""}
              onClick={() => setLang(code)}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <section className="section">
        <h2>コース選択</h2>
        <div className="course-buttons">
          {courses.map((course) => (
            <button
              key={course.id}
              className={selectedCourse?.id === course.id ? "selected" : ""}
              onClick={() => {
                setSelectedCourse(course);
                setActiveSpot(null);
              }}
            >
              {course.name}
            </button>
          ))}
        </div>
      </section>

      {selectedCourse && (
        <>
          <section className="section">
            <h2>地図</h2>

            <div className="map-box">
              <MapContainer
                center={mapCenter}
                zoom={13}
                className="map"
              >
                <MapFocus center={mapCenter} />

                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {courseSpots.map((spot) => (
                  <Marker
                    key={spot.id}
                    position={[spot.lat, spot.lng]}
                    eventHandlers={{
                      click: () => setActiveSpot(spot.id),
                    }}
                  >
                    <Popup>{getText(spot.name)}</Popup>
                  </Marker>
                ))}

                {coords.length > 1 && (
                  <Polyline
                    positions={coords}
                    pathOptions={{
                      color: "#2563eb",
                      weight: 4,
                    }}
                  />
                )}
              </MapContainer>
            </div>
          </section>

          <section className="section">
            <h2>場所の詳細</h2>

            <div className="spots-row">
              {courseSpots.map((spot) => (
                <article
                  key={spot.id}
                  className={`spot-card ${
                    activeSpot === spot.id ? "active" : ""
                  }`}
                  onClick={() => setActiveSpot(spot.id)}
                >
                  <img
                    src={spot.image || "https://via.placeholder.com/300x180"}
                    alt={getText(spot.name)}
                  />

                  <h3>{getText(spot.name)}</h3>

                  <p className="catch">{getText(spot.catch)}</p>
                  <p className="desc">{getText(spot.desc)}</p>

                  <p className="info">📍 {getText(spot.address) || spot.address}</p>
                  <p className="info">⏰ {getText(spot.hours) || spot.hours || "情報なし"}</p>

                  <button
                    className={`favorite ${
                      favorites.includes(spot.id) ? "on" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(spot.id);
                    }}
                  >
                    {favorites.includes(spot.id)
                      ? "★ お気に入り済み"
                      : "☆ お気に入り"}
                  </button>

                  <div className="action-row">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(spot);
                      }}
                    >
                      🔊 音声
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openMap(spot);
                      }}
                    >
                      🚗 ナビ
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="section">
            <h2>⭐ お気に入り</h2>

            {favorites.length === 0 ? (
              <p className="empty">まだ登録されていません</p>
            ) : (
              <div className="favorite-list">
                {favorites.map((id) => {
                  const spot = spots.find((s) => s.id === id);
                  if (!spot) return null;

                  return (
                    <button
                      key={id}
                      onClick={() => setActiveSpot(id)}
                    >
                      {getText(spot.name)}
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default App;