
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

// --- KONFIGURACJA SEGMENTU 2 (OBRAZKI) ---

// Folder, z którego aplikacja pobiera zdjęcia.
export const SEGMENT2_IMAGES_PATH = "images/segment2/";

// Baza klatek filmowych dla Segmentu 2
export const MOVIE_FRAMES: MovieFramePair[] = [
  { 
    id: "m1",
    key: `${SEGMENT2_IMAGES_PATH}matrix_q.jpg`, 
    answer: `${SEGMENT2_IMAGES_PATH}matrix_a.jpg`,
    title: "Matrix"
  },
  { 
    id: "m2",
    key: `${SEGMENT2_IMAGES_PATH}titanic_q.jpg`, 
    answer: `${SEGMENT2_IMAGES_PATH}titanic_a.jpg`,
    title: "Titanic"
  },
  { 
    id: "m3",
    key: `${SEGMENT2_IMAGES_PATH}shrek_q.jpg`, 
    answer: `${SEGMENT2_IMAGES_PATH}shrek_a.jpg`,
    title: "Shrek"
  },
  { 
    id: "m4",
    key: `${SEGMENT2_IMAGES_PATH}lotr_q.jpg`, 
    answer: `${SEGMENT2_IMAGES_PATH}lotr_a.jpg`,
    title: "Władca Pierścieni"
  },
  { 
    id: "m5",
    key: `${SEGMENT2_IMAGES_PATH}pulp_fiction_q.jpg`, 
    answer: `${SEGMENT2_IMAGES_PATH}pulp_fiction_a.jpg`,
    title: "Pulp Fiction"
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
    title: "Kizo - Kizownik"
  },
  {
    id: "track21",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track21.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track21_odp.mp3`,
    title: "xxxxx"
  },
  {
    id: "track22",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track22.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track22_odp.mp3`,
    title: "xxxxx"
  },
  {
    id: "track23",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track23.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track23_odp.mp3`,
    title: "xxxxx"
  },
  {
    id: "track24",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track24.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track24_odp.mp3`,
    title: "xxxxx"
  },
  {
    id: "track25",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track25.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track25_odp.mp3`,
    title: "xxxxx"
  },
  {
    id: "track26",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track26.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track26_odp.mp3`,
    title: "xxxxx"
  },
  {
    id: "track27",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track27.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track27_odp.mp3`,
    title: "xxxxx"
  },
  {
    id: "track28",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track28.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track28_odp.mp3`,
    title: "xxxxx"
  },
  {
    id: "track29",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track29.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track29_odp.mp3`,
    title: "xxxxx"
  },
  {
    id: "track30",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track30.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track30_odp.mp3`,
    title: "xxxxx"
  },
  {
    id: "track31",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track31.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track31_odp.mp3`,
    title: "xxxxx"
  },
  {
    id: "track32",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track32.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track32_odp.mp3`,
    title: "xxxxx"
  },
  {
    id: "track33",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track33.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track33_odp.mp3`,
    title: "xxxxx"
  },
  {
    id: "track34",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track34.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track34_odp.mp3`,
    title: "xxxxx"
  },
  {
    id: "track35",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track35.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track35_odp.mp3`,
    title: "xxxxx"
  },
  {
    id: "track36",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track36.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track36_odp.mp3`,
    title: "xxxxx"
  },
];
// Aby dodać więcej par, stwórz pliki: track02.mp3, track02_odp.mp3, track03.mp3, track03_odp.mp3 itd.
// i dodaj je do listy MUSIC_PAIRS poniżej

// --- KONFIGURACJA SEGMENTU 4 (LICYTACJA) ---

export const SEGMENT4_CATEGORIES: Segment4Category[] = [
  {
    id: "s4_c1",
    name: "Planety Układu Słonecznego",
    maxValue: 8,
    errorThreshold: 0,
    validValues: [
      "Merkury", "Wenus", "Ziemia", "Mars", "Jowisz", "Saturn", "Uran", "Neptun"
    ]
  },
  {
    id: "s4_c2",
    name: "Kontynenty",
    maxValue: 7,
    errorThreshold: 0,
    validValues: [
      "Afryka", "Ameryka Południowa", "Ameryka Północna", "Antarktyda", "Australia", "Azja", "Europa"
    ]
  },
  {
    id: "s4_c3",
    name: "Sąsiedzi Polski",
    maxValue: 7,
    errorThreshold: 0,
    validValues: [
      "Niemcy", "Czechy", "Słowacja", "Ukraina", "Białoruś", "Litwa", "Rosja"
    ]
  },
  {
    id: "s4_c4",
    name: "Dni tygodnia",
    maxValue: 7,
    errorThreshold: 0,
    validValues: [
      "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"
    ]
  }
];
