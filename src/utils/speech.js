// 音声再生ベース
export const speak = (text) => {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "ja-JP";

  // 前の音声止める
  speechSynthesis.cancel();

  speechSynthesis.speak(msg);
};

// ナビ開始
export const speakStart = (name) => {
  speak(`${name}へのナビを開始します`);
};

// 次の目的地
export const speakNext = (name) => {
  speak(`次は ${name} です`);
};

// 到着
export const speakArrival = (name) => {
  speak(`${name} に到着しました`);
};

// コース終了
export const speakFinish = () => {
  speak(`コースを終了しました`);
};