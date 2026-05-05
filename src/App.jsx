import { useEffect, useMemo, useState } from "react";
import { spots } from "./data/spots";
import { courses } from "./data/courses";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";

function App() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lang, setLang] = useState("ja");
  const [user, setUser] = useState(null);

  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((pos) => {
      setUser([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  const getSpotById = (id) => spots.find((s) => s.id === id);

  const routeSpots = useMemo(() => {
    if (!selectedCourse) return [];
    return selectedCourse.spots.map(getSpotById).filter(Boolean);
  }, [selectedCourse]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const speak = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang =
      lang === "ja" ? "ja-JP" :
      lang === "en" ? "en-US" :
      lang === "zh" ? "zh-CN" :
      "ko-KR";
    speechSynthesis.cancel();
    speechSynthesis.speak(msg);
  };

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;

    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
  };

  const center =
    routeSpots.length > 0
      ? [routeSpots[0].lat, routeSpots[0].lng]
      : [34.06, 133.0];

  return (
    <div style={{
      fontFamily: "sans-serif",
      background: "#f5f7fa",
      minHeight: "100vh",
      padding: "20px"
    }}>
      <h1 style={{ fontSize: "32px", color: "#2c3e50" }}>
        今治観光ナビ
      </h1>

      <div>
        {[
          ["ja", "日本語"],
          ["en", "English"],
          ["zh", "中文"],
          ["ko", "한국어"]
        ].map(([code, label]) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            style={{
              margin: "5px",
              padding: "8px 12px",
              borderRadius: "20px",
              border: "none",
              background: lang === code ? "#3498db" : "#ddd",
              color: lang === code ? "white" : "black"
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <h2>コース選択</h2>

      {courses.map((course) => (
        <button
          key={course.id}
          onClick={() => setSelectedCourse(course)}
          style={{
            margin: "5px",
            padding: "10px 15px",
            borderRadius: "20px",
            border: "none",
            background: "#3498db",
            color: "white"
          }}
        >
          {course.name}
        </button>
      ))}

      {selectedCourse && (
        <div style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px"
        }}>
          <div style={{ flex: 1 }}>
            <h2>{selectedCourse.name}</h2>

            {routeSpots.map((spot, index) => (
              <div
                key={spot.id}
                style={{
                  background: "white",
                  borderRadius: "14px",
                  padding: "15px",
                  margin: "15px 0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)"
                }}
              >
                <img
                  src={spot.image}
                  alt={spot.name?.[lang] || spot.name?.ja}
                  style={{
                    width: "100%",
                    height: "190px",
                    objectFit: "cover",
                    borderRadius: "12px"
                  }}
                />

                <h3>
                  {index + 1}. {spot.name?.[lang] || spot.name?.ja}
                </h3>

                <p><strong>{spot.catch?.[lang] || spot.catch?.ja}</strong></p>
                <p>{spot.desc?.[lang] || spot.desc?.ja}</p>

                <p>📍 {spot.address || "住所情報なし"}</p>
                <p>⏰ {spot.hours || "営業時間情報なし"}</p>

                {user && (
                  <p>
                    📏 現在地から {getDistance(user[0], user[1], spot.lat, spot.lng)} km
                  </p>
                )}

                <button
                  onClick={() => toggleFavorite(spot.id)}
                  style={{
                    marginRight: "8px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: favorites.includes(spot.id) ? "#f1c40f" : "#ddd"
                  }}
                >
                  {favorites.includes(spot.id) ? "★ お気に入り" : "☆ お気に入り"}
                </button>

                <button
                  onClick={() => speak(`${spot.name?.[lang] || spot.name?.ja}へ案内します`)}
                  style={{
                    marginRight: "8px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#9b59b6",
                    color: "white"
                  }}
                >
                  🔊 音声
                </button>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    background: "#27ae60",
                    color: "white",
                    borderRadius: "8px",
                    textDecoration: "none"
                  }}
                >
                  🚗 ナビ開始
                </a>
              </div>
            ))}
          </div>

          <div style={{ width: "42%", height: "650px", position: "sticky", top: "20px" }}>
            <MapContainer
              center={center}
              zoom={11}
              style={{ height: "100%", width: "100%", borderRadius: "14px" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {user && (
                <Marker position={user}>
                  <Popup>現在地</Popup>
                </Marker>
              )}

              {routeSpots.map((spot) => (
                <Marker key={spot.id} position={[spot.lat, spot.lng]}>
                  <Popup>{spot.name?.[lang] || spot.name?.ja}</Popup>
                </Marker>
              ))}

              {routeSpots.length > 1 && (
                <Polyline
                  positions={routeSpots.map((s) => [s.lat, s.lng])}
                  color="blue"
                />
              )}
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
export default App;