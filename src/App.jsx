import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { spots } from "./data/spots";
import { courses } from "./data/courses";

function MapMove({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 13);
  }, [center]);
  return null;
}

function App() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeSpot, setActiveSpot] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [lang, setLang] = useState("ja");

  // ⭐ 保存
  useEffect(() => {
    const saved = localStorage.getItem("fav");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("fav", JSON.stringify(favorites));
  }, [favorites]);

  const getText = (obj) => obj?.[lang] || obj?.ja || "";

  // UI多言語
  const ui = {
    course: { ja: "コース選択", en: "Courses", zh: "路线", ko: "코스" },
    map: { ja: "地図", en: "Map", zh: "地图", ko: "지도" },
    fav: { ja: "お気に入り", en: "Favorites", zh: "收藏", ko: "즐겨찾기" },
    empty: {
      ja: "まだ登録されていません",
      en: "No favorites yet",
      zh: "暂无收藏",
      ko: "아직 없음"
    }
  };

  const courseSpots = selectedCourse
    ? selectedCourse.spots
        .map(id => spots.find(s => s.id === id))
        .filter(Boolean)
    : [];

  const coords = courseSpots.map(s => [s.lat, s.lng]);

  const activeData =
    spots.find(s => s.id === activeSpot) || courseSpots[0];

  const center = activeData
    ? [activeData.lat, activeData.lng]
    : [34.06, 133.0];

  const speak = (spot) => {
    const text = `${getText(spot.name)}。${getText(spot.desc)}`;
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = lang === "ja" ? "ja-JP" : "en-US";
    speechSynthesis.speak(msg);
  };

  return (
    <div className="app">
      <h1>今治観光ナビ</h1>

      {/* 言語 */}
      <div className="lang">
        {["ja", "en", "zh", "ko"].map(l => (
          <button key={l} onClick={() => setLang(l)}>
            {l}
          </button>
        ))}
      </div>

      {/* コース */}
      <h2>{ui.course[lang]}</h2>
      <div className="course-buttons">
        {courses.map(c => (
          <button key={c.id} onClick={() => setSelectedCourse(c)}>
            {c.name}
          </button>
        ))}
      </div>

      {/* 地図 */}
      {selectedCourse && (
        <>
          <h2>{ui.map[lang]}</h2>
          <div className="map-box">
            <MapContainer center={center} zoom={13}>
              <MapMove center={center} />
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {courseSpots.map(s => (
                <Marker
                  key={s.id}
                  position={[s.lat, s.lng]}
                  eventHandlers={{
                    click: () => setActiveSpot(s.id)
                  }}
                />
              ))}

              <Polyline positions={coords} />
            </MapContainer>
          </div>
        </>
      )}

      {/* ⭐ お気に入り */}
      <h2>⭐ {ui.fav[lang]}</h2>

      {favorites.length === 0 ? (
        <p>{ui.empty[lang]}</p>
      ) : (
        <div className="fav-row">
          {favorites.map(id => {
            const s = spots.find(x => x.id === id);
            return (
              <button
                key={id}
                onClick={() => {
                  setActiveSpot(id);
                  setSelectedCourse({
                    id: "fav",
                    spots: [id]
                  });
                }}
              >
                {getText(s.name)}
              </button>
            );
          })}
        </div>
      )}

      {/* 詳細 */}
      {selectedCourse && (
        <>
          <h2>DETAIL</h2>

          <div className="spots-row">
            {courseSpots.map(spot => (
              <div
                key={spot.id}
                className={`card ${
                  activeSpot === spot.id ? "active" : ""
                }`}
                onClick={() => setActiveSpot(spot.id)}
              >
                {/* 画像（ない場合対応） */}
                <img
                  src={
                    spot.image ||
                    "https://via.placeholder.com/300x180?text=No+Image"
                  }
                />

                <h3>{getText(spot.name)}</h3>
                <p>{getText(spot.desc)}</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFavorites(prev =>
                      prev.includes(spot.id)
                        ? prev.filter(i => i !== spot.id)
                        : [...prev, spot.id]
                    );
                  }}
                >
                  ⭐
                </button>

                <button onClick={() => speak(spot)}>🔊</button>

                <button
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps?q=${spot.lat},${spot.lng}`
                    )
                  }
                >
                  🚗
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;