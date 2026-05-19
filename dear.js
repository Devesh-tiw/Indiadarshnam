console.log("BharatDarshnam loaded");

// Import Firebase tools
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// REPLACE THIS WITH YOUR ACTUAL KEYS FROM STEP 1
const firebaseConfig = {
  apiKey: "AIzaSyD_yk5-Zxft65M9m50xMFD9gVSEJjBIJJY",
  authDomain: "bharatdasrshnam.firebaseapp.com",
  projectId: "bharatdasrshnam",
  storageBucket: "bharatdasrshnam.firebasestorage.app",
  messagingSenderId: "51488619362",
  appId: "1:51488619362:web:b73bdd05cb3dd1a649ca3b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log("Firebase Connected! 🔥");

// Listen for Login/Logout state
onAuthStateChanged(auth, (user) => {
  const loginBtn = document.getElementById("loginBtn");
  if (user) {
    loginBtn.innerText = ` Logged in as ${user.email.split('@')[0]} (Click to Logout)`;
    loginBtn.style.background = "#58e81a"; // Change to orange when logged in
  } else {
    loginBtn.innerText = "👤 Sign In / Sign Up";
    loginBtn.style.background = "#6a2d2d";
  }
});
/* ══════════════════════════════════════════════════════
   REAL TEMPLE / HERITAGE SITE DATA
   Sources: Wikipedia, ASI, UNESCO — founding years verified
   ══════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════
   EXPANDED TEMPLE / HERITAGE SITE DATA (20 SITES)
   ══════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════
   RAW TEMPLE DATA (350 SITES FROM CODEX)
   ══════════════════════════════════════════════════════ */
const RAW_SITES = [
  {id:1, era:-300, title:"Nataraja Temple, Chidambaram", state:"Tamil Nadu", lat:11.3996, lng:79.6937, desc:"Nataraja Temple, Chidambaram — Tamil Nadu. Site Antiquity: 300 BCE (Sangam Era). Current structure: 10th Century Chola."},
  {id:2, era:700, title:"Shore Temple, Mahabalipuram", state:"Tamil Nadu", lat:12.6165, lng:80.1992, desc:"Shore Temple, Mahabalipuram — Tamil Nadu. Est. 700 CE by Pallavas."},
  {id:3, era:700, title:"Kailasanathar Temple, Kanchipuram", state:"Tamil Nadu", lat:12.8428, lng:79.6952, desc:"Kailasanathar Temple, Kanchipuram — Tamil Nadu. Est. 700 CE. Ancient Pallava capital."},
  {id:4, era:600, title:"Ekambareswarar Temple, Kanchipuram", state:"Tamil Nadu", lat:12.8476, lng:79.7003, desc:"Ekambareswarar Temple, Kanchipuram — Tamil Nadu. Site Antiquity: ~600 CE."},
  {id:5, era:-200, title:"Kamakshi Amman, Kanchipuram", state:"Tamil Nadu", lat:12.8401, lng:79.7027, desc:"Kamakshi Amman, Kanchipuram — Tamil Nadu. Site Antiquity: ~200 BCE. One of the oldest Shakti Peethas."},
  {id:6, era:1010, title:"Brihadeeswarar Temple, Thanjavur", state:"Tamil Nadu", lat:10.7828, lng:79.1318, desc:"Brihadeeswarar Temple, Thanjavur — Tamil Nadu. Est. 1010 CE by Raja Raja Chola."},
  {id:7, era:1035, title:"Gangaikonda Cholapuram", state:"Tamil Nadu", lat:11.2085, lng:79.4497, desc:"Gangaikonda Cholapuram — Tamil Nadu. Est. 1035 CE."},
  {id:8, era:1146, title:"Airavatesvara Temple, Darasuram", state:"Tamil Nadu", lat:10.9514, lng:79.3561, desc:"Airavatesvara Temple, Darasuram — Tamil Nadu. Est. 1146 CE."},
  {id:9, era:-1500, title:"Ramanathaswamy Temple, Rameswaram", state:"Tamil Nadu", lat:9.2881, lng:79.3174, desc:"Ramanathaswamy Temple, Rameswaram — Tamil Nadu. Site Antiquity: Epic Era (Ramayana). Current structure: 12th Century."},
  {id:10, era:600, title:"Kapaleeswarar Temple, Chennai", state:"Tamil Nadu", lat:13.0334, lng:80.2697, desc:"Kapaleeswarar Temple, Chennai — Tamil Nadu. Site Antiquity: 6th Century CE (Tevaram references)."},
  {id:11, era:800, title:"Parthasarathy Temple, Chennai", state:"Tamil Nadu", lat:13.0567, lng:80.2802, desc:"Parthasarathy Temple, Chennai — Tamil Nadu. Est. 800 CE by Pallavas."},
  {id:12, era:600, title:"Annamalaiyar Temple, Thiruvannamalai", state:"Tamil Nadu", lat:12.2319, lng:79.0676, desc:"Annamalaiyar Temple, Thiruvannamalai — Tamil Nadu. Site Antiquity: 6th Century CE."},
  {id:13, era:100, title:"Jambukeswara Temple, Thiruvanaikaval", state:"Tamil Nadu", lat:10.8534, lng:78.7055, desc:"Jambukeswara Temple, Thiruvanaikaval — Tamil Nadu. Est. ~100 CE by Early Cholas."},
  {id:14, era:100, title:"Ranganathaswamy Temple, Srirangam", state:"Tamil Nadu", lat:10.8653, lng:78.693, desc:"Ranganathaswamy Temple, Srirangam — Tamil Nadu. Site Antiquity: 1st Century CE (Silappadikaram references)."},
  {id:15, era:-300, title:"Meenakshi Amman Temple, Madurai", state:"Tamil Nadu", lat:9.9195, lng:78.1193, desc:"Meenakshi Amman Temple, Madurai — Tamil Nadu. Site Antiquity: 300 BCE (Sangam Capital). Current structure: 1623 CE."},
  {id:16, era:-200, title:"Murugan Temple, Palani", state:"Tamil Nadu", lat:10.4534, lng:77.5243, desc:"Murugan Temple, Palani — Tamil Nadu. Site Antiquity: ~200 BCE (Sangam Era)."},
  {id:17, era:-1000, title:"Murugan Temple, Tiruchendur", state:"Tamil Nadu", lat:8.4902, lng:78.1198, desc:"Murugan Temple, Tiruchendur — Tamil Nadu. Site Antiquity: Pre-historic/Epic Era (Skanda Purana)."},
  {id:18, era:-200, title:"Murugan Temple, Swamimalai", state:"Tamil Nadu", lat:10.968, lng:79.3573, desc:"Murugan Temple, Swamimalai — Tamil Nadu. Site Antiquity: ~200 BCE."},
  {id:19, era:200, title:"Murugan Temple, Sirkazhi", state:"Tamil Nadu", lat:11.2356, lng:79.742, desc:"Murugan Temple, Sirkazhi — Tamil Nadu. Site Antiquity: ~200 CE."},
  {id:20, era:-200, title:"Murugan Temple, Thiruthani", state:"Tamil Nadu", lat:13.186, lng:79.6148, desc:"Murugan Temple, Thiruthani — Tamil Nadu. Site Antiquity: ~200 BCE."},
  {id:21, era:-300, title:"Thillai Nataraja Temple (alt)", state:"Tamil Nadu", lat:11.399, lng:79.694, desc:"Thillai Nataraja Temple (alt) — Tamil Nadu. Site Antiquity: 300 BCE."},
  {id:22, era:600, title:"Vaitheeswaran Koil", state:"Tamil Nadu", lat:11.27, lng:79.6368, desc:"Vaitheeswaran Koil — Tamil Nadu. Site Antiquity: 600 CE (Tevaram)."},
  {id:23, era:200, title:"Nageswara Swamy, Kumbakonam", state:"Tamil Nadu", lat:10.9609, lng:79.3736, desc:"Nageswara Swamy, Kumbakonam — Tamil Nadu. Site Antiquity: ~200 CE."},
  {id:24, era:200, title:"Sarangapani Temple, Kumbakonam", state:"Tamil Nadu", lat:10.9598, lng:79.3771, desc:"Sarangapani Temple, Kumbakonam — Tamil Nadu. Site Antiquity: ~200 CE."},
  {id:25, era:200, title:"Adi Kumbeswarar, Kumbakonam", state:"Tamil Nadu", lat:10.9617, lng:79.3764, desc:"Adi Kumbeswarar, Kumbakonam — Tamil Nadu. Site Antiquity: ~200 CE."},
  {id:26, era:600, title:"Mukteswarar Temple, Sirkazhi", state:"Tamil Nadu", lat:11.235, lng:79.7408, desc:"Mukteswarar Temple, Sirkazhi — Tamil Nadu. Site Antiquity: ~600 CE."},
  {id:27, era:600, title:"Thiruvarur Thyagaraja Temple", state:"Tamil Nadu", lat:10.7736, lng:79.6344, desc:"Thiruvarur Thyagaraja Temple — Tamil Nadu. Site Antiquity: ~600 CE."},
  {id:28, era:600, title:"Chidambareswarar, Thiruvottiyur", state:"Tamil Nadu", lat:13.1591, lng:80.3038, desc:"Chidambareswarar, Thiruvottiyur — Tamil Nadu. Site Antiquity: ~600 CE."},
  {id:29, era:800, title:"Veeraraghavaswamy, Tiruvallur", state:"Tamil Nadu", lat:13.1429, lng:79.9074, desc:"Veeraraghavaswamy, Tiruvallur — Tamil Nadu. Est. 800 CE."},
  {id:30, era:600, title:"Vedagiriswarar Temple, Thirukazhukundram", state:"Tamil Nadu", lat:12.6079, lng:80.0518, desc:"Vedagiriswarar Temple, Thirukazhukundram — Tamil Nadu. Site Antiquity: ~600 CE."},
  {id:31, era:800, title:"Sri Parthasarathy, Triplicane", state:"Tamil Nadu", lat:13.0579, lng:80.2814, desc:"Sri Parthasarathy, Triplicane — Tamil Nadu. Est. 800 CE."},
  {id:32, era:-300, title:"Thillaivilagam Nataraja, alt", state:"Tamil Nadu", lat:11.3998, lng:79.6936, desc:"Thillaivilagam Nataraja, alt — Tamil Nadu. Site Antiquity: 300 BCE."},
  {id:33, era:600, title:"Padaleswarar, Thiruvottiyur", state:"Tamil Nadu", lat:13.1593, lng:80.3042, desc:"Padaleswarar, Thiruvottiyur — Tamil Nadu. Site Antiquity: ~600 CE."},
  {id:34, era:600, title:"Arunachaleswarar (Annamalai)", state:"Tamil Nadu", lat:12.2319, lng:79.0679, desc:"Arunachaleswarar (Annamalai) — Tamil Nadu. Site Antiquity: ~600 CE."},
  {id:35, era:600, title:"Sri Mukteswarar, Sirkazhi", state:"Tamil Nadu", lat:11.2348, lng:79.7406, desc:"Sri Mukteswarar, Sirkazhi — Tamil Nadu. Site Antiquity: ~600 CE."},
  {id:36, era:400, title:"Thanumalayan Temple, Suchindram", state:"Tamil Nadu", lat:8.1561, lng:77.4658, desc:"Thanumalayan Temple, Suchindram — Tamil Nadu. Est. 400 CE."},
  {id:37, era:600, title:"Nagercoil Neyyar Bhutha Temple", state:"Tamil Nadu", lat:8.1793, lng:77.4318, desc:"Nagercoil Neyyar Bhutha Temple — Tamil Nadu. Est. 600 CE."},
  {id:38, era:636, title:"Virupaksha Temple, Hampi", state:"Karnataka", lat:15.335, lng:76.46, desc:"Virupaksha Temple, Hampi — Karnataka. Ancient site, present core Est. 636 CE."},
  {id:39, era:1117, title:"Chennakeshava Temple, Belur", state:"Karnataka", lat:13.1651, lng:75.8636, desc:"Chennakeshava Temple, Belur — Karnataka. Est. 1117 CE by Hoysalas."},
  {id:40, era:1121, title:"Hoysaleswara Temple, Halebid", state:"Karnataka", lat:13.215, lng:75.9978, desc:"Hoysaleswara Temple, Halebid — Karnataka. Est. 1121 CE."},
  {id:41, era:1268, title:"Keshava Temple, Somnathpura", state:"Karnataka", lat:12.283, lng:76.8872, desc:"Keshava Temple, Somnathpura — Karnataka. Est. 1268 CE."},
  {id:42, era:578, title:"Badami Cave Temples", state:"Karnataka", lat:15.9195, lng:75.6784, desc:"Badami Cave Temples — Karnataka. Est. 578 CE by Chalukyas."},
  {id:43, era:700, title:"Durga Temple, Aihole", state:"Karnataka", lat:16.021, lng:75.8835, desc:"Durga Temple, Aihole — Karnataka. Est. 700 CE."},
  {id:44, era:740, title:"Pattadakal Temples", state:"Karnataka", lat:15.948, lng:75.8183, desc:"Pattadakal Temples — Karnataka. Est. 740 CE."},
  {id:45, era:1285, title:"Brihadamba Temple, Udupi Krishna", state:"Karnataka", lat:13.3413, lng:74.7491, desc:"Brihadamba Temple, Udupi Krishna — Karnataka. Est. 1285 CE by Madhvacharya."},
  {id:46, era:-200, title:"Kukke Subramanya Temple", state:"Karnataka", lat:12.8368, lng:75.9365, desc:"Kukke Subramanya Temple — Karnataka. Site Antiquity: Ancient Serpent Worship (Pre-200 BCE)."},
  {id:47, era:800, title:"Kollur Mookambika Temple", state:"Karnataka", lat:13.864, lng:74.8113, desc:"Kollur Mookambika Temple — Karnataka. Est. ~800 CE (Associated with Adi Shankara)."},
  {id:48, era:1190, title:"Dharmasthala Temple", state:"Karnataka", lat:12.9551, lng:75.3744, desc:"Dharmasthala Temple — Karnataka. Est. 1190 CE."},
  {id:49, era:1000, title:"Chamundeshwari Temple, Mysuru", state:"Karnataka", lat:12.272, lng:76.1399, desc:"Chamundeshwari Temple, Mysuru — Karnataka. Site Antiquity: ~1000 CE (Hoysala era)."},
  {id:50, era:800, title:"Murudeshwara Temple", state:"Karnataka", lat:14.0938, lng:74.4882, desc:"Murudeshwara Temple — Karnataka. Site Antiquity: Ancient (Gokarna legend), later structures from 800 CE."},
 {id:51, era:-5000, title:"Gokarna Mahabaleshwar", state:"Karnataka", lat:14.5503, lng:74.3188, desc:"Gokarna Mahabaleshwar — Karnataka. Site Antiquity: Treta Yuga (Ravana & Atma Linga legend). Current structure: 4th Century CE onwards."},
  {id:52, era:-1000, title:"Shri Manjunatheshwara, Kadri", state:"Karnataka", lat:12.9113, lng:74.8524, desc:"Shri Manjunatheshwara, Kadri — Karnataka. Site Antiquity: Ancient Parashurama legend. Current structure: 1068 CE."},
  {id:53, era:-3100, title:"Mallikarjuna Temple, Banavasi", state:"Karnataka", lat:14.531, lng:75.0253, desc:"Mallikarjuna Temple, Banavasi — Karnataka. Site Antiquity: Mahabharata era (Vanavasa). Current structure: Kadamba dynasty."},
  {id:54, era:1537, title:"Siddhivinayaka, Bangalore", state:"Karnataka", lat:12.9667, lng:77.5667, desc:"Siddhivinayaka, Bangalore — Karnataka. Site Antiquity: 1537 CE (Kempegowda era)."},
  {id:55, era:1537, title:"Dodda Ganapathi Temple, Bangalore", state:"Karnataka", lat:12.9716, lng:77.5946, desc:"Dodda Ganapathi Temple, Bangalore — Karnataka. Est. 1537 CE by Kempegowda."},
  {id:56, era:-1000, title:"Nanjangud Srikanteshwara", state:"Karnataka", lat:12.1134, lng:76.6826, desc:"Nanjangud Srikanteshwara — Karnataka. Site Antiquity: Puranic era (Gautama Maharishi). Current structure: 9th Century CE."},
  {id:57, era:-5000, title:"Biligiri Rangaswamy Temple", state:"Karnataka", lat:11.998, lng:77.1687, desc:"Biligiri Rangaswamy Temple — Karnataka. Site Antiquity: Ramayana era (Vashistha Maharishi). Current structure: 1500 CE."},
  {id:58, era:600, title:"Mahalingeshwara, Mahalingapur", state:"Karnataka", lat:16.4011, lng:75.114, desc:"Mahalingeshwara, Mahalingapur — Karnataka. Est. 600 CE (Chalukya era)."},
  {id:59, era:1087, title:"Lakkundi Group of Temples", state:"Karnataka", lat:15.5116, lng:75.9765, desc:"Lakkundi Group of Temples — Karnataka. Est. 1087 CE (Western Chalukya)."},
  {id:60, era:1196, title:"Amruteshwara Temple, Amruthapura", state:"Karnataka", lat:13.659, lng:75.704, desc:"Amruteshwara Temple, Amruthapura — Karnataka. Est. 1196 CE (Hoysala)."},
  {id:61, era:-3000, title:"Venkateswara Temple, Tirupati", state:"Andhra Pradesh", lat:13.6833, lng:79.3473, desc:"Venkateswara Temple, Tirupati — Andhra Pradesh. Site Antiquity: Varaha Purana. Current structure: 300 CE onwards."},
  {id:62, era:-3000, title:"Srikalahasti Temple", state:"Andhra Pradesh", lat:13.7498, lng:79.6984, desc:"Srikalahasti Temple — Andhra Pradesh. Site Antiquity: Puranic era (Spider, Snake, Elephant legend). Current structure: 5th Century CE."},
  {id:63, era:-3100, title:"Kanaka Durga Temple, Vijayawada", state:"Andhra Pradesh", lat:16.5162, lng:80.6116, desc:"Kanaka Durga Temple, Vijayawada — Andhra Pradesh. Site Antiquity: Mahabharata era (Arjuna's penance)."},
  {id:64, era:-3100, title:"Mallikarjuna Temple, Srisailam", state:"Andhra Pradesh", lat:16.073, lng:78.868, desc:"Mallikarjuna Temple, Srisailam — Andhra Pradesh. Site Antiquity: Ancient Jyotirlinga (Mahabharata/Puranas references)."},
  {id:65, era:-10000, title:"Simhachalam Temple", state:"Andhra Pradesh", lat:17.7669, lng:83.2484, desc:"Simhachalam Temple — Andhra Pradesh. Site Antiquity: Satya Yuga (Prahlada & Narasimha legend). Current structure: 11th Century."},
  {id:66, era:-3000, title:"Draksharama Bhimeswara", state:"Andhra Pradesh", lat:16.7931, lng:82.0608, desc:"Draksharama Bhimeswara — Andhra Pradesh. Site Antiquity: Puranic Pancharama Kshetra (Tarakasura legend)."},
  {id:67, era:-3000, title:"Kumararama Bhimeswara, Samalkot", state:"Andhra Pradesh", lat:17.0571, lng:82.1718, desc:"Kumararama Bhimeswara, Samalkot — Andhra Pradesh. Site Antiquity: Puranic Pancharama Kshetra."},
  {id:68, era:-3000, title:"Ksheerarama Bhimeswara, Palakollu", state:"Andhra Pradesh", lat:16.5186, lng:81.7265, desc:"Ksheerarama Bhimeswara, Palakollu — Andhra Pradesh. Site Antiquity: Puranic Pancharama Kshetra."},
  {id:69, era:-3000, title:"Amaralingeswara, Amaravathi", state:"Andhra Pradesh", lat:16.5795, lng:80.3584, desc:"Amaralingeswara, Amaravathi — Andhra Pradesh. Site Antiquity: Puranic Pancharama Kshetra."},
  {id:70, era:-3100, title:"Suryanarayana Temple, Arasavalli", state:"Andhra Pradesh", lat:18.2837, lng:84.0033, desc:"Suryanarayana Temple, Arasavalli — Andhra Pradesh. Site Antiquity: Mahabharata era (Founded by Balarama)."},
  {id:71, era:-1000, title:"Annavaram Satyanarayana Temple", state:"Andhra Pradesh", lat:17.201, lng:82.0254, desc:"Annavaram Satyanarayana Temple — Andhra Pradesh. Site Antiquity: Ancient Puranic site."},
  {id:72, era:-10000, title:"Ahobilam Narasimha Temple", state:"Andhra Pradesh", lat:15.133, lng:78.7427, desc:"Ahobilam Narasimha Temple — Andhra Pradesh. Site Antiquity: Satya Yuga (Exact site where Lord Narasimha appeared)."},
  {id:73, era:-1000, title:"Yaganti Uma Maheshwara", state:"Andhra Pradesh", lat:15.3841, lng:78.189, desc:"Yaganti Uma Maheshwara — Andhra Pradesh. Site Antiquity: Sage Agastya legend. Current structure: 15th Century."},
  {id:74, era:-3000, title:"Padmavathi Temple, Tiruchanur", state:"Andhra Pradesh", lat:13.6255, lng:79.3605, desc:"Padmavathi Temple, Tiruchanur — Andhra Pradesh. Site Antiquity: Ancient Puranic origins."},
  {id:75, era:-10000, title:"Varaha Lakshmi Narasimha, Simhachalam", state:"Andhra Pradesh", lat:17.767, lng:83.2485, desc:"Varaha Lakshmi Narasimha, Simhachalam — Andhra Pradesh. Site Antiquity: Satya Yuga."},
  {id:76, era:1100, title:"Govindaraja Temple, Tirupati", state:"Andhra Pradesh", lat:13.6507, lng:79.4196, desc:"Govindaraja Temple, Tirupati — Andhra Pradesh. Est. 1100 CE by Saint Ramanujacharya."},
  {id:77, era:-3000, title:"Kapila Theertham, Tirupati", state:"Andhra Pradesh", lat:13.6328, lng:79.4038, desc:"Kapila Theertham, Tirupati — Andhra Pradesh. Site Antiquity: Puranic era (Sage Kapila Maharishi)."},
  {id:78, era:-3000, title:"Kalyana Venkateswara, Narayanavanam", state:"Andhra Pradesh", lat:13.47, lng:79.5942, desc:"Kalyana Venkateswara, Narayanavanam — Andhra Pradesh. Site Antiquity: Puranic site of Srinivasa Kalyanam."},
  {id:79, era:-10000, title:"Sree Swayambhudeva, Mangalagiri", state:"Andhra Pradesh", lat:16.4326, lng:80.5619, desc:"Sree Swayambhudeva, Mangalagiri — Andhra Pradesh. Site Antiquity: Satya Yuga (Panakala Narasimha Swamy)."},
  {id:80, era:-3000, title:"Jogulamba Temple, Alampur", state:"Andhra Pradesh", lat:15.8805, lng:78.1349, desc:"Jogulamba Temple, Alampur — Andhra Pradesh. Site Antiquity: Ancient Maha Shakti Peetha (Sati's upper teeth fell here)."},
  {id:81, era:1213, title:"Ramappa Temple (Rudreshwara)", state:"Telangana", lat:18.2562, lng:79.9612, desc:"Ramappa Temple (Rudreshwara) — Telangana. Est. 1213 CE (Kakatiya Dynasty). UNESCO World Heritage."},
  {id:82, era:1163, title:"Thousand Pillar Temple, Warangal", state:"Telangana", lat:17.9706, lng:79.5835, desc:"Thousand Pillar Temple, Warangal — Telangana. Est. 1163 CE (Kakatiya)."},
  {id:83, era:-5000, title:"Bhadrachalam Rama Temple", state:"Telangana", lat:17.6693, lng:80.8934, desc:"Bhadrachalam Rama Temple — Telangana. Site Antiquity: Treta Yuga (Ramayana - Dandakaranya). Current structure: 17th Century."},
  {id:84, era:-1000, title:"Vemulawada Rajarajeswara", state:"Telangana", lat:18.4787, lng:79.1562, desc:"Vemulawada Rajarajeswara — Telangana. Site Antiquity: Ancient Puranic site. Current structure: 9th Century CE."},
  {id:85, era:-3000, title:"Yadagirigutta Lakshmi Narasimha", state:"Telangana", lat:17.5912, lng:79.0229, desc:"Yadagirigutta Lakshmi Narasimha — Telangana. Site Antiquity: Treta Yuga (Rishyasringa's penance)."},
  {id:86, era:-5000, title:"Keesaragutta Ramalingeswara", state:"Telangana", lat:17.5553, lng:78.5831, desc:"Keesaragutta Ramalingeswara — Telangana. Site Antiquity: Treta Yuga (Sri Rama installed the Lingam here)."},
  {id:87, era:1400, title:"Chilkur Balaji, Hyderabad", state:"Telangana", lat:17.3602, lng:78.2986, desc:"Chilkur Balaji, Hyderabad — Telangana. Est. ~1400 CE."},
  {id:88, era:-3000, title:"Kaleshwara Mukteeshwara", state:"Telangana", lat:18.811, lng:79.9067, desc:"Kaleshwara Mukteeshwara — Telangana. Site Antiquity: Puranic era (Only temple where Yama and Shiva share a pedestal)."},
  {id:89, era:1100, title:"Komuravelli Mallanna", state:"Telangana", lat:17.9167, lng:79.6, desc:"Komuravelli Mallanna — Telangana. Folk deity site. Est. ~1100 CE."},
  {id:90, era:-3000, title:"Alampur Jogulamba", state:"Telangana", lat:15.8803, lng:78.1352, desc:"Alampur Jogulamba — Telangana. Maha Shakti Peetha. Extremely ancient."},
  {id:91, era:760, title:"Kailasa Temple, Ellora", state:"Maharashtra", lat:20.0268, lng:75.1789, desc:"Kailasa Temple, Ellora — Maharashtra. Est. 760 CE by Rashtrakutas. World's largest monolithic structure."},
  {id:92, era:-3000, title:"Grishneshwar Temple, Aurangabad", state:"Maharashtra", lat:20.022, lng:75.1767, desc:"Grishneshwar Temple, Aurangabad — Maharashtra. Site Antiquity: Ancient Jyotirlinga. Current structure: 18th Century."},
  {id:93, era:-3100, title:"Bhimashankar Temple", state:"Maharashtra", lat:19.0727, lng:73.5339, desc:"Bhimashankar Temple — Maharashtra. Site Antiquity: Ancient Jyotirlinga (Tripurasura legend)."},
  {id:94, era:-3100, title:"Trimbakeshwar Temple", state:"Maharashtra", lat:19.933, lng:73.5293, desc:"Trimbakeshwar Temple — Maharashtra. Site Antiquity: Ancient Jyotirlinga associated with Sage Gautama and Godavari river."},
  {id:95, era:500, title:"Pandharpur Vitthal Temple", state:"Maharashtra", lat:17.68, lng:75.329, desc:"Pandharpur Vitthal Temple — Maharashtra. Site Antiquity: Pundalik legend (~500 CE or earlier)."},
  {id:96, era:-3000, title:"Kolhapur Mahalakshmi Temple", state:"Maharashtra", lat:16.7028, lng:74.2312, desc:"Kolhapur Mahalakshmi Temple — Maharashtra. Site Antiquity: Ancient Shakti Peetha. Current structure: Chalukya era."},
  {id:97, era:-3000, title:"Tuljapur Bhavani Temple", state:"Maharashtra", lat:17.975, lng:76.0753, desc:"Tuljapur Bhavani Temple — Maharashtra. Site Antiquity: Ancient Shakti Peetha. Worshiped by Chhatrapati Shivaji Maharaj."},
  {id:98, era:-1000, title:"Ashtavinayak Morgaon", state:"Maharashtra", lat:18.2701, lng:74.5201, desc:"Ashtavinayak Morgaon — Maharashtra. Site Antiquity: Puranic Swayambhu (self-manifested) Ganesha."},
  {id:99, era:-1000, title:"Ashtavinayak Siddhatek", state:"Maharashtra", lat:18.1041, lng:74.9011, desc:"Ashtavinayak Siddhatek — Maharashtra. Site Antiquity: Swayambhu Ganesha (Legend of Vishnu defeating demons)."},
  {id:101, era:-1000, title:"Ashtavinayak Mahad", state:"Maharashtra", lat:18.0748, lng:73.4092, desc:"Ashtavinayak Mahad (Varadvinayak) — Maharashtra. Site Antiquity: Puranic Swayambhu Ganesha (Legend of Gritsamada)."},
  {id:102, era:-1000, title:"Ashtavinayak Theur", state:"Maharashtra", lat:18.4975, lng:74.0744, desc:"Ashtavinayak Theur (Chintamani) — Maharashtra. Site Antiquity: Brahma's meditation site. Swayambhu Ganesha."},
  {id:103, era:-10000, title:"Ashtavinayak Lenyadri", state:"Maharashtra", lat:19.194, lng:73.8755, desc:"Ashtavinayak Lenyadri (Girijatmaj) — Maharashtra. Site Antiquity: Satya Yuga (Parvati's penance for Ganesha)."},
  {id:104, era:-1000, title:"Ashtavinayak Ozar", state:"Maharashtra", lat:19.2882, lng:73.9539, desc:"Ashtavinayak Ozar (Vighnahar) — Maharashtra. Site Antiquity: Puranic era (Defeat of Vighnasur demon)."},
  {id:105, era:-3000, title:"Ashtavinayak Ranjangaon", state:"Maharashtra", lat:18.7437, lng:74.2982, desc:"Ashtavinayak Ranjangaon (Mahaganapati) — Maharashtra. Site Antiquity: Puranic (Shiva prayed here before defeating Tripurasura)."},
  {id:106, era:1900, title:"Shirdi Sai Baba Temple", state:"Maharashtra", lat:19.7654, lng:74.4769, desc:"Shirdi Sai Baba Temple — Maharashtra. Est. 1900 CE."},
  {id:107, era:-3000, title:"Jejuri Khandoba Temple", state:"Maharashtra", lat:18.2671, lng:74.1577, desc:"Jejuri Khandoba Temple — Maharashtra. Site Antiquity: Puranic (Shiva's avatar to defeat Mani-Malla demons)."},
  {id:108, era:1856, title:"Akkalkot Swami Samarth", state:"Maharashtra", lat:17.4188, lng:76.1986, desc:"Akkalkot Swami Samarth — Maharashtra. Est. 1856 CE."},
  {id:109, era:-5000, title:"Nashik Kalaram Temple", state:"Maharashtra", lat:19.9934, lng:73.7897, desc:"Nashik Kalaram Temple — Maharashtra. Site Antiquity: Treta Yuga (Ramayana). Lord Ram stayed in Panchavati here."},
  {id:110, era:578, title:"Badami Cave Temples (alt)", state:"Maharashtra", lat:20.028, lng:75.1795, desc:"Badami Cave Temples (alt) — Maharashtra. Est. 578 CE."},
  {id:111, era:-10000, title:"Somnath Temple", state:"Gujarat", lat:20.888, lng:70.4014, desc:"Somnath Temple — Gujarat. Site Antiquity: Satya Yuga (Moon God's penance). First Jyotirlinga."},
  {id:112, era:-3100, title:"Dwarkadhish Temple", state:"Gujarat", lat:22.2376, lng:68.9676, desc:"Dwarkadhish Temple — Gujarat. Site Antiquity: Mahabharata era (Lord Krishna's real capital)."},
  {id:113, era:-5000, title:"Sun Temple, Modhera", state:"Gujarat", lat:23.5852, lng:72.1308, desc:"Sun Temple, Modhera — Gujarat. Site Antiquity: Ramayana era (Dharmaranya, Rama did penance here). Current structure: 1026 CE."},
  {id:114, era:-3000, title:"Ambaji Temple", state:"Gujarat", lat:24.3284, lng:72.8513, desc:"Ambaji Temple — Gujarat. Site Antiquity: Ancient Maha Shakti Peetha (Sati's heart fell here)."},
  {id:115, era:-3000, title:"Kalika Mata Temple, Pavagadh", state:"Gujarat", lat:22.47, lng:73.526, desc:"Kalika Mata Temple, Pavagadh — Gujarat. Site Antiquity: Ancient Shakti Peetha."},
  {id:116, era:-3100, title:"Rukmini Devi Temple, Dwarka", state:"Gujarat", lat:22.2432, lng:68.9751, desc:"Rukmini Devi Temple, Dwarka — Gujarat. Site Antiquity: Mahabharata era."},
  {id:117, era:1992, title:"Akshardham, Gandhinagar", state:"Gujarat", lat:23.2162, lng:72.684, desc:"Akshardham, Gandhinagar — Gujarat. Est. 1992 CE."},
  {id:118, era:-3000, title:"Bahucharaji Temple", state:"Gujarat", lat:23.699, lng:72.2706, desc:"Bahucharaji Temple — Gujarat. Site Antiquity: Ancient Puranic Shakti shrine."},
  {id:119, era:400, title:"Shamlaji Temple", state:"Gujarat", lat:24.129, lng:73.057, desc:"Shamlaji Temple — Gujarat. Site Antiquity: Ancient Vishnu shrine (4th Century CE or older)."},
  {id:120, era:-3000, title:"Nageshvara Jyotirlinga, Dwarka", state:"Gujarat", lat:22.4016, lng:68.9661, desc:"Nageshvara Jyotirlinga, Dwarka — Gujarat. Site Antiquity: Ancient Jyotirlinga (Darukavana legend)."},
  {id:121, era:-3000, title:"Bahuchara Mata Temple", state:"Gujarat", lat:24.2056, lng:72.2878, desc:"Bahuchara Mata Temple — Gujarat. Site Antiquity: Ancient Shakti Peetha."},
  {id:122, era:-3000, title:"Chotila Chamunda Mata", state:"Gujarat", lat:22.4221, lng:71.1948, desc:"Chotila Chamunda Mata — Gujarat. Site Antiquity: Puranic era (Defeat of Chanda-Munda demons)."},
  {id:123, era:-3100, title:"Hadimba Temple, Surat (Unai Mata)", state:"Gujarat", lat:20.8553, lng:73.0178, desc:"Hadimba Temple, Surat (Unai Mata) — Gujarat. Site Antiquity: Mahabharata era (Bheema & Hidimba)."},
  {id:124, era:1824, title:"Shri Swaminarayan Temple, Vadtal", state:"Gujarat", lat:22.542, lng:72.97, desc:"Shri Swaminarayan Temple, Vadtal — Gujarat. Est. 1824 CE."},
  {id:125, era:1600, title:"Shakatpur Shri Hanuman", state:"Gujarat", lat:22.3, lng:70.8, desc:"Shakatpur Shri Hanuman — Gujarat. Est. 1600 CE."},
  {id:126, era:-10000, title:"Brahma Temple, Pushkar", state:"Rajasthan", lat:26.4895, lng:74.5551, desc:"Brahma Temple, Pushkar — Rajasthan. Site Antiquity: Satya Yuga (Lord Brahma's lotus fell here)."},
  {id:127, era:734, title:"Eklingji Temple", state:"Rajasthan", lat:24.7299, lng:73.8975, desc:"Eklingji Temple — Rajasthan. Est. 734 CE (Mewar Dynasty)."},
  {id:128, era:1031, title:"Dilwara Temples, Mt Abu", state:"Rajasthan", lat:24.5927, lng:72.709, desc:"Dilwara Temples, Mt Abu — Rajasthan. Est. 1031 CE."},
  {id:129, era:1538, title:"Karni Mata Temple, Deshnok", state:"Rajasthan", lat:27.7929, lng:72.3393, desc:"Karni Mata Temple, Deshnok — Rajasthan. Est. 1538 CE."},
  {id:130, era:-3100, title:"Khatushyamji Temple", state:"Rajasthan", lat:27.7119, lng:75.2867, desc:"Khatushyamji Temple — Rajasthan. Site Antiquity: Mahabharata era (Barbarika, grandson of Bheema)."},
  {id:131, era:-3100, title:"Govind Dev Ji, Jaipur", state:"Rajasthan", lat:26.9241, lng:75.8233, desc:"Govind Dev Ji, Jaipur — Rajasthan. Site Antiquity: Image carved by Vajranabha (Krishna's great-grandson)."},
  {id:132, era:1988, title:"Birla Mandir, Jaipur", state:"Rajasthan", lat:26.8963, lng:75.824, desc:"Birla Mandir, Jaipur — Rajasthan. Est. 1988 CE."},
  {id:133, era:-3000, title:"Tanot Mata Temple, Jaisalmer", state:"Rajasthan", lat:27.059, lng:70.2538, desc:"Tanot Mata Temple, Jaisalmer — Rajasthan. Site Antiquity: Avatar of Hinglaj Mata (Ancient Shakti Peetha)."},
  {id:134, era:1000, title:"Kiradu Temples, Barmer", state:"Rajasthan", lat:25.537, lng:71.424, desc:"Kiradu Temples, Barmer — Rajasthan. Est. 1000 CE."},
  {id:135, era:800, title:"Sachiya Mata Temple, Osian", state:"Rajasthan", lat:26.7273, lng:72.915, desc:"Sachiya Mata Temple, Osian — Rajasthan. Est. 800 CE."},
  {id:136, era:1011, title:"Nagda Sas-Bahu Temples", state:"Rajasthan", lat:24.76, lng:73.88, desc:"Nagda Sas-Bahu Temples — Rajasthan. Est. 1011 CE."},
  {id:137, era:1385, title:"Ramdev Ji Temple, Pokhran", state:"Rajasthan", lat:26.9183, lng:71.9109, desc:"Ramdev Ji Temple, Pokhran — Rajasthan. Est. 1385 CE."},
  {id:138, era:-1000, title:"Mehandipur Balaji", state:"Rajasthan", lat:26.9561, lng:76.9779, desc:"Mehandipur Balaji — Rajasthan. Site Antiquity: Ancient Swayambhu Hanuman (Puranic era)."},
  {id:139, era:1200, title:"Jalim Singh Ki Haveli Temple (Jaisalmer)", state:"Rajasthan", lat:26.9157, lng:70.9083, desc:"Jalim Singh Ki Haveli Temple (Jaisalmer) — Rajasthan. Est. 1200 CE."},
  {id:140, era:-3100, title:"Shrinathji Temple, Nathdwara", state:"Rajasthan", lat:24.9393, lng:73.8233, desc:"Shrinathji Temple, Nathdwara — Rajasthan. Site Antiquity: Mahabharata era (Deity originally from Govardhan/Mathura)."},
  {id:141, era:950, title:"Khajuraho Temple Complex", state:"Madhya Pradesh", lat:24.8518, lng:79.9198, desc:"Khajuraho Temple Complex — Madhya Pradesh. Est. 950 CE."},
  {id:142, era:-5000, title:"Mahakaleshwar Temple, Ujjain", state:"Madhya Pradesh", lat:23.1831, lng:75.7683, desc:"Mahakaleshwar Temple, Ujjain — Madhya Pradesh. Site Antiquity: Ancient Jyotirlinga (Puranic era). Current structure: 18th Century."},
  {id:143, era:-5000, title:"Omkareshwar Temple", state:"Madhya Pradesh", lat:22.2378, lng:76.151, desc:"Omkareshwar Temple — Madhya Pradesh. Site Antiquity: Ancient Jyotirlinga (Vindhya mountain legend)."},
  {id:144, era:1025, title:"Kandariya Mahadeva, Khajuraho", state:"Madhya Pradesh", lat:24.8514, lng:79.9213, desc:"Kandariya Mahadeva, Khajuraho — Madhya Pradesh. Est. 1025 CE."},
  {id:145, era:1558, title:"Chaturbhuj Temple, Orchha", state:"Madhya Pradesh", lat:25.352, lng:78.6412, desc:"Chaturbhuj Temple, Orchha — Madhya Pradesh. Est. 1558 CE."},
  {id:146, era:1531, title:"Ram Raja Temple, Orchha", state:"Madhya Pradesh", lat:25.353, lng:78.642, desc:"Ram Raja Temple, Orchha — Madhya Pradesh. Est. 1531 CE."},
  {id:147, era:954, title:"Lakshmana Temple, Khajuraho", state:"Madhya Pradesh", lat:24.852, lng:79.9215, desc:"Lakshmana Temple, Khajuraho — Madhya Pradesh. Est. 954 CE."},
  {id:148, era:1002, title:"Vishvanatha Temple, Khajuraho", state:"Madhya Pradesh", lat:24.8516, lng:79.9207, desc:"Vishvanatha Temple, Khajuraho — Madhya Pradesh. Est. 1002 CE."},
  {id:149, era:1000, title:"Chitragupta Temple, Khajuraho", state:"Madhya Pradesh", lat:24.853, lng:79.92, desc:"Chitragupta Temple, Khajuraho — Madhya Pradesh. Est. 1000 CE."},
 {id:150, era:1000, title:"Devi Jagadamba, Khajuraho", state:"Madhya Pradesh", lat:24.8524, lng:79.9219, desc:"Devi Jagadamba, Khajuraho — Madhya Pradesh. Est. 1000 CE."},
  {id:151, era:950, title:"Parsvanath Temple, Khajuraho", state:"Madhya Pradesh", lat:24.8515, lng:79.9225, desc:"Parsvanath Temple, Khajuraho — Madhya Pradesh. Est. 950 CE."},
  {id:152, era:1010, title:"Bhojpur Shiva Temple", state:"Madhya Pradesh", lat:23.188, lng:77.593, desc:"Bhojpur Shiva Temple — Madhya Pradesh. Est. 1010 CE (Built by Raja Bhoj)."},
  {id:153, era:500, title:"Pashupatinath Temple, Mandsaur", state:"Madhya Pradesh", lat:24.0773, lng:75.073, desc:"Pashupatinath Temple, Mandsaur — Madhya Pradesh. Est. 500 CE."},
  {id:154, era:900, title:"Tripuri Panchmarhi", state:"Madhya Pradesh", lat:22.4677, lng:78.4338, desc:"Tripuri Panchmarhi — Madhya Pradesh. Est. 900 CE."},
  {id:155, era:900, title:"Matangeshwar Temple, Khajuraho", state:"Madhya Pradesh", lat:24.85, lng:79.921, desc:"Matangeshwar Temple, Khajuraho — Madhya Pradesh. Est. 900 CE."},
  {id:156, era:-5000, title:"Jagannath Temple, Puri", state:"Odisha", lat:19.805, lng:85.8314, desc:"Jagannath Temple, Puri — Odisha. Site Antiquity: Satya Yuga (Legend of King Indradyumna & Nilamadhava). Current structure: 1161 CE."},
  {id:157, era:1250, title:"Konark Sun Temple", state:"Odisha", lat:19.8876, lng:86.0945, desc:"Konark Sun Temple — Odisha. Site Antiquity: Samba Purana. Current chariot structure est. 1250 CE."},
  {id:158, era:-1000, title:"Lingaraj Temple, Bhubaneswar", state:"Odisha", lat:20.2392, lng:85.8322, desc:"Lingaraj Temple, Bhubaneswar — Odisha. Site Antiquity: Ancient Ekamra Kshetra. Current structure: 1090 CE."},
  {id:159, era:970, title:"Mukteswar Temple, Bhubaneswar", state:"Odisha", lat:20.2424, lng:85.833, desc:"Mukteswar Temple, Bhubaneswar — Odisha. Est. 970 CE."},
  {id:160, era:1100, title:"Raja Rani Temple, Bhubaneswar", state:"Odisha", lat:20.2534, lng:85.8428, desc:"Raja Rani Temple, Bhubaneswar — Odisha. Est. 1100 CE."},
  {id:161, era:1060, title:"Brahmeswara Temple, Bhubaneswar", state:"Odisha", lat:20.234, lng:85.831, desc:"Brahmeswara Temple, Bhubaneswar — Odisha. Est. 1060 CE."},
  {id:162, era:650, title:"Parasuramesvara Temple, Bhubaneswar", state:"Odisha", lat:20.239, lng:85.837, desc:"Parasuramesvara Temple, Bhubaneswar — Odisha. Est. 650 CE."},
  {id:163, era:800, title:"Vaital Deul, Bhubaneswar", state:"Odisha", lat:20.2396, lng:85.8325, desc:"Vaital Deul, Bhubaneswar — Odisha. Est. 800 CE."},
  {id:164, era:-3000, title:"Taratarini Temple", state:"Odisha", lat:19.8847, lng:85.1083, desc:"Taratarini Temple — Odisha. Site Antiquity: Ancient Shakti Peetha (Sati's breasts fell here)."},
  {id:165, era:600, title:"Samaleswari Temple, Sambalpur", state:"Odisha", lat:21.4673, lng:83.981, desc:"Samaleswari Temple, Sambalpur — Odisha. Est. 600 CE."},
  {id:166, era:1200, title:"Maa Tarini, Ghatagaon", state:"Odisha", lat:21.4567, lng:85.7431, desc:"Maa Tarini, Ghatagaon — Odisha. Est. 1200 CE."},
  {id:167, era:900, title:"Chausathi Yogini Temple, Hirapur", state:"Odisha", lat:20.299, lng:85.9545, desc:"Chausathi Yogini Temple, Hirapur — Odisha. Est. 900 CE."},
  {id:168, era:800, title:"Siddha Bhairavi Temple, Ranipur", state:"Odisha", lat:20.29, lng:83.99, desc:"Siddha Bhairavi Temple, Ranipur — Odisha. Est. 800 CE."},
  {id:169, era:-10000, title:"Kashi Vishwanath, Varanasi", state:"Uttar Pradesh", lat:25.3109, lng:83.0107, desc:"Kashi Vishwanath, Varanasi — Uttar Pradesh. Site Antiquity: Satya Yuga (Oldest living city / First Jyotirlinga). Current structure: 1780 CE."},
  {id:170, era:1585, title:"Sankat Mochan Hanuman, Varanasi", state:"Uttar Pradesh", lat:25.2955, lng:83.0074, desc:"Sankat Mochan Hanuman, Varanasi — Uttar Pradesh. Est. 1585 CE by Goswami Tulsidas."},
  {id:171, era:1800, title:"Durga Temple, Varanasi", state:"Uttar Pradesh", lat:25.29, lng:83.012, desc:"Durga Temple, Varanasi — Uttar Pradesh. Est. 1800 CE."},
  {id:172, era:-1000, title:"Mrityunjaya Mahadev, Varanasi", state:"Uttar Pradesh", lat:25.307, lng:83.01, desc:"Mrityunjaya Mahadev, Varanasi — Uttar Pradesh. Site Antiquity: Ancient Puranic era."},
  {id:173, era:-10000, title:"Dashashwamedh Ghat, Varanasi", state:"Uttar Pradesh", lat:25.306, lng:83.0107, desc:"Dashashwamedh Ghat, Varanasi — Uttar Pradesh. Site Antiquity: Satya Yuga (Lord Brahma sacrificed 10 horses here)."},
  {id:174, era:400, title:"Dashavatara Temple, Deogarh", state:"Uttar Pradesh", lat:24.5349, lng:78.2381, desc:"Dashavatara Temple, Deogarh — Uttar Pradesh. Est. 400 CE (Gupta Empire)."},
  {id:175, era:-3100, title:"Krishna Janmabhoomi, Mathura", state:"Uttar Pradesh", lat:27.503, lng:77.6727, desc:"Krishna Janmabhoomi, Mathura — Uttar Pradesh. Site Antiquity: Dwapara Yuga (Birthplace of Lord Krishna)."},
  {id:176, era:1814, title:"Dwarkadhish Temple, Mathura", state:"Uttar Pradesh", lat:27.5011, lng:77.673, desc:"Dwarkadhish Temple, Mathura — Uttar Pradesh. Est. 1814 CE."},
  {id:177, era:1864, title:"Banke Bihari Temple, Vrindavan", state:"Uttar Pradesh", lat:27.574, lng:77.7002, desc:"Banke Bihari Temple, Vrindavan — Uttar Pradesh. Est. 1864 CE by Swami Haridas."},
  {id:178, era:1542, title:"Radha Raman Temple, Vrindavan", state:"Uttar Pradesh", lat:27.576, lng:77.6982, desc:"Radha Raman Temple, Vrindavan — Uttar Pradesh. Est. 1542 CE."},
  {id:179, era:1975, title:"ISKCON Temple, Vrindavan", state:"Uttar Pradesh", lat:27.5829, lng:77.6902, desc:"ISKCON Temple, Vrindavan — Uttar Pradesh. Est. 1975 CE."},
  {id:180, era:-3100, title:"Govardhan Giriraj Temple", state:"Uttar Pradesh", lat:27.499, lng:77.4612, desc:"Govardhan Giriraj Temple — Uttar Pradesh. Site Antiquity: Dwapara Yuga (Lord Krishna lifted the Govardhan hill)."},
  {id:181, era:-5000, title:"Ram Mandir, Ayodhya", state:"Uttar Pradesh", lat:26.7953, lng:82.1942, desc:"Ram Mandir, Ayodhya — Uttar Pradesh. Site Antiquity: Treta Yuga (Birthplace of Lord Ram). Current structure: 2024 CE."},
  {id:182, era:-5000, title:"Hanuman Garhi, Ayodhya", state:"Uttar Pradesh", lat:26.7954, lng:82.1948, desc:"Hanuman Garhi, Ayodhya — Uttar Pradesh. Site Antiquity: Treta Yuga (Hanuman's cave guarding Ayodhya)."},
  {id:183, era:-5000, title:"Mankameshwar Temple, Prayagraj", state:"Uttar Pradesh", lat:25.4358, lng:81.8463, desc:"Mankameshwar Temple, Prayagraj — Uttar Pradesh. Site Antiquity: Treta Yuga (Lord Rama worshipped Shiva here)."},
  {id:184, era:600, title:"Sankat Mochan, Prayagraj", state:"Uttar Pradesh", lat:25.435, lng:81.8451, desc:"Sankat Mochan, Prayagraj — Uttar Pradesh. Est. ~600 CE."},
  {id:185, era:500, title:"Bhitargaon Brick Temple", state:"Uttar Pradesh", lat:26.369, lng:79.985, desc:"Bhitargaon Brick Temple — Uttar Pradesh. Est. 500 CE (Gupta Empire)."},
  {id:186, era:108, title:"Mundeshwari Devi Temple", state:"Bihar", lat:24.88, lng:83.5667, desc:"Mundeshwari Devi Temple — Bihar. Est. 108 CE. Oldest functional Hindu temple."},
  {id:187, era:-5000, title:"Vishnupad Temple, Gaya", state:"Bihar", lat:24.7974, lng:84.999, desc:"Vishnupad Temple, Gaya — Bihar. Site Antiquity: Treta/Satya Yuga (Lord Rama performed Pind Daan here)."},
  {id:188, era:-500, title:"Mahabodhi Temple, Bodh Gaya", state:"Bihar", lat:24.6969, lng:84.9914, desc:"Mahabodhi Temple, Bodh Gaya — Bihar. Site Antiquity: 500 BCE (Gautama Buddha's Enlightenment)."},
  {id:189, era:1666, title:"Takht Sri Patna Sahib", state:"Bihar", lat:25.5933, lng:85.203, desc:"Takht Sri Patna Sahib — Bihar. Site Antiquity: 1666 CE (Birthplace of Guru Gobind Singh Ji)."},
  {id:190, era:-1000, title:"Sun Temple, Deo", state:"Bihar", lat:24.6654, lng:84.4451, desc:"Sun Temple, Deo — Bihar. Site Antiquity: Puranic / Treta Yuga era."},
  {id:191, era:-250, title:"Barabar Caves", state:"Bihar", lat:25.0016, lng:85.0633, desc:"Barabar Caves — Bihar. Est. 250 BCE (Maurya Empire). Oldest surviving rock-cut caves."},
  {id:192, era:-3000, title:"Maa Mangla Gauri, Gaya", state:"Bihar", lat:24.7878, lng:84.9993, desc:"Maa Mangla Gauri, Gaya — Bihar. Site Antiquity: Ancient Shakti Peetha (Sati's breast fell here)."},
  {id:193, era:1855, title:"Dakshineswar Kali Temple", state:"West Bengal", lat:22.6573, lng:88.3578, desc:"Dakshineswar Kali Temple — West Bengal. Est. 1855 CE by Rani Rashmoni."},
  {id:194, era:-3000, title:"Kalighat Temple, Kolkata", state:"West Bengal", lat:22.5198, lng:88.3428, desc:"Kalighat Temple, Kolkata — West Bengal. Site Antiquity: Ancient Shakti Peetha (Right toe of Sati fell here)."},
  {id:195, era:1938, title:"Belur Math", state:"West Bengal", lat:22.6363, lng:88.3493, desc:"Belur Math — West Bengal. Est. 1938 CE (Founded by Swami Vivekananda)."},
  {id:196, era:-3000, title:"Tarapith Temple", state:"West Bengal", lat:23.9, lng:87.8042, desc:"Tarapith Temple — West Bengal. Site Antiquity: Ancient Tantric Shakti Peetha (Sage Vashistha legend)."},
  {id:197, era:1600, title:"Bishnupur Temples", state:"West Bengal", lat:23.073, lng:87.321, desc:"Bishnupur Temples — West Bengal. Est. 1600 CE (Malla Kings terracotta temples)."},
  {id:198, era:1655, title:"Rashbehari Temple, Bishnupur", state:"West Bengal", lat:23.072, lng:87.319, desc:"Rashbehari Temple, Bishnupur — West Bengal. Est. 1655 CE."},
  {id:199, era:1752, title:"Kantaji Temple, Dinajpur", state:"West Bengal", lat:25.6363, lng:88.5581, desc:"Kantaji Temple, Dinajpur — West Bengal. Est. 1752 CE."},
  {id:200, era:1643, title:"Navaratna Temple, Bishnupur", state:"West Bengal", lat:23.0724, lng:87.3211, desc:"Navaratna Temple, Bishnupur — West Bengal. Est. 1643 CE."},
  {id:201, era:-3000, title:"Kamakhya Temple, Guwahati", state:"Assam", lat:26.166, lng:91.7034, desc:"Kamakhya Temple, Guwahati — Assam. Site Antiquity: Ancient Maha Shakti Peetha (Sati's womb fell here)."},
  {id:202, era:-1000, title:"Umananda Temple, Guwahati", state:"Assam", lat:26.1853, lng:91.748, desc:"Umananda Temple, Guwahati — Assam. Site Antiquity: Puranic (Shiva burned Kamadeva here). Current structure: 1594 CE."},
  {id:203, era:-1000, title:"Navagraha Temple, Guwahati", state:"Assam", lat:26.1724, lng:91.76, desc:"Navagraha Temple, Guwahati — Assam. Site Antiquity: Ancient Pragjyotishpura (City of Eastern Astrology)."},
  {id:204, era:-3100, title:"Mahabhairav Temple, Tezpur", state:"Assam", lat:26.6283, lng:92.7672, desc:"Mahabhairav Temple, Tezpur — Assam. Site Antiquity: Mahabharata era (Built by King Banasura)."},
  {id:205, era:-3000, title:"Hayagriva Madhava, Hajo", state:"Assam", lat:26.2494, lng:91.5374, desc:"Hayagriva Madhava, Hajo — Assam. Site Antiquity: Puranic era (Vishnu's Hayagriva avatar)."},
  {id:206, era:-1000, title:"Tamreswari Temple", state:"Assam", lat:27.475, lng:95.335, desc:"Tamreswari Temple — Assam. Site Antiquity: Ancient Shakti worship site."},
  {id:207, era:-3100, title:"Malinithan Temple", state:"Assam", lat:27.8438, lng:94.6875, desc:"Malinithan Temple — Assam. Site Antiquity: Mahabharata era (Krishna and Rukmini rested here)."},
  {id:208, era:-3000, title:"Padmanabhaswamy Temple, Trivandrum", state:"Kerala", lat:8.4824, lng:76.9471, desc:"Padmanabhaswamy Temple, Trivandrum — Kerala. Site Antiquity: Puranic era / Sangam literature."},
  {id:209, era:-3100, title:"Guruvayur Temple", state:"Kerala", lat:10.593, lng:76.0406, desc:"Guruvayur Temple — Kerala. Site Antiquity: Dwapara Yuga (Idol worshipped by Lord Krishna, installed by Guru & Vayu)."},
  {id:210, era:-1000, title:"Sabarimala Ayyappa Temple", state:"Kerala", lat:9.438, lng:77.084, desc:"Sabarimala Ayyappa Temple — Kerala. Site Antiquity: Puranic era (Legend of Sage Parasurama & Lord Ayyappa)."},
  {id:211, era:-3000, title:"Thrissur Vadakkumnathan Temple", state:"Kerala", lat:10.52, lng:76.2141, desc:"Thrissur Vadakkumnathan Temple — Kerala. Site Antiquity: Founded by Sage Parasurama."},
  {id:212, era:1451, title:"Ambalapuzha Sri Krishna Temple", state:"Kerala", lat:9.3752, lng:76.3768, desc:"Ambalapuzha Sri Krishna Temple — Kerala. Est. 1451 CE (Famous for Palpayasam)."},
  {id:213, era:200, title:"Attukal Bhagavathy Temple", state:"Kerala", lat:8.4921, lng:76.9614, desc:"Attukal Bhagavathy Temple — Kerala. Site Antiquity: Sangam era (Kannagi legend)."},
  {id:214, era:-3100, title:"Thriprayar Sri Rama Temple", state:"Kerala", lat:10.2793, lng:76.2001, desc:"Thriprayar Sri Rama Temple — Kerala. Site Antiquity: Dwapara Yuga (Idol worshipped by Lord Krishna)."},
  {id:215, era:-3000, title:"Ettumanoor Mahadeva Temple", state:"Kerala", lat:9.6686, lng:76.5617, desc:"Ettumanoor Mahadeva Temple — Kerala. Site Antiquity: Ancient Parasurama & Khara demon legend."},
  {id:216, era:-3000, title:"Vaikom Mahadeva Temple", state:"Kerala", lat:9.752, lng:76.3965, desc:"Vaikom Mahadeva Temple — Kerala. Site Antiquity: Ancient Parasurama & Khara demon legend."},
  {id:217, era:-1000, title:"Chottanikkara Temple", state:"Kerala", lat:9.9693, lng:76.4072, desc:"Chottanikkara Temple — Kerala. Site Antiquity: Ancient Bhagavati shrine."},
  {id:218, era:-3000, title:"Mannarasala Nagaraja Temple", state:"Kerala", lat:9.352, lng:76.4093, desc:"Mannarasala Nagaraja Temple — Kerala. Site Antiquity: Created by Sage Parasurama."},
  {id:219, era:900, title:"Muthappan Temple, Parassinikadavu", state:"Kerala", lat:11.9855, lng:75.5394, desc:"Muthappan Temple, Parassinikadavu — Kerala. Est. ~900 CE."},
  {id:220, era:300, title:"Bekal Temple, Kasaragod", state:"Kerala", lat:12.3849, lng:75.0369, desc:"Bekal Temple, Kasaragod — Kerala. Est. 300 CE."},
  {id:221, era:-3000, title:"Jwala Ji Temple, Kangra", state:"Himachal Pradesh", lat:31.8754, lng:76.3174, desc:"Jwala Ji Temple, Kangra — Himachal Pradesh. Site Antiquity: Ancient Shakti Peetha (Sati's flaming tongue fell here)."},
  {id:222, era:-3000, title:"Chintpurni Temple", state:"Himachal Pradesh", lat:31.5427, lng:76.3032, desc:"Chintpurni Temple — Himachal Pradesh. Site Antiquity: Ancient Shakti Peetha (Sati's feet fell here)."},
  {id:223, era:-3000, title:"Chamunda Devi Temple", state:"Himachal Pradesh", lat:32.1983, lng:76.1342, desc:"Chamunda Devi Temple — Himachal Pradesh. Site Antiquity: Puranic era (Defeat of Chanda-Munda)."},
  {id:224, era:-3100, title:"Hidimba Devi Temple, Manali", state:"Himachal Pradesh", lat:32.2459, lng:77.1779, desc:"Hidimba Devi Temple, Manali — Himachal Pradesh. Site Antiquity: Mahabharata era (Wife of Bhima). Current structure: 1553 CE."},
  {id:225, era:-5000, title:"Jakhu Temple, Shimla", state:"Himachal Pradesh", lat:31.1098, lng:77.1783, desc:"Jakhu Temple, Shimla — Himachal Pradesh. Site Antiquity: Treta Yuga (Hanuman rested here while fetching Sanjeevani)."},
  {id:226, era:-5000, title:"Baijnath Temple", state:"Himachal Pradesh", lat:32.0581, lng:76.6506, desc:"Baijnath Temple — Himachal Pradesh. Site Antiquity: Treta Yuga (Ravana worshipped Shiva here). Current structure: 1204 CE."},
  {id:227, era:-3100, title:"Masrur Rock Temples", state:"Himachal Pradesh", lat:32.047, lng:76.3701, desc:"Masrur Rock Temples — Himachal Pradesh. Site Antiquity: Pandava legend. Monolithic rock cut: 8th Century CE."},
  {id:228, era:-3000, title:"Naina Devi Temple, Bilaspur", state:"Himachal Pradesh", lat:31.397, lng:76.5731, desc:"Naina Devi Temple, Bilaspur — Himachal Pradesh. Site Antiquity: Ancient Shakti Peetha (Sati's eyes fell here)."},
  {id:229, era:-3100, title:"Bhimakali Temple, Sarahan", state:"Himachal Pradesh", lat:31.5152, lng:77.7951, desc:"Bhimakali Temple, Sarahan — Himachal Pradesh. Site Antiquity: Mahabharata era (Capital of King Banasura)."},
  {id:230, era:-1000, title:"Baba Balak Nath", state:"Himachal Pradesh", lat:31.5982, lng:76.4528, desc:"Baba Balak Nath — Himachal Pradesh. Site Antiquity: Puranic era / Kartikeya legend."},
  {id:231, era:-1000, title:"Bijli Mahadev, Kullu", state:"Himachal Pradesh", lat:31.9388, lng:77.1561, desc:"Bijli Mahadev, Kullu — Himachal Pradesh. Site Antiquity: Puranic era (Kulanta demon legend)."},
  {id:232, era:680, title:"Chaurasi Temple, Bharmour", state:"Himachal Pradesh", lat:32.4467, lng:76.5356, desc:"Chaurasi Temple, Bharmour — Himachal Pradesh. Est. 680 CE (84 Siddhas)."},
  {id:233, era:-3100, title:"Kedarnath Temple", state:"Uttarakhand", lat:30.7352, lng:79.0669, desc:"Kedarnath Temple — Uttarakhand. Site Antiquity: Mahabharata era (Built by Pandavas). Jyotirlinga."},
  {id:234, era:-10000, title:"Badrinath Temple", state:"Uttarakhand", lat:30.7442, lng:79.4934, desc:"Badrinath Temple — Uttarakhand. Site Antiquity: Satya Yuga (Nara-Narayana penance)."},
  {id:235, era:-5000, title:"Gangotri Temple", state:"Uttarakhand", lat:30.9907, lng:78.9351, desc:"Gangotri Temple — Uttarakhand. Site Antiquity: Treta Yuga (King Bhagiratha's penance). Current structure: 18th Century."},
  {id:236, era:-3000, title:"Yamunotri Temple", state:"Uttarakhand", lat:31.0161, lng:78.4543, desc:"Yamunotri Temple — Uttarakhand. Site Antiquity: Puranic era (Asit Muni)."},
  {id:237, era:-3100, title:"Tungnath Temple", state:"Uttarakhand", lat:30.4947, lng:79.2167, desc:"Tungnath Temple — Uttarakhand. Site Antiquity: Mahabharata era (Highest Shiva temple, built by Pandavas)."},
  {id:238, era:-3000, title:"Haridwar Mansa Devi Temple", state:"Uttarakhand", lat:29.9617, lng:78.163, desc:"Haridwar Mansa Devi Temple — Uttarakhand. Site Antiquity: Puranic era (Emerged from Lord Shiva's mind)."},
  {id:239, era:-10000, title:"Neelkanth Mahadev Temple", state:"Uttarakhand", lat:30.1539, lng:78.4121, desc:"Neelkanth Mahadev Temple — Uttarakhand. Site Antiquity: Satya Yuga (Samudra Manthan - Shiva consumed poison here)."},
  {id:240, era:-3000, title:"Chandrabadni Temple", state:"Uttarakhand", lat:30.2993, lng:78.5649, desc:"Chandrabadni Temple — Uttarakhand. Site Antiquity: Ancient Shakti Peetha (Sati's torso fell here)."},
  {id:241, era:-1000, title:"Dhari Devi Temple", state:"Uttarakhand", lat:30.288, lng:78.7843, desc:"Dhari Devi Temple — Uttarakhand. Site Antiquity: Puranic era (Guardian deity of Uttarakhand)."},
  {id:242, era:-3000, title:"Surkhanda Devi Temple", state:"Uttarakhand", lat:30.4337, lng:78.3143, desc:"Surkhanda Devi Temple — Uttarakhand. Site Antiquity: Ancient Shakti Peetha (Sati's head fell here)."},
  {id:243, era:-3100, title:"Budha Kedar Temple", state:"Uttarakhand", lat:30.4167, lng:78.8167, desc:"Budha Kedar Temple — Uttarakhand. Site Antiquity: Mahabharata era (Pandavas encountered Shiva here)."},
  {id:244, era:-3100, title:"Deoria Tal Tungnath", state:"Uttarakhand", lat:30.4969, lng:79.2195, desc:"Deoria Tal Tungnath — Uttarakhand. Site Antiquity: Mahabharata era (Yaksha Prashna site)."},
  {id:245, era:-10000, title:"Triyuginarayan Temple", state:"Uttarakhand", lat:30.67, lng:79.0131, desc:"Triyuginarayan Temple — Uttarakhand. Site Antiquity: Satya Yuga (Marriage site of Lord Shiva and Goddess Parvati)."},
  {id:246, era:2005, title:"Akshardham Temple, Delhi", state:"Delhi", lat:28.6127, lng:77.2773, desc:"Akshardham Temple, Delhi — Delhi. Est. 2005 CE."},
  {id:247, era:1986, title:"Lotus Temple, Delhi", state:"Delhi", lat:28.5535, lng:77.2588, desc:"Lotus Temple, Delhi — Delhi. Est. 1986 CE."},
  {id:248, era:1938, title:"Birla Mandir (Laxminarayan), Delhi", state:"Delhi", lat:28.6338, lng:77.1971, desc:"Birla Mandir (Laxminarayan), Delhi — Delhi. Est. 1938 CE."},
  {id:249, era:1974, title:"Chattarpur Temple", state:"Delhi", lat:28.503, lng:77.1653, desc:"Chattarpur Temple — Delhi. Est. 1974 CE."},
  {id:250, era:-3100, title:"Kalkaji Temple", state:"Delhi", lat:28.538, lng:77.2616, desc:"Kalkaji Temple — Delhi. Site Antiquity: Mahabharata era (Pandavas worshipped Kali here)."},
  {id:251, era:-3100, title:"Yogmaya Temple, Delhi", state:"Delhi", lat:28.5183, lng:77.2136, desc:"Yogmaya Temple, Delhi — Delhi. Site Antiquity: Mahabharata era (Dedicated to Lord Krishna's sister)."},
  {id:252, era:1998, title:"ISKCON Temple, Delhi", state:"Delhi", lat:28.6285, lng:77.2474, desc:"ISKCON Temple, Delhi — Delhi. Est. 1998 CE."},
  {id:253, era:1960, title:"Sai Baba Temple, Lodhi Road", state:"Delhi", lat:28.5977, lng:77.2306, desc:"Sai Baba Temple, Lodhi Road — Delhi. Est. 1960 CE."},
  {id:254, era:1589, title:"Golden Temple (Harmandir Sahib), Amritsar", state:"Punjab", lat:31.62, lng:74.8765, desc:"Golden Temple (Harmandir Sahib), Amritsar — Punjab. Est. 1589 CE."},
  {id:255, era:1921, title:"Durgiana Temple, Amritsar", state:"Punjab", lat:31.6301, lng:74.8777, desc:"Durgiana Temple, Amritsar — Punjab. Est. 1921 CE."},
  {id:256, era:700, title:"Kali Devi Temple, Amritsar", state:"Punjab", lat:31.635, lng:74.865, desc:"Kali Devi Temple, Amritsar — Punjab. Est. 700 CE."},
  {id:257, era:-3000, title:"Mata Mansa Devi Temple, Panchkula", state:"Punjab", lat:30.7, lng:76.85, desc:"Mata Mansa Devi Temple, Panchkula — Punjab. Site Antiquity: Ancient Shakti Peetha."},
  {id:258, era:-3100, title:"Vaishnodevi Temple, Katra", state:"Jammu & Kashmir", lat:33.0302, lng:74.947, desc:"Vaishnodevi Temple, Katra — Jammu & Kashmir. Site Antiquity: Mahabharata era / Treta Yuga origins."},
  {id:259, era:1857, title:"Raghunath Temple, Jammu", state:"Jammu & Kashmir", lat:32.7266, lng:74.8572, desc:"Raghunath Temple, Jammu — Jammu & Kashmir. Est. 1857 CE."},
  {id:260, era:-200, title:"Shankaracharya Temple, Srinagar", state:"Jammu & Kashmir", lat:34.09, lng:74.88, desc:"Shankaracharya Temple, Srinagar — Jammu & Kashmir. Site Antiquity: Ancient Jyoteshwara site (~200 BCE). Visited by Adi Shankara."},
  {id:261, era:-5000, title:"Kheer Bhawani Temple", state:"Jammu & Kashmir", lat:34.21, lng:74.98, desc:"Kheer Bhawani Temple — Jammu & Kashmir. Site Antiquity: Treta Yuga (Moved here from Lanka after Ravana's defeat)."},
  {id:262, era:1000, title:"Deori Temple, Ranchi", state:"Jharkhand", lat:23.361, lng:85.3353, desc:"Deori Temple, Ranchi — Jharkhand. Est. ~1000 CE."},
  {id:263, era:1691, title:"Jagannath Temple, Ranchi", state:"Jharkhand", lat:23.3432, lng:85.335, desc:"Jagannath Temple, Ranchi — Jharkhand. Est. 1691 CE."},
  {id:264, era:300, title:"Pahari Mandir, Ranchi", state:"Jharkhand", lat:23.361, lng:85.318, desc:"Pahari Mandir, Ranchi — Jharkhand. Est. ~300 CE."},
  {id:265, era:-5000, title:"Baidyanath Dham, Deoghar", state:"Jharkhand", lat:24.4875, lng:86.6953, desc:"Baidyanath Dham, Deoghar — Jharkhand. Site Antiquity: Treta Yuga (Jyotirlinga established by Ravana)."},
  {id:266, era:-3000, title:"Basukhinath Temple", state:"Jharkhand", lat:24.4, lng:87.0833, desc:"Basukhinath Temple — Jharkhand. Site Antiquity: Puranic era."},
  {id:267, era:1089, title:"Bhoramdeo Temple", state:"Chhattisgarh", lat:22.035, lng:81.365, desc:"Bhoramdeo Temple — Chhattisgarh. Est. 1089 CE."},
  {id:268, era:-3000, title:"Danteshwari Temple, Dantewada", state:"Chhattisgarh", lat:18.898, lng:81.347, desc:"Danteshwari Temple, Dantewada — Chhattisgarh. Site Antiquity: Ancient Shakti Peetha (Sati's tooth fell here)."},
  {id:269, era:-1000, title:"Mahamaya Temple, Ratanpur", state:"Chhattisgarh", lat:22.2843, lng:82.1777, desc:"Mahamaya Temple, Ratanpur — Chhattisgarh. Site Antiquity: Ancient Shakti Shrine. Current structure: 1050 CE."},
  {id:270, era:600, title:"Rajiv Lochan Temple, Rajim", state:"Chhattisgarh", lat:20.9648, lng:81.882, desc:"Rajiv Lochan Temple, Rajim — Chhattisgarh. Est. 600 CE."},
  {id:271, era:-100, title:"Bambleshwari Temple, Dongargarh", state:"Chhattisgarh", lat:21.178, lng:80.746, desc:"Bambleshwari Temple, Dongargarh — Chhattisgarh. Site Antiquity: King Vikramaditya era."},
  {id:272, era:600, title:"Laxman Temple, Sirpur", state:"Chhattisgarh", lat:21.463, lng:82.3063, desc:"Laxman Temple, Sirpur — Chhattisgarh. Est. 600 CE (Brick temple)."},
  {id:273, era:1846, title:"Govindajee Temple, Imphal", state:"Manipur", lat:24.8213, lng:93.9368, desc:"Govindajee Temple, Imphal — Manipur. Est. 1846 CE."},
  {id:274, era:1846, title:"Vishnu Temple, Imphal", state:"Manipur", lat:24.8172, lng:93.9365, desc:"Vishnu Temple, Imphal — Manipur. Est. 1846 CE."},
  {id:275, era:1700, title:"Shri Shri Bijoy Govinda Temple", state:"Manipur", lat:24.8194, lng:93.9351, desc:"Shri Shri Bijoy Govinda Temple — Manipur. Est. ~1700 CE."},
  {id:276, era:-3000, title:"Brahma Kund, Tawang", state:"Arunachal Pradesh", lat:27.5861, lng:91.8594, desc:"Brahma Kund, Tawang — Arunachal Pradesh. Site Antiquity: Puranic era."},
  {id:277, era:-5000, title:"Parasuram Kund", state:"Arunachal Pradesh", lat:28.0, lng:96.3, desc:"Parasuram Kund — Arunachal Pradesh. Site Antiquity: Treta Yuga (Sage Parashurama washed his axe here)."},
  {id:278, era:1900, title:"Thakurbari Temple, Gangtok", state:"Sikkim", lat:27.3314, lng:88.6138, desc:"Thakurbari Temple, Gangtok — Sikkim. Est. 1900 CE."},
  {id:279, era:-5000, title:"Hanuman Tok, Gangtok", state:"Sikkim", lat:27.3457, lng:88.6205, desc:"Hanuman Tok, Gangtok — Sikkim. Site Antiquity: Treta Yuga (Hanuman rested here with Sanjeevani)."},
  {id:280, era:-3100, title:"Hatkoti Mahadev", state:"Himachal Pradesh", lat:31.2049, lng:77.7619, desc:"Hatkoti Mahadev — Himachal Pradesh. Site Antiquity: Mahabharata era."},
  {id:281, era:-1000, title:"Mangeshi Temple, Goa", state:"Goa", lat:15.4052, lng:73.9681, desc:"Mangeshi Temple, Goa — Goa. Site Antiquity: Puranic Shiva legend. Current structure: 1560 CE."},
  {id:282, era:-1000, title:"Shanta Durga Temple, Goa", state:"Goa", lat:15.3745, lng:74.0019, desc:"Shanta Durga Temple, Goa — Goa. Site Antiquity: Puranic era (Durga pacified Shiva and Vishnu)."},
  {id:283, era:-1000, title:"Mahalasa Narayani Temple, Goa", state:"Goa", lat:15.3951, lng:73.9743, desc:"Mahalasa Narayani Temple, Goa — Goa. Site Antiquity: Puranic era (Vishnu's Mohini avatar)."},
  {id:284, era:1000, title:"Mahalaxmi Temple, Panaji", state:"Goa", lat:15.4909, lng:73.8278, desc:"Mahalaxmi Temple, Panaji — Goa. Est. 1000 CE."},
  {id:285, era:-3000, title:"Ramnath Temple, Bandivade", state:"Goa", lat:15.2784, lng:74.0123, desc:"Ramnath Temple, Bandivade — Goa. Site Antiquity: Linked to Lord Rama's worship of Shiva."},
  {id:286, era:-3000, title:"Mahanandi Temple", state:"Andhra Pradesh", lat:15.4594, lng:78.6506, desc:"Mahanandi Temple — Andhra Pradesh. Site Antiquity: Puranic era."},
  {id:287, era:-10000, title:"Penna Ahobilam Narasimha", state:"Andhra Pradesh", lat:15.057, lng:78.753, desc:"Penna Ahobilam Narasimha — Andhra Pradesh. Site Antiquity: Satya Yuga (Footprint of Lord Narasimha)."},
  {id:288, era:-5000, title:"Sree Lakshmi Narasimha, Antarvedi", state:"Andhra Pradesh", lat:16.4961, lng:81.8043, desc:"Sree Lakshmi Narasimha, Antarvedi — Andhra Pradesh. Site Antiquity: Treta Yuga (Sage Vashistha)."},
  {id:289, era:-5000, title:"Veerabhadra Temple, Lepakshi", state:"Andhra Pradesh", lat:13.8022, lng:77.6059, desc:"Veerabhadra Temple, Lepakshi — Andhra Pradesh. Site Antiquity: Treta Yuga (Lord Rama said 'Le Pakshi' to Jatayu here). Current structure: 1583 CE."},
  {id:290, era:800, title:"Sri Mukhalingam, Srikakulam", state:"Andhra Pradesh", lat:18.729, lng:84.288, desc:"Sri Mukhalingam, Srikakulam — Andhra Pradesh. Est. 800 CE."},
  {id:291, era:-3000, title:"Nellaiappar Temple, Tirunelveli", state:"Tamil Nadu", lat:8.7317, lng:77.7021, desc:"Nellaiappar Temple, Tirunelveli — Tamil Nadu. Site Antiquity: Puranic (Associated with Sage Agastya & Lord Rama)."},
  {id:292, era:-3000, title:"Arulmigu Subramaniya, Tiruttani", state:"Tamil Nadu", lat:13.1862, lng:79.6145, desc:"Arulmigu Subramaniya, Tiruttani — Tamil Nadu. Site Antiquity: Puranic (Murugan rested here after defeating Surapadman)."},
  {id:293, era:1500, title:"Krishnapuram Mahadeva Temple", state:"Tamil Nadu", lat:10.902, lng:77.14, desc:"Krishnapuram Mahadeva Temple — Tamil Nadu. Est. ~1500 CE."},
  {id:294, era:-1000, title:"Mukurthi Shiv Temple", state:"Tamil Nadu", lat:11.4175, lng:76.5478, desc:"Mukurthi Shiv Temple — Tamil Nadu. Site Antiquity: Ancient Hill Shrine."},
  {id:295, era:700, title:"Srivilliputtur Andal Temple", state:"Tamil Nadu", lat:9.5088, lng:77.6326, desc:"Srivilliputtur Andal Temple — Tamil Nadu. Est. ~700 CE (Birthplace of Andal)."},
  {id:296, era:-300, title:"Koodal Azhagar Temple, Madurai", state:"Tamil Nadu", lat:9.9195, lng:78.1193, desc:"Koodal Azhagar Temple, Madurai — Tamil Nadu. Site Antiquity: Sangam era."},
  {id:297, era:-1000, title:"Thiruchuli Bhuminatha Temple", state:"Tamil Nadu", lat:10.04, lng:77.928, desc:"Thiruchuli Bhuminatha Temple — Tamil Nadu. Site Antiquity: Puranic era."},
  {id:298, era:-10000, title:"Papanasam Shiva Temple", state:"Tamil Nadu", lat:8.9615, lng:77.363, desc:"Papanasam Shiva Temple — Tamil Nadu. Site Antiquity: Satya Yuga (Agastya got vision of Shiva-Parvati marriage here)."},
  {id:299, era:-3000, title:"Suchindram Thanumalayan", state:"Tamil Nadu", lat:8.1561, lng:77.4658, desc:"Suchindram Thanumalayan — Tamil Nadu. Site Antiquity: Puranic era (Indra's curse relieved, Anasuya legend)."},
  {id:300, era:-1000, title:"Kalyana Venkataramana, Tirupati area", state:"Tamil Nadu", lat:13.24, lng:79.585, desc:"Kalyana Venkataramana, Tirupati area — Tamil Nadu. Site Antiquity: Puranic era."},
  {id:301, era:-5000, title:"Veerabhadra Temple, Lepakshi", state:"Karnataka", lat:13.8022, lng:77.6059, desc:"Veerabhadra Temple, Lepakshi — Karnataka. Site Antiquity: Treta Yuga (Jatayu legend). Current structure: 1583 CE."},
  {id:302, era:-3000, title:"Yellamma Temple, Saundatti", state:"Karnataka", lat:15.7771, lng:75.1164, desc:"Yellamma Temple, Saundatti — Karnataka. Site Antiquity: Ancient Renuka Devi / Parasurama legend."},
  {id:303, era:1100, title:"Siddeswara Temple, Haveri", state:"Karnataka", lat:14.7941, lng:75.396, desc:"Siddeswara Temple, Haveri — Karnataka. Est. 1100 CE."},
  {id:304, era:1191, title:"Trikuteshwara Temple, Gadag", state:"Karnataka", lat:15.436, lng:75.622, desc:"Trikuteshwara Temple, Gadag — Karnataka. Est. 1191 CE."},
  {id:305, era:1112, title:"Mahadeva Temple, Itagi", state:"Karnataka", lat:15.404, lng:75.763, desc:"Mahadeva Temple, Itagi — Karnataka. Est. 1112 CE."},
  {id:306, era:1100, title:"Doddabasappa Temple, Dambal", state:"Karnataka", lat:15.389, lng:75.668, desc:"Doddabasappa Temple, Dambal — Karnataka. Est. 1100 CE."},
  {id:307, era:1100, title:"Kalleshwara Temple, Bagali", state:"Karnataka", lat:15.156, lng:76.607, desc:"Kalleshwara Temple, Bagali — Karnataka. Est. 1100 CE."},
  {id:308, era:1100, title:"Kedareshwara Temple, Balligavi", state:"Karnataka", lat:14.394, lng:75.818, desc:"Kedareshwara Temple, Balligavi — Karnataka. Est. 1100 CE."},
  {id:309, era:700, title:"Chandrabhaga Temple, Jhalawar", state:"Rajasthan", lat:24.597, lng:76.161, desc:"Chandrabhaga Temple, Jhalawar — Rajasthan. Est. 700 CE."},
  {id:310, era:900, title:"Harshat Mata Temple, Abhaneri", state:"Rajasthan", lat:27.004, lng:76.606, desc:"Harshat Mata Temple, Abhaneri — Rajasthan. Est. 900 CE."},
  {id:311, era:-3000, title:"Osiyan Sachiya Mata", state:"Rajasthan", lat:26.7273, lng:72.915, desc:"Osiyan Sachiya Mata — Rajasthan. Site Antiquity: Ancient Shakti worship."},
  {id:312, era:1485, title:"Jambheshwar Temple, Mukam", state:"Rajasthan", lat:27.364, lng:73.006, desc:"Jambheshwar Temple, Mukam — Rajasthan. Est. 1485 CE."},
  {id:313, era:1000, title:"Gorakhnath Temple, Gorakhpur", state:"Uttar Pradesh", lat:26.7606, lng:83.3732, desc:"Gorakhnath Temple, Gorakhpur — Uttar Pradesh. Est. 1000 CE (Nath Sampradaya)."},
  {id:314, era:-3000, title:"Maa Vindhyavasini Temple, Mirzapur", state:"Uttar Pradesh", lat:25.1487, lng:82.5843, desc:"Maa Vindhyavasini Temple, Mirzapur — Uttar Pradesh. Site Antiquity: Ancient Shakti Peetha."},
  {id:315, era:-10000, title:"Naimisharanya", state:"Uttar Pradesh", lat:26.9997, lng:80.5065, desc:"Naimisharanya — Uttar Pradesh. Site Antiquity: Satya Yuga (Where all Puranas were narrated)."},
  {id:316, era:-1000, title:"Sheetala Mata, Agra", state:"Uttar Pradesh", lat:27.1767, lng:78.0081, desc:"Sheetala Mata, Agra — Uttar Pradesh. Site Antiquity: Puranic era."},
  {id:317, era:-5000, title:"Mankameshwar Temple, Agra", state:"Uttar Pradesh", lat:27.2046, lng:78.02, desc:"Mankameshwar Temple, Agra — Uttar Pradesh. Site Antiquity: Dwapara Yuga (Lord Shiva stopped here to see child Krishna)."},
  {id:318, era:1822, title:"Swaminarayan Temple, Ahmedabad", state:"Gujarat", lat:23.0225, lng:72.5714, desc:"Swaminarayan Temple, Ahmedabad — Gujarat. Est. 1822 CE."},
  {id:319, era:1878, title:"Jagannath Temple, Ahmedabad", state:"Gujarat", lat:23.0267, lng:72.6002, desc:"Jagannath Temple, Ahmedabad — Gujarat. Est. 1878 CE."},
  {id:320, era:400, title:"Hatkeshwar Temple, Vadodara", state:"Gujarat", lat:22.3071, lng:73.1812, desc:"Hatkeshwar Temple, Vadodara — Gujarat. Est. 400 CE."},
  {id:321, era:-3100, title:"Nagnath Temple, Kathiawar", state:"Gujarat", lat:21.538, lng:70.449, desc:"Nagnath Temple, Kathiawar — Gujarat. Site Antiquity: Mahabharata era / Ancient Jyotirlinga link."},
  {id:322, era:-3000, title:"Tulja Bhavani Temple, Osmanabad", state:"Maharashtra", lat:17.975, lng:76.0753, desc:"Tulja Bhavani Temple, Osmanabad — Maharashtra. Site Antiquity: Ancient Shakti Peetha. Kuladevi of Chhatrapati Shivaji Maharaj."},
  {id:323, era:-3000, title:"Renuka Devi Temple, Mahur", state:"Maharashtra", lat:19.84, lng:77.918, desc:"Renuka Devi Temple, Mahur — Maharashtra. Site Antiquity: Ancient Shakti Peetha (Mother of Lord Parashurama)."},
  {id:324, era:-3000, title:"Saptashringi Temple, Nashik", state:"Maharashtra", lat:20.466, lng:73.788, desc:"Saptashringi Temple, Nashik — Maharashtra. Site Antiquity: Ancient Shakti Peetha (Half Peetha)."},
  {id:325, era:-3100, title:"Ekveera Devi, Karla", state:"Maharashtra", lat:18.7757, lng:73.461, desc:"Ekveera Devi, Karla — Maharashtra. Site Antiquity: Mahabharata era (Pandavas built the shrine in one night legend)."},
  {id:326, era:-3000, title:"Ambabai Temple, Kolhapur", state:"Maharashtra", lat:16.7028, lng:74.2312, desc:"Ambabai Temple, Kolhapur — Maharashtra. Site Antiquity: Ancient Maha Shakti Peetha."},
  {id:327, era:1109, title:"Kopeshwar Temple, Khidrapur", state:"Maharashtra", lat:16.557, lng:75.211, desc:"Kopeshwar Temple, Khidrapur — Maharashtra. Est. 1109 CE (Legend of Daksha Yagna)."},
  {id:328, era:1200, title:"Gondeshwar Temple, Sinnar", state:"Maharashtra", lat:19.85, lng:73.981, desc:"Gondeshwar Temple, Sinnar — Maharashtra. Est. 1200 CE."},
  {id:329, era:-3000, title:"Shaktipeeth Tara Tarini", state:"Odisha", lat:19.8847, lng:85.1083, desc:"Shaktipeeth Tara Tarini — Odisha. Site Antiquity: Ancient Shakti Peetha."},
  {id:330, era:-1000, title:"Charchika Temple, Banki", state:"Odisha", lat:20.37, lng:85.526, desc:"Charchika Temple, Banki — Odisha. Site Antiquity: Parashurama legend."},
  {id:331, era:-1000, title:"Subarnapur Sureswari Temple", state:"Odisha", lat:20.833, lng:83.9, desc:"Subarnapur Sureswari Temple — Odisha. Site Antiquity: Parashurama legend."},
  {id:332, era:-1000, title:"Maa Bhagabati, Kantilo", state:"Odisha", lat:20.35, lng:85.183, desc:"Maa Bhagabati, Kantilo — Odisha. Site Antiquity: Puranic era."},
  {id:333, era:-1000, title:"Vaidyeshwara Temple, Vaitheeswaran Koil", state:"Tamil Nadu", lat:11.27, lng:79.6368, desc:"Vaidyeshwara Temple, Vaitheeswaran Koil — Tamil Nadu. Site Antiquity: Puranic (Jatayu's pyre, Mars planetary deity)."},
  {id:334, era:-1000, title:"Thiruvidaimaruthur Mahalingeswarar", state:"Tamil Nadu", lat:10.871, lng:79.312, desc:"Thiruvidaimaruthur Mahalingeswarar — Tamil Nadu. Site Antiquity: Puranic."},
  {id:335, era:-10000, title:"Papanasanathar Temple, Papanasam", state:"Tamil Nadu", lat:8.9615, lng:77.363, desc:"Papanasanathar Temple, Papanasam — Tamil Nadu. Site Antiquity: Satya Yuga (Agastya vision)."},
  {id:336, era:-3000, title:"Abirami Amman Temple, Thirukadaiyur", state:"Tamil Nadu", lat:11.054, lng:79.856, desc:"Abirami Amman Temple, Thirukadaiyur — Tamil Nadu. Site Antiquity: Puranic (Markandeya saved from Yama by Shiva)."},
  {id:337, era:-1000, title:"Kuthanur Saraswathi Temple", state:"Tamil Nadu", lat:10.9168, lng:79.3695, desc:"Kuthanur Saraswathi Temple — Tamil Nadu. Site Antiquity: Puranic."},
  {id:338, era:-1000, title:"Brahmapureeswarar Temple, Tirupattur", state:"Tamil Nadu", lat:10.7714, lng:79.383, desc:"Brahmapureeswarar Temple, Tirupattur — Tamil Nadu. Site Antiquity: Brahma's legend."},
  {id:339, era:-3000, title:"Kalahasti (alt coord)", state:"Andhra Pradesh", lat:13.7498, lng:79.6984, desc:"Kalahasti (alt coord) — Andhra Pradesh. Site Antiquity: Puranic era."},
  {id:340, era:900, title:"Tripurantakeswara Temple, Ballari", state:"Karnataka", lat:15.1394, lng:76.9214, desc:"Tripurantakeswara Temple, Ballari — Karnataka. Est. 900 CE."},
  {id:341, era:900, title:"Kudalasangama Temple", state:"Karnataka", lat:16.1717, lng:76.0806, desc:"Kudalasangama Temple — Karnataka. Est. 900 CE (Associated with Basavanna)."},
  {id:342, era:900, title:"Panchalingeswara Temple, Govindanahalli", state:"Karnataka", lat:13.005, lng:76.975, desc:"Panchalingeswara Temple, Govindanahalli — Karnataka. Est. 900 CE."},
  {id:343, era:-1000, title:"Jambunatha Temple, Thiruvannamalai area", state:"Tamil Nadu", lat:12.234, lng:79.069, desc:"Jambunatha Temple, Thiruvannamalai area — Tamil Nadu. Site Antiquity: Puranic."},
  {id:344, era:900, title:"Uttaramerur Sundaravarada Perumal", state:"Tamil Nadu", lat:12.6033, lng:79.7549, desc:"Uttaramerur Sundaravarada Perumal — Tamil Nadu. Est. 900 CE."},
  {id:345, era:-200, title:"Keezhadi Murugan Temple", state:"Tamil Nadu", lat:9.875, lng:78.249, desc:"Keezhadi Murugan Temple — Tamil Nadu. Site Antiquity: Sangam era."},
  {id:346, era:-1000, title:"Agasthiyampalli Agastheeswara", state:"Tamil Nadu", lat:11.408, lng:79.776, desc:"Agasthiyampalli Agastheeswara — Tamil Nadu. Site Antiquity: Sage Agastya legend."},
  {id:347, era:-3000, title:"Subrahmanya Swami, Tiruttani", state:"Tamil Nadu", lat:13.1862, lng:79.6145, desc:"Subrahmanya Swami, Tiruttani — Tamil Nadu. Site Antiquity: Puranic."},
  {id:348, era:600, title:"Srivilliputhur Nachiyar Kovil", state:"Tamil Nadu", lat:9.5088, lng:77.6326, desc:"Srivilliputhur Nachiyar Kovil — Tamil Nadu. Est. 600 CE."},
  {id:349, era:-3100, title:"Thanesar Sthaneshwar Mahadev", state:"Haryana", lat:29.9753, lng:76.8192, desc:"Thanesar Sthaneshwar Mahadev — Haryana. Site Antiquity: Mahabharata era (Worshipped by Pandavas before Kurukshetra war)."},
  {id:350, era:-3000, title:"Devi Talab Temple, Jalandhar", state:"Punjab", lat:31.326, lng:75.5762, desc:"Devi Talab Temple, Jalandhar — Punjab. Site Antiquity: Ancient Shakti Peetha (Right breast of Sati fell here)."}
];

/* ══════════════════════════════════════════════════════
   AUTOMATICALLY FORMAT THE DATA FOR OUR UI
   This converts RAW_SITES into the exact format our map needs!
   ══════════════════════════════════════════════════════ */
const SITES = RAW_SITES.map(site => {
    // Decide color based on keyword in title (just to add variety)
    let siteColor = "#E8671A"; // Default Orange (Temple)
    let siteType = "Temple";
    
    if (site.title.toLowerCase().includes("cave")) {
        siteColor = "#2D6A4F"; // Green for caves
        siteType = "Cave Temple";
    } else if (site.title.toLowerCase().includes("math") || site.title.toLowerCase().includes("stupa")) {
        siteColor = "#f4a340"; // Yellow for monuments/maths
        siteType = "Monument";
    }

    return {
        id: site.id,
        era: site.era,
        title: site.title,
        state: site.state,
        type: siteType,
        color: siteColor,
        lat: site.lat,
        lng: site.lng,
        desc: site.desc,
        history: `Detailed historical record for ${site.title} is coming soon! It was established around ${site.era < 0 ? Math.abs(site.era) + ' BCE' : site.era + ' CE'}.`,
        vlogs: [
            { 
                author: "Yatri", 
                date: "2024", 
                text: `Visited ${site.title} recently. An incredible piece of architecture in ${site.state}!`, 
                tags: ["Heritage", site.state.replace(/\s/g, '')] 
            }
        ]
    };
});

/* ══════════════════════════════════════════════════════
   GLOBAL VLOGS
   ══════════════════════════════════════════════════════ */
const GLOBAL_VLOGS = [];

/* ══════════════════════════════════════════════════════
   MAP INITIALISATION
   ══════════════════════════════════════════════════════ */
const map = L.map('map', {
  center: [22.0, 80.0],
  zoom: 5,
  zoomControl: true,
  scrollWheelZoom: true,
});

// Dark tile layer (Stadia Alidade Smooth Dark)
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; Stadia Maps, &copy; OpenMapTiles, &copy; OpenStreetMap',
  maxZoom: 20,
}).addTo(map);

/* ── MARKER CREATION ─────────────────────────────── */
function makeMarkerIcon(site) {
  return L.divIcon({
    className: '',
    html: `<div class="cm" style="background:${site.color}cc;border-color:${site.color}"><span class="mi">🛕</span></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
  });
}

const markerMap = {};

SITES.forEach(site => {
  const m = L.marker([site.lat, site.lng], { icon: makeMarkerIcon(site) });
  m.bindPopup(() => {
    const eraStr = site.era < 0 ? `${Math.abs(site.era)} BCE` : `${site.era} CE`;
    return `
      <div class="popup-inner">
        <div class="popup-era-tag">${eraStr} · ${site.type}</div>
        <div class="popup-title">${site.title}</div>
        <div class="popup-state">📍 ${site.state}</div>
        <div class="popup-desc">${site.desc}</div>
        <div class="popup-actions">
          <button class="popup-btn btn-history" onclick="showHistory(${site.id})"><span class="btn-icon">📜</span>History</button>
          <button class="popup-btn btn-trip"    onclick="planTrip('${site.title.replace(/'/g,"\\'")}','${site.state}')"><span class="btn-icon">🏨</span>Plan Trip</button>
          <button class="popup-btn btn-vlogs"   onclick="showSiteVlogs(${site.id})"><span class="btn-icon">📖</span>Vlogs</button>
        </div>
      </div>`;
  }, { maxWidth: 270, className: '' });
  markerMap[site.id] = m;
});

/* ══════════════════════════════════════════════════════
   ERA SLIDER LOGIC
   ══════════════════════════════════════════════════════ */
function updateEra(value) {
    let year = Number(value);
    let periodText = "";

    // 1. Always make sure the text is visible!
    document.getElementById("eraprint").style.visibility = "visible";
    document.getElementById("eraprint").style.display = "block";

    // 2. Added ancient timeline names!
    if      (year <= -8000) periodText = "Satya Yuga / Puranic Era";
    else if (year <= -4000) periodText = "Treta Yuga / Ramayana Era";
    else if (year <= -3000) periodText = "Dvapara Yuga / Mahabharata Era";
    else if (year <= -1500) periodText = "Vedic Age";
    else if (year <= -200)  periodText = "Classical Period";
    else if (year <= 600)   periodText = "Early Historic";
    else if (year <= 1200)  periodText = "Early Medieval";
    else if (year <= 1526)  periodText = "Late Medieval";
    else if (year <= 1857)  periodText = "Mughal & Maratha Era";
    else if (year <= 1947)  periodText = "Colonial Era";
    else                    periodText = "Post-Independence";

    // Update display (Use Math.abs so it says "10000 BCE" instead of "-10000 BCE")
    document.getElementById("era-number").textContent = Math.abs(year);
    document.getElementById("era-bce-ce").textContent = year < 0 ? "BCE" : "CE";
    document.getElementById("eraprint").textContent   = periodText;

    const slider = document.getElementById("erarange");
    const min = parseInt(slider.min), max = parseInt(slider.max);
    const pct = ((year - min) / (max - min) * 100).toFixed(1);
    slider.style.background = `linear-gradient(90deg, #b04a08 0%, #f4a340 ${pct}%, rgba(255,255,255,0.15) ${pct}%)`;

    // Show/hide markers and update site list
    let count = 0;
    const listEl = document.getElementById("siteList");
    listEl.innerHTML = "";

    // ... (Keep the rest of the function EXACTLY the same below this line!) ...

    SITES.forEach(site => {
        const visible = site.era <= year;
        if (visible) {
            if (!map.hasLayer(markerMap[site.id])) markerMap[site.id].addTo(map);
            count++;
        } else {
            if (map.hasLayer(markerMap[site.id])) map.removeLayer(markerMap[site.id]);
        }

        // Sidebar card
        const eraStr = site.era < 0 ? `${Math.abs(site.era)} BCE` : `${site.era} CE`;
        const card = document.createElement("div");
        card.className = "site-card" + (visible ? "" : " locked");
        card.innerHTML = `<div class="site-card-name">${site.title}</div>
                          <div class="site-card-meta">● ${eraStr} · ${site.state}</div>`;
        if (visible) {
            card.addEventListener("click", () => {
                map.flyTo([site.lat, site.lng], 11, { duration: 1.2 });
                setTimeout(() => markerMap[site.id].openPopup(), 1300);
            });
        }
        listEl.appendChild(card);
    });

    document.getElementById("siteCount").textContent = count;
}

/* ══════════════════════════════════════════════════════
   POPUP ACTIONS  (global scope — called from inline HTML)
   ══════════════════════════════════════════════════════ */
window.showHistory = function(id) {
    const site = SITES.find(s => s.id === id);
    if (!site) return;
    openModal(
        `📜 ${site.title}`,
        `<div style="color:rgba(255,255,255,.7);font-size:13px;line-height:1.8;font-style:italic;margin-bottom:14px">${site.history}</div>
         <div style="padding:10px 12px;border-radius:8px;background:rgba(212,160,23,.1);border:1px solid rgba(212,160,23,.3);font-size:11px;color:#c89040">
           📚 In the full app, this connects to the Wikipedia API for full articles, scholarly sources, and photo galleries.
         </div>`
    );
};

window.planTrip = function(name, state) {
    const hotels = [`${state} Heritage Haveli ★★★★★`, `The Palace Grand, ${state} ★★★★`, `Backpacker Dharamshala ★★★`, `Eco-Stay & Retreat ★★★★`];
    openModal(
        `🏨 Plan Trip to ${name}`,
        `<p style="color:rgba(255,255,255,.6);font-size:12px;margin-bottom:14px">Mock hotel listings near <strong style="color:#f4a340">${name}</strong>, ${state}</p>
         <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
           ${hotels.map(h => `<div style="padding:11px;border-radius:9px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);cursor:pointer" onmouseover="this.style.borderColor='rgba(244,163,64,.4)'" onmouseout="this.style.borderColor='rgba(255,255,255,.1)'">
             <div style="font-size:11px;font-weight:600;color:rgba(255,255,255,.8);margin-bottom:2px">${h}</div>
             <div style="font-size:10px;color:#8a6030">Mock price · Book now</div></div>`).join('')}
         </div>
         <div style="padding:9px 12px;border-radius:8px;background:rgba(45,106,79,.1);border:1px solid rgba(45,106,79,.3);font-size:11px;color:#6fcf97">
           🏨 Live version integrates MakeMyTrip, Booking.com, and local homestay APIs.
         </div>`
    );
};

window.showSiteVlogs = function(id) {
    const site = SITES.find(s => s.id === id);
    if (!site) return;
    openModal(`📖 Vlogs — ${site.title}`, renderVlogs(site.vlogs));
};

/* ══════════════════════════════════════════════════════
   MODAL
   ══════════════════════════════════════════════════════ */
function renderVlogs(vlogsArray) {
    if (vlogsArray.length === 0) return "<p>No community blogs yet. Be the first to write one!</p>";

    return vlogsArray.map(vlog => `
        <div style="background: #2a2a3e; padding: 15px; border-radius: 10px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.1);">
            <h3 style="color: #f4a340; margin-top: 0; margin-bottom: 5px;">${vlog.site}</h3>
            <p style="font-size: 12px; color: #aaa; margin-bottom: 10px;">By <strong>${vlog.author}</strong> • ${vlog.date}</p>
            <p style="line-height: 1.5;">${vlog.text}</p>

            <div style="margin-top: 15px; display: flex; align-items: center; gap: 10px;">
                <button class="like-btn" data-id="${vlog.id}" style="background: transparent; border: 1px solid #f4a340; color: #f4a340; padding: 5px 12px; border-radius: 5px; cursor: pointer; font-weight: bold; transition: 0.2s;">
                    ❤️ Like
                </button>
                <span style="color: #ccc; font-size: 14px;">${vlog.likes || 0} Likes</span>
            </div>

        </div>
    `).join("");
}

function openModal(title, bodyHtml) {
    document.querySelector(".modal-title").textContent = title;
    document.getElementById("modalBody").innerHTML = bodyHtml;
    document.getElementById("vlogModal").classList.add("open");
}

document.getElementById("modalClose").addEventListener("click", () => {
    document.getElementById("vlogModal").classList.remove("open");
});

document.getElementById("vlogModal").addEventListener("click", e => {
    if (e.target === document.getElementById("vlogModal"))
        document.getElementById("vlogModal").classList.remove("open");
});

document.getElementById("vlogBtn").addEventListener("click", () => {
    openModal("📖 Community Vlogs", renderVlogs(GLOBAL_VLOGS));
});

/* ══════════════════════════════════════════════════════
   TOAST
   ══════════════════════════════════════════════════════ */
let toastTimer;
function showToast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ── ERA JUMP BUTTONS ───────────────────────────── */
document.querySelectorAll(".jump-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const yr = parseInt(btn.dataset.year);
        const slider = document.getElementById("erarange");
        slider.value = yr;
        updateEra(yr);
        const label = yr < 0 ? `${Math.abs(yr)} BCE` : `${yr} CE`;
        showToast(`Jumped to ${label}`);
    });
});

/* ── INITIAL RENDER ─────────────────────────────── */
updateEra(document.getElementById("erarange").value);
/* ══════════════════════════════════════════════════════
   WRITE A VLOG — localStorage (Firebase-ready)
   ══════════════════════════════════════════════════════

   TO SWITCH TO FIREBASE LATER:
   1. npm install firebase  OR add Firebase CDN to index.html
   2. Uncomment the Firebase lines below
   3. Replace saveVlogLocally() call with saveVlogToFirebase()
   4. Replace loadUserVlogs() body with loadVlogsFromFirebase()
   ══════════════════════════════════════════════════════ */

/* ── LOCALSTORAGE HELPERS ───────────────────────── */
function saveVlogLocally(vlog) {
    const existing = JSON.parse(localStorage.getItem("bharatdarshnam_vlogs") || "[]");
    existing.unshift(vlog); // newest first
    localStorage.setItem("bharatdarshnam_vlogs", JSON.stringify(existing));
}

function loadUserVlogs() {
    return JSON.parse(localStorage.getItem("bharatdarshnam_vlogs") || "[]");
}

/* ══════════════════════════════════════════════════════
   WRITE A VLOG — FIREBASE REAL-TIME DATABASE
   ══════════════════════════════════════════════════════ */

/* ── OPEN / CLOSE WRITE VLOG MODAL ─────────────── */
document.getElementById("writeVlogBtn").addEventListener("click", () => {
    // Check if user is logged in before letting them write!
    if (!auth.currentUser) {
        showToast("⚠️ Please Sign In to write a vlog!");
        // Auto-open the login modal for them
        document.getElementById("loginModal").style.display = "flex";
        return;
    }
    
    document.getElementById("writeVlogModal").classList.add("open");
    // Auto-fill their email as the author
    document.getElementById("wv-author").value = auth.currentUser.email.split('@')[0];
});

document.getElementById("writeVlogClose").addEventListener("click", closeWriteVlogModal);

function closeWriteVlogModal() {
    document.getElementById("writeVlogModal").classList.remove("open");
    document.getElementById("wv-site").value   = "";
    document.getElementById("wv-text").value   = "";
    document.getElementById("wv-tags").value   = "";
    document.getElementById("wv-count").textContent = "0";
    document.getElementById("wv-error").textContent = "";
}

/* ── CHARACTER COUNTER ──────────────────────────── */
document.getElementById("wv-text").addEventListener("input", function () {
    document.getElementById("wv-count").textContent = this.value.length;
});

/* ── SUBMIT VLOG TO FIREBASE ────────────────────── */
document.getElementById("wv-submit").addEventListener("click", async () => {
    const author = document.getElementById("wv-author").value.trim();
    const site   = document.getElementById("wv-site").value.trim();
    const text   = document.getElementById("wv-text").value.trim();
    const tagsRaw = document.getElementById("wv-tags").value.trim();
    const errEl  = document.getElementById("wv-error");

    // Validation
    if (!author) { errEl.textContent = "⚠️ Please enter your name."; return; }
    if (!site)   { errEl.textContent = "⚠️ Please enter the heritage site name."; return; }
    if (text.length < 20) { errEl.textContent = "⚠️ Please write at least 20 characters."; return; }
    errEl.textContent = "Saving to database...";

    const tags = tagsRaw ? tagsRaw.split(",").map(t => t.trim()).filter(Boolean) : ["Heritage"];
    const now  = new Date();
    const date = now.toLocaleString("en-IN", { month: "short", year: "numeric" });

    try {
    // 🔥 Send the data to Firebase Firestore!
        await addDoc(collection(db, "vlogs"), {
            author: author,
            site: site,
            text: text,
            tags: tags,
            date: date,
            timestamp: Date.now(),
            likes: 0 // <-- ADD THIS LINE!
        });

        closeWriteVlogModal();
        showToast("✅ Vlog published to the community!");

    } catch (error) {
        errEl.textContent = "⚠️ Error saving: " + error.message;
    }
});

/* ── FETCH VLOGS FROM FIREBASE REAL-TIME ────────── */
// We use onSnapshot so the list updates instantly if someone else posts!
document.getElementById("vlogBtn").addEventListener("click", () => {
    // Show a loading message first
    openModal("📖 Community Vlogs", "<div style='padding: 20px; text-align: center; color: #f4a340;'>Fetching real-time vlogs from database...</div>");

    // Fetch from the 'vlogs' collection, ordered by newest first
    const q = query(collection(db, "vlogs"), orderBy("timestamp", "desc"));
    
onSnapshot(q, (snapshot) => {
            const firebaseVlogs = [];
            snapshot.forEach((doc) => {
                const data = doc.data(); // Grab the text data
                data.id = doc.id;        // Grab the unique Firebase ID!
                firebaseVlogs.push(data);
            });
        // Combine the live Firebase vlogs with your hardcoded GLOBAL_VLOGS
        const allVlogs = [...firebaseVlogs, ...GLOBAL_VLOGS];
        
        // Inject them into the modal!
        const modal = document.getElementById("vlogModal");
        if (modal.classList.contains("open")) {
            document.getElementById("modalBody").innerHTML = renderVlogs(allVlogs);
        }
    });
});
/* ══════════════════════════════════════════════════════
   LOGIN MODAL & FIREBASE AUTH LOGIC
   ══════════════════════════════════════════════════════ */
const loginModal = document.getElementById("loginModal");
const closeLoginModal = document.getElementById("closeLoginModal");

// Fix for Module Scoping (Keeps your slider working!)
window.updateEra = updateEra;

// Open Modal
document.getElementById("loginBtn").addEventListener("click", () => {
    if (auth.currentUser) {
        // If logged in, log out!
        signOut(auth).then(() => showToast("Logged out successfully!"));
    } else {
        // Open the box
        loginModal.style.display = "flex";
    }
});

// Close Modal
closeLoginModal.addEventListener("click", () => {
    loginModal.style.display = "none";
});

// Sign UP
document.getElementById("signUpBtn").addEventListener("click", () => {
    const email = document.getElementById("emailInput").value;
    const pass = document.getElementById("passwordInput").value;
    
    createUserWithEmailAndPassword(auth, email, pass)
        .then((userCred) => {
            showToast("Account Created!");
            loginModal.style.display = "none";
        })
        .catch((error) => showToast(error.message.replace("Firebase: ", "")));
});

// Sign IN
document.getElementById("signInBtn").addEventListener("click", () => {
    const email = document.getElementById("emailInput").value;
    const pass = document.getElementById("passwordInput").value;
    
    signInWithEmailAndPassword(auth, email, pass)
        .then((userCred) => {
            showToast("Signed In Successfully!");
            loginModal.style.display = "none";
        })
        .catch((error) => showToast("Wrong email or password!"));
});
/* ── HANDLE LIKES IN REAL-TIME ──────────────────── */
document.getElementById("modalBody").addEventListener("click", async (e) => {
    // Check if the user clicked a "like-btn"
    if (e.target.classList.contains("like-btn")) {
        
        // Stop users who aren't signed in from liking
        if (!auth.currentUser) {
            showToast("⚠️ Please Sign In to like this blog!");
            document.getElementById("loginModal").style.display = "flex";
            return;
        }

        const blogId = e.target.getAttribute("data-id");
        
        // If it's one of your hardcoded GLOBAL_VLOGS, it won't have a Firebase ID yet
        if (!blogId || blogId === "undefined") {
            showToast("This is a legacy post and cannot be liked!");
            return;
        }

        try {
            // Tell Firebase to add +1 to the likes!
            const blogRef = doc(db, "vlogs", blogId);
            await updateDoc(blogRef, {
                likes: increment(1)
            });
            // You don't even need to refresh the page! onSnapshot will instantly update the number.
        } catch (error) {
            console.error("Error liking blog:", error);
            showToast("⚠️ Error: Could not like post.");
        }
    }
});