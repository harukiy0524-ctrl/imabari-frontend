import { useEffect, useState, useMemo } from "react";
import {
  MapContainer, TileLayer, Marker, Popup, Polyline, Circle
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { ALL_SPOTS } from "./data/spots";
import { COURSES } from "./data/courses";

import { calcDistance, formatDistance } from "./utils/distance";
import { getRoute } from "./utils/route";
import { getWikiImage } from "./utils/wiki";
import {
  speakStart, speakNext, speakArrival, speakFinish
} from "./utils/speech";

import { auth, provider, db } from "./firebase";
import {
  signInWithPopup, signOut, onAuthStateChanged
} from "firebase/auth";
import {
  collection, addDoc, getDocs
} from "firebase/firestore";

// ピン
const icon = new L.Icon({
  iconUrl:"https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize:[25,41],
  iconAnchor:[12,41]
});

export default function App(){

// =================
// STATE
// =================
const [user,setUser]=useState(null);
const [userAuth,setUserAuth]=useState(null);

const [search,setSearch]=useState("");

const [route,setRoute]=useState([]);
const [routeInfo,setRouteInfo]=useState(null);

const [favorites,setFavorites]=useState(()=>JSON.parse(localStorage.getItem("favorites"))||[]);
const [visited,setVisited]=useState(()=>JSON.parse(localStorage.getItem("visited"))||[]);

const [reviews,setReviews]=useState({});
const [images,setImages]=useState({});

// コース
const [course,setCourse]=useState(null);
const [step,setStep]=useState(0);

// =================
// LOGIN
// =================
useEffect(()=>{
onAuthStateChanged(auth,(u)=>setUserAuth(u));
},[]);

const login=()=>signInWithPopup(auth,provider);
const logout=()=>signOut(auth);

// =================
// GPS
// =================
useEffect(()=>{
const id=navigator.geolocation.watchPosition(p=>{
setUser([p.coords.latitude,p.coords.longitude]);
});
return()=>navigator.geolocation.clearWatch(id);
},[]);

// =================
// STORAGE
// =================
useEffect(()=>localStorage.setItem("favorites",JSON.stringify(favorites)),[favorites]);
useEffect(()=>localStorage.setItem("visited",JSON.stringify(visited)),[visited]);

// =================
// FILTER
// =================
const spots=useMemo(()=>{
return ALL_SPOTS.filter(s=>s.name.ja.includes(search));
},[search]);

// =================
// WIKI IMAGE
// =================
useEffect(()=>{
spots.forEach(async s=>{
if(images[s.name.ja]) return;

const img = await getWikiImage(s.name.ja+" 愛媛");

setImages(prev=>({...prev,[s.name.ja]:img}));
});
},[spots]);

// =================
// ROUTE
// =================
const startNav=async(spot)=>{

if(!user) return;

speakStart(spot.name.ja);

const r=await getRoute(user,spot);

if(!r) return;

setRoute(r.coords);

setRouteInfo({
km:(r.distance/1000).toFixed(2),
min:Math.round(r.duration/60)
});
};

// =================
// COURSE
// =================
const currentSpot=useMemo(()=>{
if(!course) return null;
return ALL_SPOTS.find(s=>s.name.ja===course.spots[step]);
},[course,step]);

useEffect(()=>{
if(currentSpot) startNav(currentSpot);
},[step]);

const nextStep=()=>{
if(step < course.spots.length-1){
const n=step+1;
setStep(n);
speakNext(course.spots[n]);
}else{
speakFinish();
}
};

// =================
// ARRIVAL
// =================
useEffect(()=>{
if(!user||!currentSpot) return;

const d=calcDistance(
user[0],user[1],
currentSpot.lat,currentSpot.lng
);

if(d<0.05){
speakArrival(currentSpot.name.ja);
}

},[user,currentSpot]);

// =================
// REVIEWS
// =================
useEffect(()=>{
const load=async()=>{
const snap=await getDocs(collection(db,"reviews"));

let data={};

snap.forEach(doc=>{
const d=doc.data();
if(!data[d.spot]) data[d.spot]=[];
data[d.spot].push(d.text);
});

setReviews(data);
};
load();
},[]);

const sendReview=async(name,text)=>{
await addDoc(collection(db,"reviews"),{
spot:name,
text
});
};

// =================
// UI
// =================
return(
<div>

<h1>今治観光ナビ 完全版</h1>

{/* LOGIN */}
{userAuth ? (
<div>
<img src={userAuth.photoURL} width="40"/>
<p>{userAuth.displayName}</p>
<button onClick={logout}>ログアウト</button>
</div>
) : (
<button onClick={login}>ログイン</button>
)}

<input
placeholder="検索"
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

{/* COURSE */}
<div>
{COURSES.map((c,i)=>(
<button key={i} onClick={()=>{setCourse(c);setStep(0);}}>
{c.name.ja}
</button>
))}
</div>

{/* NAV UI */}
{currentSpot && user && (
<div>
🧭 {currentSpot.name.ja}
<br/>
📏 {formatDistance(
calcDistance(user[0],user[1],currentSpot.lat,currentSpot.lng)
)}
<br/>
<button onClick={nextStep}>次へ</button>
</div>
)}

<MapContainer
center={user||[34.06,133]}
zoom={12}
style={{height:"70vh"}}
>

<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

{user && <Marker position={user} icon={icon}/>}

{spots.map((s,i)=>(
<Marker key={i} position={[s.lat,s.lng]} icon={icon}>
<Popup>

<img src={images[s.name.ja]||s.image} width="200"/>

<h3>{s.name.ja}</h3>

<button onClick={()=>startNav(s)}>ナビ</button>

<button onClick={()=>setFavorites([...favorites,s.name.ja])}>⭐</button>
<button onClick={()=>setVisited([...visited,s.name.ja])}>✅</button>

<input id={"r"+i}/>
<button onClick={()=>{
sendReview(s.name.ja,
document.getElementById("r"+i).value
);
}}>
投稿
</button>

{(reviews[s.name.ja]||[]).map((r,j)=>(
<div key={j}>⭐ {r}</div>
))}

</Popup>
</Marker>
))}

{route.length>0 && <Polyline positions={route} color="blue"/>}

</MapContainer>

{routeInfo && (
<div>
📏 {routeInfo.km}km ⏱ {routeInfo.min}分
</div>
)}

<div>⭐ {favorites.join(",")}</div>
<div>🏅 {visited.length}</div>

</div>
);
}