require('dotenv').config();
const mongoose = require('mongoose');
const Artifact = require('./models/Artifact');

const data = [
  { title: "Pharaoh Khufu", category: "royal", description: "Khufu was a pharaoh of Egypt's 4th Dynasty, ruling around 2589–2566 BCE. He is best known for commissioning the Great Pyramid of Giza.", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Statue_of_Khufu_in_the_Cairo_Egyptian_Museum.jpg" },
  { title: "Hatshepsut", category: "royal", description: "One of ancient Egypt's most successful female pharaohs, ruling during the 18th Dynasty around 1479–1458 BCE.", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Seated_Statue_of_Hatshepsut_MET_Hatshepsut2012.jpg" },
  { title: "Thutmose III", category: "royal", description: "A powerful pharaoh of the 18th Dynasty, ruling around 1479–1425 BCE.", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/00/Thutmosis_III-2_%28cropped%29.jpg" },
  { title: "Akhenaten", category: "royal", description: "An unusual pharaoh of the 18th Dynasty who promoted the worship of Aten, the sun disk.", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cc/GD-EG-Caire-Mus%C3%A9e061.JPG" },
  { title: "Ramesses II", category: "royal", description: "One of Egypt's most famous pharaohs, ruling during the 19th Dynasty around 1279–1213 BCE.", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Ramses_II_British_Museum.jpg" },
  { title: "Nefertari", category: "royal", description: "The beloved Great Royal Wife of Ramesses II, known for her beautifully decorated tomb.", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Tomb_of_Nefertari_%2852785688763%29.jpg" },
  { title: "Nefertiti", category: "royal", description: "Great Royal Wife of Akhenaten, famous for her beautifully sculpted painted limestone bust.", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Nofretete_Neues_Museum.jpg" },
  { title: "Cleopatra VII", category: "royal", description: "The last active ruler of the Ptolemaic Kingdom of Egypt, ruling from 51–30 BCE.", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Kleopatra-VII.-Altes-Museum-Berlin1.jpg" },
  { title: "Osiris", category: "religious", description: "God of the afterlife, resurrection, and the dead.", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b4/La_Tombe_de_Horemheb_cropped.jpg" },
  { title: "Isis", category: "religious", description: "Major goddess associated with magic, motherhood, healing, and protection.", imageUrl: "https://www.jbhawkinsantiques.com/wp-content/uploads/2019/06/Egyptian-Isis-600.jpg" },
  { title: "Horus", category: "religious", description: "God associated with the sky, kingship, and protection.", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdBaHSRyvb0JHdrKJhsX2LQmcZK8Fg80ED366QqqTdbA&s=10" },
  { title: "Hathor", category: "religious", description: "Goddess associated with love, motherhood, music, beauty, joy, and fertility.", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD17Ef1ZgkokkG4X2lQYms-PwKB3BxaFixBoVvEjkVdwoTWWqh_hSJiic&s=10" },
  { title: "Ra", category: "religious", description: "The ancient Egyptian sun god, believed to travel across the sky each day in his solar boat.", imageUrl: "https://images.squarespace-cdn.com/content/v1/57b8372a15d5dbf599f77cb6/1594465435292-RVPBJXJ4BG2MZ3X8GHVZ/Ra.jpg" },
  { title: "Tutankhamun's Mummy", category: "funerary", description: "Young pharaoh of the 18th Dynasty who died around age 19. Discovered in KV62 in 1922.", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsYkA1pZXW9kofNW4GBjuNeYxnQ-FCVkGO0PXlOl9gwg&s" },
  { title: "Ramesses II's Mummy", category: "funerary", description: "Mummy of Ramesses the Great, showing a well-preserved elderly ruler.", imageUrl: "https://i0.wp.com/egypt-museum.com/wp-content/uploads/2022/08/Mummy-of-King-Ramesses-II-1.jpg" },
  { title: "Sarcophagus of Ken-Hor", category: "funerary", date: "c. 600 BCE", description: "An elaborately decorated wooden sarcophagus from the 26th Dynasty.", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Sarcofago_di_Ken-Hor_-_Akhmim-Sohag._26a_dinastia_%28intorno_al_600_a.C.%29_-_Neues_Museum%2C_Berlino.jpg", location: "Neues Museum, Berlin", dynasty: "26th Dynasty" },
  { title: "Heart Scarab", category: "funerary", description: "A funerary amulet placed over the heart of a mummy.", imageUrl: "https://static.wixstatic.com/media/4ba240_b28f3e91a7da44d89961c4cf83f4fdbd~mv2_d_2362_1925_s_2.jpg" },
  { title: "Eye of Horus (Wedjat)", category: "funerary", description: "A powerful symbol of protection, healing, and restoration.", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Collier_amulette_faience_bleue_et_or_2019.jpg" },
  { title: "Ankh Amulet", category: "funerary", description: "One of the most recognizable Egyptian symbols, representing life.", imageUrl: "https://i.etsystatic.com/21225252/r/il/2bb5d1/6324602946/il_1588xN.6324602946_sezu.jpg" },
  { title: "Canopic Jar (Falcon-headed)", category: "funerary", date: "c. 1550–1070 BCE", description: "Used during mummification to store internal organs.", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/35/Canopic_jars_%28casts%29%2C_Egypt%2C_945-712_BC_-_National_Museum_of_Natural_History%2C_United_States_-_DSC00557.jpg", location: "Walters Art Museum", dynasty: "New Kingdom" },
  { title: "The Rosetta Stone", category: "writing", date: "196 BCE", description: "A granodiorite stele inscribed with the same decree in three scripts.", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/89/Rosetta_stone.jpg", location: "British Museum, London", weight: "762 kg" },
  { title: "Papyrus of Ani", category: "writing", date: "c. 1275 BCE", description: "One of the best-preserved examples of the Book of the Dead, stretching over 24 metres.", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ee/BD_Weighing_of_the_Heart.jpg", location: "British Museum, London" },
  { title: "Shabtis", category: "everyday", date: "c. 2055–30 BCE", description: "Small worker figurines placed in tombs to carry out labour on behalf of the deceased.", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Shabty_of_Amunemhat%2C_ca._1400-1336_B.C.E.%2C50.128.jpg", dynasty: "Middle Kingdom onward" },
];

mongoose.connect('mongodb://physics:physics@ac-gih4rk2-shard-00-00.yjbdsch.mongodb.net:27017,ac-gih4rk2-shard-00-01.yjbdsch.mongodb.net:27017,ac-gih4rk2-shard-00-02.yjbdsch.mongodb.net:27017/egyptmuseum?ssl=true&replicaSet=atlas-1nbyad-shard-0&authSource=admin&appName=Cluster0', {
  serverSelectionTimeoutMS: 10000,
  family: 4
})
  .then(async () => {
    await Artifact.deleteMany({});
    await Artifact.insertMany(data);
    console.log('Seeded successfully! ' + data.length + ' artifacts added.');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });