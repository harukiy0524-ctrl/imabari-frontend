iimport { useState } from "react";
import { spots } from "./data/spots";
import { courses } from "./data/courses";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from "react-leaflet";

function App() {

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lang, setLang] = useState("ja");

  const getSpotById = (id) => {
    return spots.find(s => s.id === id);
  };

  const routeSpots = selectedCourse
    ? selectedCourse.spots.map(id => getSpotById(id))
    : [];

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

      {/* 言語 */}
      <div>
        {["ja","en","zh","ko"].map(l => (
          <button key={l}
            onClick={()=>setLang(l)}
            style={{
              margin:"5px",
              padding:"8px 12px",
              borderRadius:"20px",
              border:"none",
              background: lang===l ? "#3498db" : "#ddd",
              color: lang===l ? "white":"black"
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* コース */}
      <h2>コース選択</h2>
      {courses.map(course => (
        <button key={course.id}
          onClick={()=>setSelectedCourse(course)}
          style={{
            margin:"5px",
            padding:"10px",
            borderRadius:"20px",
            border:"none",
            background:"#3498db",
            color:"white"
          }}
        >
          {course.name}
        </button>
      ))}

      {/* メイン */}
      {selectedCourse && (
        <div style={{
          display:"flex",
          gap:"20px",
          marginTop:"20px"
        }}>

          {/* 左 */}
          <div style={{ flex:1 }}>

            <h2>{selectedCourse.name}</h2>

            {routeSpots.map((spot,index)=>(
              <div key={spot.id} style={{
                background:"white",
                borderRadius:"12px",
                padding:"15px",
                margin:"15px 0",
                boxShadow:"0 4px 10px rgba(0,0,0,0.1)"
              }}>

                <img src={spot.image}
                  style={{
                    width:"100%",
                    height:"180px",
                    objectFit:"cover",
                    borderRadius:"10px"
                  }}
                />

                <h3>{index+1}. {spot.name[lang]}</h3>
                <p>{spot.catch?.[lang]}</p>
                <p>{spot.desc?.[lang]}</p>

                <p>📍 {spot.address}</p>
                <p>⏰ {spot.hours}</p>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`}
                  target="_blank"
                  style={{
                    display:"inline-block",
                    marginTop:"10px",
                    padding:"8px 12px",
                    background:"#27ae60",
                    color:"white",
                    borderRadius:"8px",
                    textDecoration:"none"
                  }}
                >
                  🚗 ナビ開始
                </a>

              </div>
            ))}

          </div>

          {/* 右 地図 */}
          <div style={{ width:"40%", height:"600px" }}>

            <MapContainer
              center={[34.06,133]}
              zoom={11}
              style={{ height:"100%", width:"100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {routeSpots.map((spot)=>(
                <Marker key={spot.id} position={[spot.lat,spot.lng]}>
                  <Popup>{spot.name[lang]}</Popup>
                </Marker>
              ))}

              <Polyline
                positions={routeSpots.map(s=>[s.lat,s.lng])}
                color="blue"
              />

            </MapContainer>

          </div>

        </div>
      )}

    </div>
  );
}

export default App;