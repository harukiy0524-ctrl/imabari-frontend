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

// 地図移動
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
  const [currentPos, setCurrentPos] = useState(null);

  // ⭐ 保存
  useEffect(() => {
    const saved = localStorage.getItem("fav");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("fav", JSON.stringify(favorites));
  }, [favorites]);

  // 📍 GPS取得
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentPos([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        console.log("位置取得失敗");
      }
    );
  }, []);

  const getText = (obj) => obj?.[lang] || obj?.ja || "";

  // UI多言語
  const ui = {
    course: { ja: "コース選択", en: "Courses", zh: "路线", ko: "코스" },
    map: { ja: "地図", en: "Map", zh: "地图", ko: "지도" },
    detail: { ja: "場所の詳細", en: "Details", zh: "详情", ko: "상세" },
    fav: { ja: "お気に入り", en: "Favorites", zh: "收藏", ko: "즐겨찾기" },
    empty: {
      ja: "まだ登録されていません",
      en: "No favorites yet",
      zh: "暂无收藏",
      ko: "없음"
    }
  };

  const courseSpots = selectedCourse
    ? selectedCourse.spots
        .map((id) => spots.find((s) => s.id === id))
        .filter(Boolean)
    : [];

  const coords = courseSpots.map((s) => [s.lat, s.lng]);

  const activeData =
    spots.find((s) => s.id === activeSpot) || courseSpots[0];

  const center = activeData
    ? [activeData.lat, activeData.lng]
    : [34.06, 133.0];

  // ⭐ お気に入り切替
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // 🔊 音声
  const speak = (spot) => {
    const text = `${getText(spot.name)}。${getText(spot.desc)}`;
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = lang === "ja" ? "ja-JP" : "en-US";
    speechSynthesis.speak(msg);
  };

  // 📏 距離計算
  const calcDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
  };

  return (
    <div className="app">

      <h1>今治観光ナビ</h1>

      {/* 言語 */}
      <div className="lang">
        {["ja", "en", "zh", "ko"].map((l) => (
          <button key={l} onClick={() => setLang(l)}>
            {l}
          </button>
        ))}
      </div>

      {/* コース */}
      <h2>{ui.course[lang]}</h2>
      <div className="course-buttons">
        {courses.map((c) => (
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

              {/* 現在地 */}
              {currentPos && <Marker position={currentPos} />}

              {/* スポット */}
              {courseSpots.map((s) => (
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
          {favorites.map((id) => {
            const s = spots.find((x) => x.id === id);
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
          <h2>{ui.detail[lang]}</h2>

          <div className="spots-row">
            {courseSpots.map((spot) => (
              <div
                key={spot.id}
                className={`card ${
                  activeSpot === spot.id ? "active" : ""
                }`}
                onClick={() => setActiveSpot(spot.id)}
              >
                {/* 画像 */}
                <img
                  src={
                    spot.image ||
                    "https://via.placeholder.com/300x180?text=No+Image"
                  }
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/300x180?text=No+Image")
                  }
                />

                <h3>{getText(spot.name)}</h3>
                <p>{getText(spot.desc)}</p>

                {/* 距離 */}
                {currentPos && (
                  <p>
                    📏{" "}
                    {calcDistance(
                      currentPos[0],
                      currentPos[1],
                      spot.lat,
                      spot.lng
                    )}{" "}
                    km
                  </p>
                )}

                {/* ボタン */}
                <button onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(spot.id);
                }}>
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