// OpenRouteService APIキーを入れる
const ORS_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImRmY2FkODU1NDI3OTQ0OGJhYjA4NDVmZDVmNDAyNGFiIiwiaCI6Im11cm11cjY0In0=";

// ルート取得
export const getRoute = async (start, end, mode = "walk") => {

  const profile =
    mode === "bike"
      ? "cycling-regular"
      : "foot-walking";

  try {

    const res = await fetch(
      `https://api.openrouteservice.org/v2/directions/${profile}/geojson`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: ORS_KEY
        },
        body: JSON.stringify({
          coordinates: [
            [start[1], start[0]],
            [end.lng, end.lat]
          ]
        })
      }
    );

    const data = await res.json();

    if (!data.features) return null;

    const coords =
      data.features[0].geometry.coordinates.map(c => [c[1], c[0]]);

    const summary = data.features[0].properties.summary;

    return {
      coords,
      distance: summary.distance,
      duration: summary.duration
    };

  } catch (e) {
    console.error("ルート取得エラー", e);
    return null;
  }
};