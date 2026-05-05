import { useState } from "react";
import { spots } from "./data/spots";
import { courses } from "./data/courses";

function App() {

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lang, setLang] = useState("ja");

  // ID → スポット取得
  const getSpotById = (id) => {
    return spots.find(s => s.id === id);
  };

  // コースのスポット一覧
  const routeSpots = selectedCourse
    ? selectedCourse.spots.map(id => getSpotById(id))
    : [];

  return (
    <div style={{ padding: "20px" }}>

      <h1>今治観光ナビ</h1>

      {/* ===== 言語切替 ===== */}
      <div>
        <button onClick={() => setLang("ja")}>日本語</button>
        <button onClick={() => setLang("en")}>EN</button>
        <button onClick={() => setLang("zh")}>中文</button>
        <button onClick={() => setLang("ko")}>한국어</button>
      </div>

      <hr />

      {/* ===== コース選択 ===== */}
      <h2>コース選択</h2>
      {courses.map(course => (
        <button
          key={course.id}
          onClick={() => setSelectedCourse(course)}
          style={{ margin: "5px" }}
        >
          {course.name}
        </button>
      ))}

      <hr />

      {/* ===== スポット表示 ===== */}
      {selectedCourse && (
        <div>
          <h2>{selectedCourse.name}</h2>

          {routeSpots.map((spot, index) => (
            <div key={spot.id} style={{
              border: "1px solid #ccc",
              margin: "10px 0",
              padding: "10px"
            }}>
              <h3>{index + 1}. {spot.name[lang]}</h3>
              <p>{spot.catch?.[lang]}</p>
              <p>{spot.desc?.[lang]}</p>
              <p>📍 {spot.address}</p>
              <p>⏰ {spot.hours}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default App;