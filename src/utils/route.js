// =============================
// 距離計算（メートル）
// =============================
export const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371e3;
  const toRad = x => x * Math.PI / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// =============================
// 方角（角度）計算
// =============================
export const getBearing = (lat1, lng1, lat2, lng2) => {
  const toRad = x => x * Math.PI / 180;
  const toDeg = x => x * 180 / Math.PI;

  const y = Math.sin(toRad(lng2 - lng1)) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.cos(toRad(lng2 - lng1));

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
};

// =============================
// 左右判定
// =============================
export const getTurnDirection = (prev, current, next) => {
  const b1 = getBearing(prev.lat, prev.lng, current.lat, current.lng);
  const b2 = getBearing(current.lat, current.lng, next.lat, next.lng);

  let diff = b2 - b1;

  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  if (diff > 30) return "right";
  if (diff < -30) return "left";
  return "straight";
};

// =============================
// 曲がるポイント抽出
// =============================
export const extractTurns = (route) => {
  const turns = [];

  for (let i = 1; i < route.length - 1; i++) {
    const prev = route[i - 1];
    const current = route[i];
    const next = route[i + 1];

    const turn = getTurnDirection(prev, current, next);

    if (turn !== "straight") {
      turns.push({
        ...current,
        type: turn
      });
    }
  }

  return turns;
};

// =============================
// ナビテキスト（多言語対応）
// =============================
export const getNavText = (distance, turn, lang = "ja") => {

  const texts = {
    ja: {
      right: "右に曲がる",
      left: "左に曲がる",
      straight: "まっすぐ進む"
    },
    en: {
      right: "turn right",
      left: "turn left",
      straight: "go straight"
    },
    zh: {
      right: "右转",
      left: "左转",
      straight: "直行"
    },
    ko: {
      right: "오른쪽으로",
      left: "왼쪽으로",
      straight: "직진"
    }
  };

  const dir = texts[lang][turn];

  if (distance > 300) return `⬆ ${texts[lang].straight}`;
  if (distance > 200) return `➡ 200m ${dir}`;
  if (distance > 50) return `➡ 50m ${dir}`;
  return `➡ ${dir}`;
};