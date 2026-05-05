// =============================
// 多言語 音声ナビ
// =============================

const LANG_CODE = {
  ja: "ja-JP",
  en: "en-US",
  zh: "zh-CN",
  ko: "ko-KR"
};

export const speak = (text, lang = "ja") => {
  if (!window.speechSynthesis) return;

  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = LANG_CODE[lang] || "ja-JP";
  msg.rate = 1;
  msg.pitch = 1;
  msg.volume = 1;

  speechSynthesis.cancel();
  speechSynthesis.speak(msg);
};

// ナビ開始
export const speakStart = (spotName, lang = "ja") => {
  const text = {
    ja: `${spotName}へのナビを開始します`,
    en: `Starting navigation to ${spotName}`,
    zh: `开始前往${spotName}的导航`,
    ko: `${spotName}까지 안내를 시작합니다`
  };

  speak(text[lang], lang);
};

// 曲がる案内
export const speakTurn = (distance, turn, lang = "ja") => {
  const dir = {
    ja: {
      right: "右に曲がります",
      left: "左に曲がります",
      straight: "まっすぐ進みます"
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
      right: "오른쪽으로 가세요",
      left: "왼쪽으로 가세요",
      straight: "직진하세요"
    }
  };

  const text = {
    ja: `${Math.round(distance)}メートル先、${dir.ja[turn]}`,
    en: `In ${Math.round(distance)} meters, ${dir.en[turn]}`,
    zh: `前方${Math.round(distance)}米，${dir.zh[turn]}`,
    ko: `${Math.round(distance)}미터 앞에서 ${dir.ko[turn]}`
  };

  speak(text[lang], lang);
};

// 到着
export const speakArrival = (spotName, lang = "ja") => {
  const text = {
    ja: `${spotName}に到着しました`,
    en: `You have arrived at ${spotName}`,
    zh: `已到达${spotName}`,
    ko: `${spotName}에 도착했습니다`
  };

  speak(text[lang], lang);
};

// 次のスポット
export const speakNextSpot = (spotName, lang = "ja") => {
  const text = {
    ja: `次は${spotName}です`,
    en: `Next is ${spotName}`,
    zh: `下一站是${spotName}`,
    ko: `다음 장소는 ${spotName}입니다`
  };

  speak(text[lang], lang);
};

// コース終了
export const speakFinish = (lang = "ja") => {
  const text = {
    ja: "コースを終了しました",
    en: "The course has finished",
    zh: "路线已结束",
    ko: "코스가 종료되었습니다"
  };

  speak(text[lang], lang);
};