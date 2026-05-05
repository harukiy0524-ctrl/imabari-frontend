import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { spots } from "./data/spots";
import { courses } from "./data/courses";
import "./App.css";

function MapMove({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) map.setView(center, 13);
  }, [center, map]);

  return null;
}

function App() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeSpot, setActiveSpot] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [lang, setLang] = useState("ja");
  const [currentPos, setCurrentPos] = useState(null);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const saved = localStorage.getItem("fav");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("fav", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setCurrentPos([pos.coords.latitude, pos.coords.longitude]);
      },
      () => console.log("位置情報を取得できませんでした")
    );
  }, []);

  const getText = (obj) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[lang] || obj.ja || "";
  };

  const ui = {
    course: { ja: "コース", en: "Courses", zh: "路线", ko: "코스" },
    map: { ja: "地図", en: "Map", zh: "地图", ko: "지도" },
    detail: { ja: "詳細", en: "Details", zh: "详情", ko: "상세" },
    fav: { ja: "お気に入り", en: "Favorites", zh: "收藏", ko: "즐겨찾기" },
    empty: { ja: "まだなし", en: "No favorites", zh: "暂无", ko: "없음" },
    filter: { ja: "カテゴリ", en: "Category", zh: "分类", ko: "카테고리" },
  };

  const categories = [
    { id: "all", label: { ja: "すべて", en: "All", zh: "全部", ko: "전체" } },
    { id: "観光", label: { ja: "観光", en: "Sightseeing", zh: "观光", ko: "관광" } },
    { id: "カフェ", label: { ja: "カフェ", en: "Cafe", zh: "咖啡", ko: "카페" } },
    { id: "グルメ", label: { ja: "グルメ", en: "Food", zh: "美食", ko: "맛집" } },
    { id: "絶景", label: { ja: "絶景", en: "View", zh: "美景", ko: "절경" } },
    { id: "体験", label: { ja: "体験", en: "Experience", zh: "体验", ko: "체험" } },
    { id: "温泉", label: { ja: "温泉", en: "Onsen", zh: "温泉", ko: "온천" } },
  ];

  const courseSpots = selectedCourse
    ? selectedCourse.spots
        .map((id) => spots.find((s) => s.id === id))
        .filter(Boolean)
    : [];

  const filteredSpots = courseSpots.filter((spot) => {
    if (category === "all") return true;

    if (Array.isArray(spot.tags)) {
      return spot.tags.includes(category);
    }

    if (spot.category) {
      return spot.category === category;
    }

    return false;
  });

  const shownSpots = filteredSpots.length > 0 ? filteredSpots : courseSpots;

  const coords = shownSpots
    .filter((s) => s.lat && s.lng)
    .map((s) => [s.lat, s.lng]);

  const activeData =
    spots.find((s) => s.id === activeSpot) || shownSpots[0];

  const center = activeData
    ? [activeData.lat, activeData.lng]
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
      lang === "ja" ? "ja-JP" :
      lang === "zh" ? "zh-CN" :
      lang === "ko" ? "ko-KR" :
      "en-US";
    speechSynthesis.cancel();
    speechSynthesis.speak(msg);
  };

  const calcDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;

    return Number(
      (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2)
    );
  };

  const calcWalkTime = (km) => {
    const walkingSpeed = 4;
    return Math.max(1, Math.round((km / walkingSpeed) * 60));
  };

  return (
    <div className="app">
      <h1>今治観光ナビ</h1>

      <div className="lang">
        {["ja", "en", "zh", "ko"].map((l) => (
          <button
            key={l}
            className={lang === l ? "active" : ""}
            onClick={() => setLang(l)}
          >
            {l === "ja" ? "日本語" : l === "en" ? "EN" : l === "zh" ? "中文" : "한국어"}
          </button>
        ))}
      </div>

      <h2>{ui.course[lang]}</h2>
      <div className="course-buttons">
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => {
              setSelectedCourse(course);
              setActiveSpot(null);
              setCategory("all");
            }}
          >
            {course.name}
          </button>
        ))}
      </div>

      {selectedCourse && (
        <>
          <h2>{ui.filter[lang]}</h2>
          <div className="filter">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={category === cat.id ? "active" : ""}
                onClick={() => setCategory(cat.id)}
              >
                {cat.label[lang]}
              </button>
            ))}
          </div>

          <h2>{ui.map[lang]}</h2>
          <div className="map-box">
            <MapContainer center={center} zoom={13}>
              <MapMove center={center} />

              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {currentPos && <Marker position={currentPos} />}

              {shownSpots.map((spot) => (
                <Marker
                  key={spot.id}
                  position={[spot.lat, spot.lng]}
                  eventHandlers={{ click: () => setActiveSpot(spot.id) }}
                />
              ))}

              {coords.length > 1 && <Polyline positions={coords} />}

              {currentPos && activeData && (
                <Polyline
                  positions={[currentPos, [activeData.lat, activeData.lng]]}
                  pathOptions={{ color: "red", dashArray: "5,10" }}
                />
              )}
            </MapContainer>
          </div>
        </>
      )}

      <h2>⭐ {ui.fav[lang]}</h2>

      {favorites.length === 0 ? (
        <p>{ui.empty[lang]}</p>
      ) : (
        <div className="fav-row">
          {favorites.map((id) => {
            const spot = spots.find((s) => s.id === id);
            if (!spot) return null;

            return (
              <button
                key={id}
                className="fav-item"
                onClick={() => {
                  setActiveSpot(id);
                  setSelectedCourse({ id: "fav", name: "Favorites", spots: [id] });
                  setCategory("all");
                }}
              >
                {getText(spot.name)}
              </button>
            );
          })}
        </div>
      )}

      {selectedCourse && (
        <>
          <h2>{ui.detail[lang]}</h2>

          <div className="spots-row">
            {shownSpots.map((spot) => {
              const distance =
                currentPos && spot.lat && spot.lng
                  ? calcDistance(currentPos[0], currentPos[1], spot.lat, spot.lng)
                  : null;

              return (
                <div
                  key={spot.id}
                  className={`card ${activeSpot === spot.id ? "active" : ""}`}
                  onClick={() => setActiveSpot(spot.id)}
                >
                  <img
                    src={spot.image || "https://via.placeholder.com/300x180?text=No+Image"}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/300x180?text=No+Image";
                    }}
                    alt={getText(spot.name)}
                  />

                  <div className="card-content">
                    <h3>{getText(spot.name)}</h3>
                    <p>{getText(spot.desc)}</p>

                    {distance !== null && (
                      <>
                        <p className="distance">📏 {distance} km</p>
                        <p className="time">🚶 {calcWalkTime(distance)} 分</p>
                      </>
                    )}

                    <div className="btn-row">
                      <button
                        className="btn btn-fav"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(spot.id);
                        }}
                      >
                        {favorites.includes(spot.id) ? "★" : "☆"}
                      </button>

                      <button
                        className="btn btn-speak"
                        onClick={(e) => {
                          e.stopPropagation();
                          speak(spot);
                        }}
                      >
                        🔊
                      </button>

                      <button
                        className="btn btn-map"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(
                            `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`,
                            "_blank"
                          );
                        }}
                      >
                        🚗
                      </button>
                    </div>
                  </div>
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