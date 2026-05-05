import { useState, useEffect } from "react";
import { spots } from "./data/spots";
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function App() {
  const [lang, setLang] = useState("ja");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [favorites, setFavorites] = useState([]);

  // 多言語対応
  const getText = (obj) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[lang] || obj.ja || "";
  };

  // カテゴリ一覧
  const categories = ["全部", ...new Set(spots.map(s => s.category))];

  // フィルター
  const filteredSpots =
    selectedCategory === "全部"
      ? spots
      : spots.filter(s => s.category === selectedCategory);

  // お気に入り
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="app">

      {/* タイトル */}
      <div className="hero">
        <h1>{getText({
          ja:"今治観光ナビ",
          en:"Imabari Travel Guide",
          zh:"今治旅游导航",
          ko:"이마바리 관광 내비"
        })}</h1>

        <p>{getText({
          ja:"モデルコースから観光スポットを探せる",
          en:"Explore spots from model courses",
          zh:"通过路线探索景点",
          ko:"코스로 관광지 탐색"
        })}</p>

        {/* 言語 */}
        <div className="lang">
          {["ja","en","zh","ko"].map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={lang === l ? "active" : ""}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* カテゴリ */}
      <div className="section">
        <h2>{getText({ja:"コース選択",en:"Category",zh:"分类",ko:"카테고리"})}</h2>
        <div className="course-buttons">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? "selected" : ""}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 地図 */}
      <div className="map-box">
        <MapContainer center={[34.06,133.0]} zoom={11} className="map">
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredSpots.map(spot => (
            <Marker key={spot.id} position={[spot.lat, spot.lng]}>
              <Popup>
                <b>{getText(spot.name)}</b><br/>
                {getText(spot.address)}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* スポット横スクロール */}
      <div className="spots-row">
        {filteredSpots.map(spot => (
          <div key={spot.id} className="spot-card">

            <img src={spot.image} alt="" />

            <h3>{getText(spot.name)}</h3>

            <p className="catch">{getText(spot.catch)}</p>
            <p className="desc">{getText(spot.desc)}</p>

            <p className="info">📍 {getText(spot.address)}</p>
            <p className="info">⏰ {getText(spot.hours)}</p>
            <p className="info">🚫 {getText(spot.holiday)}</p>

            {/* ボタン */}
            <div className="action-row">
              <button onClick={() => toggleFavorite(spot.id)}>
                {favorites.includes(spot.id) ? "★" : "☆"}
              </button>

              <button onClick={() =>
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`
                )
              }>
                🚗
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* お気に入り */}
      <div className="section">
        <h2>⭐ お気に入り</h2>

        <div className="favorite-list">
          {favorites.length === 0 && (
            <p className="empty">
              {getText({
                ja:"まだ登録されていません",
                en:"No favorites yet",
                zh:"还没有收藏",
                ko:"아직 없음"
              })}
            </p>
          )}

          {favorites.map(id => {
            const spot = spots.find(s => s.id === id);
            return (
              <button
                key={id}
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lng}`
                  )
                }
              >
                {getText(spot.name)}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}