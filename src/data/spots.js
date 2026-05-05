export const spots_part1 = [

{
id:"kirosan",
name:{
  ja:"亀老山展望公園",
  en:"Kirosan Observatory",
  zh:"龟老山展望公园",
  ko:"키로산 전망공원"
},
catch:{
  ja:"瀬戸内海の絶景",
  en:"Amazing sea view",
  zh:"濑户内海绝景",
  ko:"세토내해 절경"
},
desc:{
  ja:"しまなみ海道を一望できる人気展望スポット。",
  en:"A famous viewpoint overlooking Shimanami Kaido.",
  zh:"可以俯瞰岛波海道的景点。",
  ko:"시마나미 카이도를 볼 수 있는 명소."
},
image:"https://upload.wikimedia.org/wikipedia/commons/0/0c/Kirosan_View.jpg",
address:"今治市吉海町南浦487-4",
hours:"年中無休",
lat:34.1200791,lng:133.0334399
},

{
id:"paysan",
name:{
  ja:"Paysan",
  en:"Bakery Paysan",
  zh:"面包店",
  ko:"빵집"
},
catch:{
  ja:"人気パン屋",
  en:"Popular bakery",
  zh:"人气面包店",
  ko:"인기 빵집"
},
desc:{
  ja:"地元で人気のパン屋。",
  en:"A popular local bakery.",
  zh:"当地受欢迎的面包店。",
  ko:"지역 인기 빵집."
},
image:"https://images.unsplash.com/photo-1509440159596-0249088772ff",
address:"今治市吉海町本庄477",
hours:"11:00～17:00",
lat:34.15,lng:133.03
},

{
id:"cafe_shozan",
name:{
  ja:"Café Shozan",
  en:"Cafe Shozan",
  zh:"咖啡店",
  ko:"카페"
},
catch:{
  ja:"おしゃれカフェ",
  en:"Stylish cafe",
  zh:"时尚咖啡店",
  ko:"감성 카페"
},
desc:{
  ja:"落ち着いた雰囲気のカフェ。",
  en:"Relaxing cafe.",
  zh:"氛围安静的咖啡店。",
  ko:"편안한 분위기 카페."
},
image:"https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb",
address:"今治市吉海町福田119",
hours:"10:00～16:00",
lat:34.157833,lng:133.040907
},

{
id:"imabari_castle",
name:{
  ja:"今治城",
  en:"Imabari Castle",
  zh:"今治城",
  ko:"이마바리 성"
},
catch:{
  ja:"海の城",
  en:"Sea castle",
  zh:"海城",
  ko:"바다 성"
},
desc:{
  ja:"海水の堀を持つ珍しい城。",
  en:"A rare castle with seawater moat.",
  zh:"拥有海水护城河的城堡。",
  ko:"해수 해자를 가진 성."
},
image:"https://upload.wikimedia.org/wikipedia/commons/6/6e/Imabari_Castle.jpg",
address:"今治市通町3-1-3",
hours:"9:00～17:00",
lat:34.063422,lng:133.006778
}

];

export const spots_part2 = [

{
id:"sunrise_itoyama",
name:{
  ja:"サンライズ糸山",
  en:"Sunrise Itoyama",
  zh:"糸山",
  ko:"선라이즈 이토야마"
},
catch:{
  ja:"サイクリング出発地",
  en:"Cycling start",
  zh:"骑行起点",
  ko:"자전거 시작점"
},
desc:{
  ja:"しまなみ海道の入口。",
  en:"Start of Shimanami Kaido.",
  zh:"岛波海道入口。",
  ko:"시마나미 시작점."
},
image:"https://upload.wikimedia.org/wikipedia/commons/3/3f/Kurushima_Kaikyo_Bridge.jpg",
address:"今治市砂場町2-8-1",
lat:34.110228,lng:132.977451
},

{
id:"kurushima_view",
name:{
  ja:"来島海峡展望館",
  en:"Kurushima View",
  zh:"来岛海峡展望馆",
  ko:"전망대"
},
catch:{
  ja:"橋の絶景",
  en:"Bridge view",
  zh:"桥景",
  ko:"다리 절경"
},
desc:{
  ja:"来島海峡大橋を一望できる。",
  en:"View of Kurushima Bridge.",
  zh:"可以看到大桥。",
  ko:"대교 전망."
},
image:"https://upload.wikimedia.org/wikipedia/commons/3/3f/Kurushima_Kaikyo_Bridge.jpg",
address:"今治市小浦町2丁目5-2",
lat:34.15,lng:132.98
},

{
id:"limone",
name:{
  ja:"リモーネ",
  en:"Limone",
  zh:"柠檬店",
  ko:"리모네"
},
catch:{
  ja:"レモンスイーツ",
  en:"Lemon sweets",
  zh:"柠檬甜点",
  ko:"레몬 디저트"
},
desc:{
  ja:"柑橘スイーツの人気店。",
  en:"Popular citrus sweets.",
  zh:"柑橘甜品店。",
  ko:"감귤 디저트."
},
image:"https://images.unsplash.com/photo-1497534446932-c925b458314e",
address:"今治市上浦町瀬戸2342",
lat:34.226227,lng:133.050288
},

{
id:"oomishima_shrine",
name:{
  ja:"大山祇神社",
  en:"Oyamazumi Shrine",
  zh:"大山祇神社",
  ko:"신사"
},
catch:{
  ja:"歴史神社",
  en:"Historic shrine",
  zh:"历史神社",
  ko:"역사 신사"
},
desc:{
  ja:"武将ゆかりの神社。",
  en:"Shrine of samurai history.",
  zh:"与武士有关。",
  ko:"무장 관련 신사."
},
image:"https://upload.wikimedia.org/wikipedia/commons/5/5f/Oyamazumi_Shrine.jpg",
address:"今治市大三島町宮浦3327",
lat:34.247927,lng:133.005731
}

];

export const spots = [
  ...spots_part1,
  ...spots_part2,
  ...spots_part3
];