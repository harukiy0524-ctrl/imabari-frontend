import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { spots } from "./data/spots";
import { courses } from "./data/courses";

function App() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [lang, setLang] = useState("ja");

  // ⭐ 保存
  useEffect(()=>{
    const saved = localStorage.getItem("fav");
    if(saved) setFavorites(JSON.parse(saved));
  },[]);

  useEffect(()=>{
    localStorage.setItem("fav", JSON.stringify(favorites));
  },[favorites]);

  // 座標
  const coords = selectedCourse
    ? selectedCourse.spots
        .map(id=>{
          const s = spots.find(sp=>sp.id === id);
          if(!s) return null;
          return [s.lat, s.lng];
        })
        .filter(Boolean)
    : [];

  // 🔊 音声
  const speak = (text) => {
    const uttr = new SpeechSynthesisUtterance(text);
    uttr.lang = lang === "ja" ? "ja-JP" : "en-US";
    speechSynthesis.speak(uttr);
  };

  return (
    <div className="container">

      <h1>今治観光ナビ</h1>

      {/* 言語 */}
      <div>
        <button onClick={()=>setLang("ja")}>日本語</button>
        <button onClick={()=>setLang("en")}>EN</button>
        <button onClick={()=>setLang("zh")}>中文</button>
        <button onClick={()=>setLang("ko")}>한국어</button>
      </div>

      {/* コース */}
      <div className="course-buttons">
        {courses.map(c=>(
          <button key={c.id} onClick={()=>setSelectedCourse(c)}>
            {c.name}
          </button>
        ))}
      </div>

      {/* 地図 */}
      {selectedCourse && (
        <MapContainer
          center={coords[0] || [34.06,133.0]}
          zoom={12}
          style={{height:"250px", marginTop:"20px"}}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {coords.map((pos,i)=>(
            <Marker key={i} position={pos} />
          ))}

          <Polyline positions={coords} />
        </MapContainer>
      )}

      {/* お気に入り */}
      <h2>⭐ お気に入り</h2>
      {favorites.map(id=>{
        const spot = spots.find(s=>s.id === id);
        if(!spot) return null;

        return <p key={id}>{spot.name?.[lang]}</p>;
      })}

      {/* スポット */}
      {selectedCourse && (
        <div className="spots">
          {selectedCourse.spots.map(id=>{
            const spot = spots.find(s=>s.id === id);
            if(!spot) return null;

            return (
              <div key={id} className="card">

                {/* 横スクロール画像 */}
                <div className="image-row">
                  <img src={spot.image} />
                </div>

                <h3>{spot.name?.[lang]}</h3>
                <p>{spot.desc?.[lang]}</p>

                {/* ボタン */}
                <div style={{marginTop:"10px"}}>
                  
                  <button onClick={()=>{
                    setFavorites(prev =>
                      prev.includes(id)
                        ? prev.filter(i=>i!==id)
                        : [...prev,id]
                    );
                  }}>
                    ⭐
                  </button>

                  <button onClick={()=>speak(spot.desc?.[lang])}>
                    🔊
                  </button>

                  <button onClick={()=>{
                    window.open(`https://www.google.com/maps?q=${spot.lat},${spot.lng}`);
                  }}>
                    🚗
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default App;
export default App;