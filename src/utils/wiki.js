// Wikipediaから画像取得
export const getWikiImage = async (name) => {

  try {

    const res = await fetch(
      `https://ja.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`
    );

    const data = await res.json();

    // サムネイル画像があれば返す
    if (data.thumbnail && data.thumbnail.source) {
      return data.thumbnail.source;
    }

    return null;

  } catch (e) {
    console.error("Wikipedia取得エラー", e);
    return null;
  }
};