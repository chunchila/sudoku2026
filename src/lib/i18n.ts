export const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];

interface Translations {
  chooseChallenge: string;
  continueGame: string;
  mistake: string;
  mistakes: string;
  cellsToFill: string;
  basePts: string;
  timeBonus: string;
  menu: string;
  time: string;
  points: string;
  erase: string;
  notes: string;
  hint: string;
  puzzleComplete: string;
  difficulty: string;
  score: string;
  basePoints: string;
  mistakePenalty: string;
  playAgain: string;
  background: string;
  bgNone: string;
  bgOcean: string;
  bgSunset: string;
  bgForest: string;
  bgAurora: string;
  bgCherry: string;
  bgMidnight: string;
  switchToLight: string;
  switchToDark: string;
  changeBg: string;
  language: string;
  kbFill: string;
  kbNotes: string;
  kbNavigate: string;
  kbErase: string;
  easy: string;
  medium: string;
  hard: string;
  expert: string;
  mistakeCount: (n: number) => string;
  deleteSave: string;
}

const en: Translations = {
  chooseChallenge: "Pick your poison",
  continueGame: "Jump Back In",
  mistake: "oopsie",
  mistakes: "oopsies",
  cellsToFill: "empty squares of doom",
  basePts: "base loot",
  timeBonus: "speed bonus",
  menu: "Lobby",
  time: "Clock",
  points: "Loot",
  erase: "Nuke",
  notes: "Scribble",
  hint: "Cheat Code",
  puzzleComplete: "You Absolute Legend!",
  difficulty: "vibe",
  score: "Final Loot",
  basePoints: "Base Loot",
  mistakePenalty: "Oopsie Tax",
  playAgain: "Run It Back",
  background: "Wallpaper",
  bgNone: "Boring",
  bgOcean: "Deep Blue",
  bgSunset: "Golden Hour",
  bgForest: "Touch Grass",
  bgAurora: "Northern Lights",
  bgCherry: "Anime Vibes",
  bgMidnight: "Hacker Mode",
  switchToLight: "Lights on",
  switchToDark: "Lights off",
  changeBg: "Drip check",
  language: "Language",
  kbFill: "to fill",
  kbNotes: "scribble",
  kbNavigate: "navigate",
  kbErase: "nuke",
  easy: "Baby Steps",
  medium: "Getting Sweaty",
  hard: "Pain Enjoyer",
  expert: "Certified Maniac",
  mistakeCount: (n) => `${n} oopsie${n !== 1 ? "s" : ""}`,
  deleteSave: "Rage quit this save",
};

const ru: Translations = {
  chooseChallenge: "Выбирай свою боль",
  continueGame: "Вернуться в бой",
  mistake: "косяк",
  mistakes: "косяки",
  cellsToFill: "пустых клеток страдания",
  basePts: "базовый лут",
  timeBonus: "бонус за скорость",
  menu: "Лобби",
  time: "Часики",
  points: "Лут",
  erase: "Снести",
  notes: "Каракули",
  hint: "Шпаргалка",
  puzzleComplete: "Ты просто легенда!",
  difficulty: "режим",
  score: "Финальный лут",
  basePoints: "Базовый лут",
  mistakePenalty: "Налог на косяки",
  playAgain: "Ещё разок",
  background: "Обоина",
  bgNone: "Скучно",
  bgOcean: "Глубины",
  bgSunset: "Золотой час",
  bgForest: "Тач грасс",
  bgAurora: "Северное сияние",
  bgCherry: "Аниме вайб",
  bgMidnight: "Хакер мод",
  switchToLight: "Включить свет",
  switchToDark: "Вырубить свет",
  changeBg: "Поменять стиль",
  language: "Язык",
  kbFill: "ввод",
  kbNotes: "каракули",
  kbNavigate: "навигация",
  kbErase: "снести",
  easy: "Разминка",
  medium: "Потеем",
  hard: "Больно, но кайф",
  expert: "Псих с калькулятором",
  mistakeCount: (n) => {
    if (n === 1) return "1 косяк";
    if (n >= 2 && n <= 4) return `${n} косяка`;
    return `${n} косяков`;
  },
  deleteSave: "Удалить в ярости",
};

const de: Translations = {
  chooseChallenge: "Wähl dein Gift",
  continueGame: "Zurück ins Chaos",
  mistake: "Patzer",
  mistakes: "Patzer",
  cellsToFill: "leere Felder des Grauens",
  basePts: "Basis-Beute",
  timeBonus: "Speed-Bonus",
  menu: "Lobby",
  time: "Uhr",
  points: "Beute",
  erase: "Wegbomben",
  notes: "Kritzeln",
  hint: "Schummelzettel",
  puzzleComplete: "Du bist eine Legende!",
  difficulty: "Modus",
  score: "End-Beute",
  basePoints: "Basis-Beute",
  mistakePenalty: "Patzer-Steuer",
  playAgain: "Nochmal rein",
  background: "Tapete",
  bgNone: "Langweilig",
  bgOcean: "Tiefsee",
  bgSunset: "Goldene Stunde",
  bgForest: "Ab in die Natur",
  bgAurora: "Nordlichter",
  bgCherry: "Anime Vibes",
  bgMidnight: "Hacker Modus",
  switchToLight: "Licht an",
  switchToDark: "Licht aus",
  changeBg: "Style-Check",
  language: "Sprache",
  kbFill: "eingeben",
  kbNotes: "kritzeln",
  kbNavigate: "navigieren",
  kbErase: "wegbomben",
  easy: "Aufwärmen",
  medium: "Wird schwitzig",
  hard: "Schmerz-Genießer",
  expert: "Komplett Wahnsinnig",
  mistakeCount: (n) => `${n} Patzer`,
  deleteSave: "Wut-Löschung",
};

const ja: Translations = {
  chooseChallenge: "覚悟を決めろ",
  continueGame: "戦場に戻る",
  mistake: "やらかし",
  mistakes: "やらかし",
  cellsToFill: "空マスという名の地獄",
  basePts: "基本ドロップ",
  timeBonus: "スピードボーナス",
  menu: "ロビー",
  time: "タイマー",
  points: "戦利品",
  erase: "消し飛ばす",
  notes: "落書き",
  hint: "カンニング",
  puzzleComplete: "お前は伝説だ！",
  difficulty: "モード",
  score: "最終戦利品",
  basePoints: "基本ドロップ",
  mistakePenalty: "やらかし税",
  playAgain: "もう一回いくぞ",
  background: "壁紙",
  bgNone: "地味",
  bgOcean: "深海",
  bgSunset: "黄金タイム",
  bgForest: "草を触れ",
  bgAurora: "オーロラ",
  bgCherry: "アニメ感",
  bgMidnight: "ハッカーモード",
  switchToLight: "ライトオン",
  switchToDark: "ライトオフ",
  changeBg: "着せ替え",
  language: "言語",
  kbFill: "入力",
  kbNotes: "落書き",
  kbNavigate: "移動",
  kbErase: "消滅",
  easy: "ウォームアップ",
  medium: "汗かいてきた",
  hard: "痛み愛好家",
  expert: "完全なる狂人",
  mistakeCount: (n) => `${n}やらかし`,
  deleteSave: "ブチギレ削除",
};

const fr: Translations = {
  chooseChallenge: "Choisis ta galère",
  continueGame: "Retour au front",
  mistake: "boulette",
  mistakes: "boulettes",
  cellsToFill: "cases vides de souffrance",
  basePts: "butin de base",
  timeBonus: "bonus vitesse",
  menu: "Lobby",
  time: "Chrono",
  points: "Butin",
  erase: "Dynamiter",
  notes: "Gribouiller",
  hint: "Antisèche",
  puzzleComplete: "T'es une légende !",
  difficulty: "mode",
  score: "Butin final",
  basePoints: "Butin de base",
  mistakePenalty: "Taxe boulettes",
  playAgain: "On remet ça",
  background: "Fond d'écran",
  bgNone: "Ennuyeux",
  bgOcean: "Abysses",
  bgSunset: "Heure dorée",
  bgForest: "Touche l'herbe",
  bgAurora: "Aurore boréale",
  bgCherry: "Vibes anime",
  bgMidnight: "Mode hacker",
  switchToLight: "Lumière !",
  switchToDark: "Ténèbres !",
  changeBg: "Check du style",
  language: "Langue",
  kbFill: "remplir",
  kbNotes: "gribouiller",
  kbNavigate: "naviguer",
  kbErase: "dynamiter",
  easy: "Échauffement",
  medium: "Ça transpire",
  hard: "Amateur de douleur",
  expert: "Cinglé certifié",
  mistakeCount: (n) => `${n} boulette${n !== 1 ? "s" : ""}`,
  deleteSave: "Rage delete",
};

const translations: Record<LangCode, Translations> = { en, ru, de, ja, fr };

export function t(lang: LangCode): Translations {
  return translations[lang] || translations.en;
}

export function getDifficultyLabel(lang: LangCode, key: string): string {
  const tr = t(lang);
  const map: Record<string, string> = {
    easy: tr.easy,
    medium: tr.medium,
    hard: tr.hard,
    expert: tr.expert,
  };
  return map[key] || key;
}

export function getBgLabel(lang: LangCode, id: string): string {
  const tr = t(lang);
  const map: Record<string, string> = {
    none: tr.bgNone,
    ocean: tr.bgOcean,
    sunset: tr.bgSunset,
    forest: tr.bgForest,
    aurora: tr.bgAurora,
    cherry: tr.bgCherry,
    midnight: tr.bgMidnight,
  };
  return map[id] || id;
}
