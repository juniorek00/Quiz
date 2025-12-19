
// Stałe konfiguracyjne aplikacji
// Uwaga: Pytania są teraz ładowane dynamicznie z pliku pytania.csv

import { MovieFramePair, MusicPair, Segment4Category } from "./types";

export const APP_NAME = "Quiz Master Pro";
export const CSV_FILE_PATH = "pytania.csv";

// --- KONFIGURACJA AWATARÓW ---
// Folder z awatarami w public/
export const AVATARS_PATH = "images/avatars/";

// Lista dostępnych plików awatarów. 
// Użytkownik musi zapewnić, że te pliki istnieją w folderze public/images/avatars/
export const AVATAR_FILES = [
  "avatar1.jpg", "avatar2.jpg", "avatar3.jpg", "avatar4.jpg", "avatar5.jpg",
  "avatar6.jpg", "avatar7.jpg", "avatar8.jpg", "avatar9.jpg", "avatar10.jpg",
  "avatar11.jpg", "avatar12.jpg", "avatar13.jpg", "avatar14.jpg", "avatar15.jpg",
  "avatar16.jpg", "avatar17.jpg", "avatar18.jpg", "avatar19.jpg", "avatar20.jpg"
];

// --- ZDJĘCIA DRUŻYN ---
// Folder z zdjęciami drużyn w public/
export const TEAM_PHOTOS_PATH = "images/teams/";

// Lista dostępnych plików zdjęć drużyn. Użytkownik powinien umieścić je w public/images/teams/
export const TEAM_PHOTOS = [
  "team1.jpg", "team2.jpg", "team3.jpg", "team4.jpg", "team5.jpg", "team6.jpg","team7.jpg","team8.jpg", "team9.jpg", "team10.jpg", "team11.jpg", "team12.jpg","team13.jpg"
];

// --- KONFIGURACJA SEGMENTU 2 (OBRAZKI) ---

// Folder, z którego aplikacja pobiera zdjęcia.
export const SEGMENT2_IMAGES_PATH = "images/segment2/";

// Baza klatek filmowych dla Segmentu 2
export const MOVIE_FRAMES: MovieFramePair[] = [
  {
    id: "m1",
    key: `${SEGMENT2_IMAGES_PATH}batman_returns_q.jpg`,
    answer: `${SEGMENT2_IMAGES_PATH}batman_returns_a.jpg`,
    title: "Batman Returns"
  },
  {
    id: "m2",
    key: `${SEGMENT2_IMAGES_PATH}coco_q.jpg`,
    answer: `${SEGMENT2_IMAGES_PATH}coco_a.jpg`,
    title: "Coco"
  },
  {
    id: "m3",
    key: `${SEGMENT2_IMAGES_PATH}dalmatynczyki_q.jpg`,
    answer: `${SEGMENT2_IMAGES_PATH}dalmatynczyki_a.jpg`,
    title: "101 Dalmatyńczyków"
  },
  {
    id: "m4",
    key: `${SEGMENT2_IMAGES_PATH}django_q.jpg`,
    answer: `${SEGMENT2_IMAGES_PATH}django_a.jpg`,
    title: "Django Unchained"
  },
  {
    id: "m5",
    key: `${SEGMENT2_IMAGES_PATH}dzien_swira_q.png`,
    answer: `${SEGMENT2_IMAGES_PATH}dzien_swira_a.png`,
    title: "Dzień świra"
  },
  {
    id: "m6",
    key: `${SEGMENT2_IMAGES_PATH}f1_q.jpg`,
    answer: `${SEGMENT2_IMAGES_PATH}f1_a.jpg`,
    title: "F1"
  },
  {
    id: "m7",
    key: `${SEGMENT2_IMAGES_PATH}fast_5_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}fast_5_a.jpg`,
    title: "Fast Five"
  },
  {
    id: "m8",
    key: `${SEGMENT2_IMAGES_PATH}grinch_q.jpg`,
    answer: `${SEGMENT2_IMAGES_PATH}grinch_a.jpg`,
    title: "How the Grinch Stole Christmas"
  },
  {
    id: "m9",
    key: `${SEGMENT2_IMAGES_PATH}grinch2_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}grinch2_a.jpg`,
    title: "Grinch 2"
  },
  {
    id: "m10",
    key: `${SEGMENT2_IMAGES_PATH}gruby_i_chudszy_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}gruby_i_chudszy_a.jpg`,
    title: "Gruby i chudszy"
  },
  {
    id: "m11",
    key: `${SEGMENT2_IMAGES_PATH}gwiezdne_wojny_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}gwiezdne_wojny_a.jpg`,
    title: "Gwiezdne wojny"
  },
  {
    id: "m12",
    key: `${SEGMENT2_IMAGES_PATH}home_alone_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}home_alone_a.jpg`,
    title: "Home Alone"
  },
  {
    id: "m13",
    key: `${SEGMENT2_IMAGES_PATH}hot_to_lose_a_guy_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}hot_to_lose_a_guy_a.jpg`,
    title: "How to Lose a Guy in 10 Days"
  },
  {
    id: "m14",
    key: `${SEGMENT2_IMAGES_PATH}igrzyska_smierci_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}igrzyska_smierci_a.jpg`,
    title: "Igrzyska śmierci"
  },
  {
    id: "m15",
    key: `${SEGMENT2_IMAGES_PATH}incepcja_q.jpg`,
    answer: `${SEGMENT2_IMAGES_PATH}incepcja_a.jpg`,
    title: "Incepcja"
  },
  {
    id: "m16",
    key: `${SEGMENT2_IMAGES_PATH}indiana_jones_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}indiana_jones_a.jpg`,
    title: "Indiana Jones"
  },
  {
    id: "m17",
    key: `${SEGMENT2_IMAGES_PATH}iniemamocni_q.jpg`,
    answer: `${SEGMENT2_IMAGES_PATH}iniemamocni_a.png`,
    title: "Iniemamocni"
  },
  {
    id: "m18",
    key: `${SEGMENT2_IMAGES_PATH}iron_man_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}iron_man_a.jpg`,
    title: "Iron Man"
  },
  {
    id: "m19",
    key: `${SEGMENT2_IMAGES_PATH}karate_kid_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}karate_kid_a.jpg`,
    title: "The Karate Kid"
  },
  {
    id: "m20",
    key: `${SEGMENT2_IMAGES_PATH}kill_bill_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}kill_bill_a.jpg`,
    title: "Kill Bill"
  },
  {
    id: "m21",
    key: `${SEGMENT2_IMAGES_PATH}konklawe_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}konklawe_a.jpg`,
    title: "Konklawe"
  },
  {
    id: "m22",
    key: `${SEGMENT2_IMAGES_PATH}krolewna_sniezka_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}krolewna_sniezka_a.jpg`,
    title: "Królewna Śnieżka"
  },
  {
    id: "m23",
    key: `${SEGMENT2_IMAGES_PATH}krwawy_diament_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}krwawy_diament_a.jpg`,
    title: "Krwawy diament"
  },
  {
    id: "m24",
    key: `${SEGMENT2_IMAGES_PATH}leon_zawodowiec_q.jpg`,
    answer: `${SEGMENT2_IMAGES_PATH}leon_zawodowiec_a.JPG`,
    title: "Leon zawodowiec"
  },
  {
    id: "m25",
    key: `${SEGMENT2_IMAGES_PATH}mask_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}mask_a.jpg`,
    title: "The Mask"
  },
  {
    id: "m26",
    key: `${SEGMENT2_IMAGES_PATH}matrix_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}matrix_a.jpg`,
    title: "The Matrix"
  },
  {
    id: "m27",
    key: `${SEGMENT2_IMAGES_PATH}men_in_black_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}men_in_black_a.jpg`,
    title: "Men in Black"
  },
  {
    id: "m28",
    key: `${SEGMENT2_IMAGES_PATH}men_in_black_II_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}men_in_black_II_a.jpg`,
    title: "Men in Black II"
  },
  {
    id: "m29",
    key: `${SEGMENT2_IMAGES_PATH}mickey17_q.jpg`,
    answer: `${SEGMENT2_IMAGES_PATH}mickey17_a.jpg`,
    title: "Mickey 17"
  },
  {
    id: "m30",
    key: `${SEGMENT2_IMAGES_PATH}minecraft_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}minecraft_a.jpg`,
    title: "Minecraft"
  },
  {
    id: "m31",
    key: `${SEGMENT2_IMAGES_PATH}odlot_q.jpg`,
    answer: `${SEGMENT2_IMAGES_PATH}odlot_a.png`,
    title: "Odlot"
  },
  {
    id: "m32",
    key: `${SEGMENT2_IMAGES_PATH}onward_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}onward_a.jpg`,
    title: "Onward"
  },
  {
    id: "m33",
    key: `${SEGMENT2_IMAGES_PATH}ratatuj_q.jpg`,
    answer: `${SEGMENT2_IMAGES_PATH}ratatuj_a.png`,
    title: "Ratatuj"
  },
  {
    id: "m34",
    key: `${SEGMENT2_IMAGES_PATH}scarface_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}scarface_a.jpg`,
    title: "Scarface"
  },
  {
    id: "m35",
    key: `${SEGMENT2_IMAGES_PATH}shining_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}shining_a.jpg`,
    title: "The Shining"
  },
  {
    id: "m36",
    key: `${SEGMENT2_IMAGES_PATH}shiningII_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}shiningII_a.jpg`,
    title: "The Shining II"
  },
  {
    id: "m37",
    key: `${SEGMENT2_IMAGES_PATH}spider_man_3_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}spider_man_3_a.jpg`,
    title: "Spider-Man 3"
  },
  {
    id: "m38",
    key: `${SEGMENT2_IMAGES_PATH}star_wars_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}star_wars_a.jpg`,
    title: "Star Wars"
  },
  {
    id: "m39",
    key: `${SEGMENT2_IMAGES_PATH}star_wars_IX_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}star_wars_IX_a.jpg`,
    title: "Star Wars: Episode IX"
  },
  {
    id: "m40",
    key: `${SEGMENT2_IMAGES_PATH}stich_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}stich_a.jpg`,
    title: "Lilo & Stitch"
  },
  {
    id: "m41",
    key: `${SEGMENT2_IMAGES_PATH}to_nie_kraj_dla_starych_ludzi_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}to_nie_kraj_dla_starych_ludzi_a.jpg`,
    title: "To nie jest kraj dla starych ludzi"
  },
  {
    id: "m42",
    key: `${SEGMENT2_IMAGES_PATH}truman_show_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}truman_show_a.jpg`,
    title: "The Truman Show"
  },
  {
    id: "m43",
    key: `${SEGMENT2_IMAGES_PATH}wiedzma_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}wiedzma_a.jpg`,
    title: "Wiedźma"
  },
  {
    id: "m44",
    key: `${SEGMENT2_IMAGES_PATH}willy_wonka_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}willy_wonka_a.jpg`,
    title: "Willy Wonka"
  },
  {
    id: "m45",
    key: `${SEGMENT2_IMAGES_PATH}wladca_pierscieni_q.jpg`,
    answer: `${SEGMENT2_IMAGES_PATH}wladca_pierscieni_a.jpg`,
    title: "Władca Pierścieni"
  },
  {
    id: "m46",
    key: `${SEGMENT2_IMAGES_PATH}wszystko_wszedzie_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}wszystko_wszedzie_a.jpg`,
    title: "Wszystko wszędzie naraz"
  },
  {
    id: "m47",
    key: `${SEGMENT2_IMAGES_PATH}zootopia_q.JPG`,
    answer: `${SEGMENT2_IMAGES_PATH}zootopia_a.jpg`,
    title: "Zootopia"
  },
  {
    id: "m48",
    key: `${SEGMENT2_IMAGES_PATH}21_jump_street_q.jpg`,
    answer: `${SEGMENT2_IMAGES_PATH}21_jump_street_a.jpg`,
    title: "21 Jump Street"
  },
  {
    id: "m49",
    key: `${SEGMENT2_IMAGES_PATH}2012_q.jpg`,
    answer: `${SEGMENT2_IMAGES_PATH}2012_a.jpg`,
    title: "2012"
  },
  {
    id: "m50",
    key: `${SEGMENT2_IMAGES_PATH}akademia_policyjna_q.jpg`,
    answer: `${SEGMENT2_IMAGES_PATH}akademia_policyjna_a.jpg`,
    title: "Akademia policyjna"
  },
  {
    id: "m51",
    key: `${SEGMENT2_IMAGES_PATH}back_to_the_future_q.jpg`,
    answer: `${SEGMENT2_IMAGES_PATH}back_to_the_future_a.jpg`,
    title: "Back to the Future"
  },
  {
    id: "m52",
    key: `${SEGMENT2_IMAGES_PATH}bad_boys_q.jpg`,
    answer: `${SEGMENT2_IMAGES_PATH}bad_boys_a.jpg`,
    title: "Bad Boys"
  }
];

// --- KONFIGURACJA SEGMENTU 3 (AUDIO) ---

// Folder, z którego aplikacja pobiera pliki mp3.
// Pliki powinny być w folderze public/segment3_utwory/
// W kodzie referencja jest bez "public/" bo Vite serwuje statyczne zasoby z folderu public
export const SEGMENT3_AUDIO_PATH = "segment3_utwory/";

// Baza par audio dla Segmentu 3
export const MUSIC_PAIRS: MusicPair[] = [
  {
    id: "track01",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track01.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track01_odp.mp3`,
    title: "Kizo x @bletka - HERO"
  },
  {
    id: "track02",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track02.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track02_odp.mp3`,
    title: "Young Leosia - Cringowy Lovesong (prod. PSR)"
  },
  {
    id: "track03",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track03.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track03_odp.mp3`,
    title: "TYMEK - RAINMAN FIT. TRILL PEM, TEDE (PROD BY MICHAŁ GRACZYK & 2K)"
  },
  {
    id: "track04",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track04.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track04_odp.mp3`,
    title: "KaeN feat. Cheeba, WdoWA - Zbyt wiele"
  },
  {
    id: "track05",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track05.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track05_odp.mp3`,
    title: "Quebonafide ft. ReTo - Half dead (prod. High Tower)"
  },
  {
    id: "track06",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track06.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track06_odp.mp3`,
    title: "Otsochodzi - Nie, nie"
  },
  {
    id: "track07",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track07.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track07_odp.mp3`,
    title: "BIAŁAS & LANEK - Grill u Gawrona"
  },
  {
    id: "track08",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track08.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track08_odp.mp3`,
    title: "Dawid Podsiadlo - Małomiasteczkowy"
  },
  {
    id: "track09",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track09.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track09_odp.mp3`,
    title: "ZERO - Bania u Cygana"
  },
  {
    id: "track10",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track10.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track10_odp.mp3`,
    title: "Ich Troje - Zawsze Z Toba Chcialbym Być"
  },
  {
    id: "track11",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track11.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track11_odp.mp3`,
    title: "Boys - Jesteś Szalona"
  },
  {
    id: "track12",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track12.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track12_odp.mp3`,
    title: "HAPPYSAD - Zanim pójdę"
  },
  {
    id: "track13",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track13.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track13_odp.mp3`,
    title: "Enej - Symetryczno-Liryczna"
  },
  {
    id: "track14",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track14.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track14_odp.mp3`,
    title: "Mirami - Sexualna"
  },
  {
    id: "track15",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track15.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track15_odp.mp3`,
    title: "Michael Jackson - Smooth Criminal"
  },
  {
    id: "track16",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track16.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track16_odp.mp3`,
    title: "Eminem - The Real Slim Shady"
  },
  {
    id: "track17",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track17.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track17_odp.mp3`,
    title: "Elton John - I'm Still Standing"
  },
  {
    id: "track18",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track18.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track18_odp.mp3`,
    title: "Flo Rida - Low (feat. T-Pain)"
  },
  {
    id: "track19",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track19.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track19_odp.mp3`,
    title: "Boney M. - Daddy Cool"
  },
  {
    id: "track20",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track20.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track20_odp.mp3`,
    title: "Kizo - KIEROWNIK"
  },
  {
    id: "track21",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track21.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track21_odp.mp3`,
    title: "Alberto - La Manga feat. Josef Bratan Prod. VEYSIGZ"
  },
  {
    id: "track22",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track22.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track22_odp.mp3`,
    title: "Coldplay - Fix You"
  },
  {
    id: "track23",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track23.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track23_odp.mp3`,
    title: "Myslovitz - Długość dźwięku samotności"
  },
  {
    id: "track24",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track24.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track24_odp.mp3`,
    title: "Cleo - Zabiorę nas"
  },
  {
    id: "track25",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track25.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track25_odp.mp3`,
    title: "Dawid Podsiadło i Kaśka Sochacka - samoloty"
  },
  {
    id: "track26",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track26.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track26_odp.mp3`,
    title: "Lady Pank - Na co komu dziś"
  },
  {
    id: "track27",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track27.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track27_odp.mp3`,
    title: "Video - Sroda Czwartek"
  },
  {
    id: "track28",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track28.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track28_odp.mp3`,
    title: "Lady Pank - Mniej niż zero"
  },
  {
    id: "track29",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track29.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track29_odp.mp3`,
    title: "Yugopolis & Maciej Maleńczuk - Ostatnia nocka"
  },
  {
    id: "track30",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track30.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track30_odp.mp3`,
    title: "Gawryle - Harnaś Ice Tea"
  },
  {
    id: "track31",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track31.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track31_odp.mp3`,
    title: "Dua Lipa - Physical"
  },
  {
    id: "track32",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track32.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track32_odp.mp3`,
    title: "A$AP Rocky - Sundress"
  },
  {
    id: "track33",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track33.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track33_odp.mp3`,
    title: "Taylor Swift - The Fate of Ophelia"
  },
  {
    id: "track34",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track34.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track34_odp.mp3`,
    title: "Gedz - Kosmita"
  },
  {
    id: "track35",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track35.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track35_odp.mp3`,
    title: "Post Malone, Swae Lee - Sunflower"
  },
  {
    id: "track36",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track36.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track36_odp.mp3`,
    title: "Drake - In My Feelings"
  },
];
// Aby dodać więcej par, stwórz pliki: track02.mp3, track02_odp.mp3, track03.mp3, track03_odp.mp3 itd.
// i dodaj je do listy MUSIC_PAIRS poniżej

// --- KONFIGURACJA SEGMENTU 4 (LICYTACJA) ---

export const SEGMENT4_CATEGORIES: Segment4Category[] = [
  {
    id: "s4_c1",
    name: "Kraje Unii Europejskiej",
    maxValue: 27,
    errorThreshold: 2,
    validValues: [
      "Austria"
      , "Belgia"
      , "Bułgaria"
      , "Chorwacja"
      , "Cypr"
      , "Czechy"
      , "Dania"
      , "Estonia"
      , "Finlandia"
      , "Francja"
      , "Grecja"
      , "Hiszpania"
      , "Holandia"
      , "Irlandia"
      , "Litwa"
      , "Luksemburg"
      , "Łotwa"
      , "Malta"
      , "Niemcy"
      , "Polska"
      , "Portugalia"
      , "Rumunia"
      , "Słowacja"
      , "Słowenia"
      , "Szwecja"
      , "Węgry"
      , "Włochy"
    ]
  },
  {
    id: "s4_c2",
    name: "Polskie Parki narodowe",
    maxValue: 23,
    errorThreshold: 3,
    validValues: [
       "Woliński Park Narodowy"
      , "Wigierski Park Narodowy"
      , "Wielkopolski Park Narodowy"
      , "Park Narodowy - Ujście Warty"
      , "Tatrzański Park Narodowy"
      , "Świętokrzyski Park Narodowy"
      , "Słowiński Park Narodowy"
      , "Roztoczański Park Narodowy"
      , "Poleski Park Narodowy"
      , "Pieniński Park Narodowy"
      , "Ojcowski Park Narodowy"
      , "Narwiański Park Narodowy"
      , "Magurski Park Narodowy"
      , "Karkonoski Park Narodowy"
      , "Kampinoski Park Narodowy"
      , "Park Narodowy Gór Stołowych"
      , "Gorczański Park Narodowy"
      , "Drawieński Park Narodowy"
      , "Park Narodowy Bory Tucholskie"
      , "Bieszczadzki Park Narodowy"
      , "Biebrzański Park Narodowy"
      , "Białowieski Park Narodowy"
      , "Babiogórski Park Narodowy"
    ]
  },
  {
    id: "s4_c3",
    name: "Filmy w reżyserii Quentina Tarantino",
    maxValue: 14,
    errorThreshold: 3,
    validValues: [
       "Pewnego razu w Hollywood"
      , "Nienawistna ósemka"
      , "Django"
      , "Bękarty wojny"
      , "Grindhouse Death Proof"
      , "Sin City Miasto grzechu"
      , "Kill Bill 2"
      , "Kill Bill"
      , "Jackie Brown"
      , "Cztery pokoje"
      , "Pulp Fiction"
      , "Wściekłe psy"
      , "Urodziny mojego najlepszego przyjaciela"
      , "Love Birds in Bondage"
    ]
  },
  {
    id: "s4_c4",
    name: "Pełnometrażowe filmy w których wystąpił Leonardo Di Caprio",
    maxValue: 31,
    errorThreshold: 3,
    validValues: [
      , "Critters 3"
      , "Trujący bluszcz"
      , "Chłopięcy świat"
      , "Co gryzie Gilberta Grape’a?"
      , "Szybcy i martwi"
      , "Pamiętnik odmieńca"
      , "Całkowite zaćmienie"
      , "Romeo i Julia"
      , "Pokój Marvina"
      , "Titanic"
      , "Człowiek w żelaznej masce"
      , "Celebrity"
      , "Niebiańska plaża"
      , "Gangi Nowego Jorku"
      , "Złap mnie, jeśli potrafisz"
      , "Aviator"
      , "Infiltracja"
      , "Krwawy diament"
      , "W sieci kłamstw"
      , "Droga do szczęścia"
      , "Wyspa tajemnic"
      , "Incepcja"
      , "J. Edgar"
      , "Django"
      , "Wielki Gatsby"
      , "Wilk z Wall Street"
      , "Zjawa"
      , "Pewnego razu… w Hollywood"
      , "Nie patrz w górę"
      , "Czas krwawego księżyca"
      , "Jedna bitwa po drugiej"
    ]
  }
];
