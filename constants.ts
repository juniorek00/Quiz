
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
  "avatar1.jpg", 
  "avatar2.jpg", "avatar3.jpg", "avatar4.jpg", "avatar5.jpg",
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
// Należy utworzyć folder public/segment3_utwory/ i wrzucić tam pliki.
export const SEGMENT3_AUDIO_PATH = "segment3_utwory/";

// Baza par audio dla Segmentu 3
export const MUSIC_PAIRS: MusicPair[] = [
  {
    id: "track01",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track01.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track01_odp.mp3`,
    title: "Utwór 1"
  },
  {
    id: "track02",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track02.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track02_odp.mp3`,
    title: "Utwór 2"
  },
  {
    id: "track03",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track03.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track03_odp.mp3`,
    title: "Utwór 3"
  },
  {
    id: "track04",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track04.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track04_odp.mp3`,
    title: "Utwór 4"
  },
  {
    id: "track05",
    questionSrc: `${SEGMENT3_AUDIO_PATH}track05.mp3`,
    answerSrc:   `${SEGMENT3_AUDIO_PATH}track05_odp.mp3`,
    title: "Utwór 5"
  }
];

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
