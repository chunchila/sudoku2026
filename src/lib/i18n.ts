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
  chooseChallenge: "Choose your challenge",
  continueGame: "Continue Game",
  mistake: "mistake",
  mistakes: "mistakes",
  cellsToFill: "cells to fill",
  basePts: "base pts",
  timeBonus: "time bonus",
  menu: "Menu",
  time: "Time",
  points: "Points",
  erase: "Erase",
  notes: "Notes",
  hint: "Hint",
  puzzleComplete: "Puzzle Complete!",
  difficulty: "difficulty",
  score: "Score",
  basePoints: "Base Points",
  mistakePenalty: "Mistake Penalty",
  playAgain: "Play Again",
  background: "Background",
  bgNone: "None",
  bgOcean: "Ocean",
  bgSunset: "Sunset",
  bgForest: "Forest",
  bgAurora: "Aurora",
  bgCherry: "Cherry",
  bgMidnight: "Midnight",
  switchToLight: "Switch to light mode",
  switchToDark: "Switch to dark mode",
  changeBg: "Change background",
  language: "Language",
  kbFill: "to fill",
  kbNotes: "notes",
  kbNavigate: "navigate",
  kbErase: "erase",
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  expert: "Expert",
  mistakeCount: (n) => `${n} mistake${n !== 1 ? "s" : ""}`,
  deleteSave: "Delete saved game",
};

const ru: Translations = {
  chooseChallenge: "Выберите сложность",
  continueGame: "Продолжить игру",
  mistake: "ошибка",
  mistakes: "ошибки",
  cellsToFill: "ячеек для заполнения",
  basePts: "базовые очки",
  timeBonus: "бонус за время",
  menu: "Меню",
  time: "Время",
  points: "Очки",
  erase: "Стереть",
  notes: "Заметки",
  hint: "Подсказка",
  puzzleComplete: "Головоломка решена!",
  difficulty: "сложность",
  score: "Счёт",
  basePoints: "Базовые очки",
  mistakePenalty: "Штраф за ошибки",
  playAgain: "Играть снова",
  background: "Фон",
  bgNone: "Нет",
  bgOcean: "Океан",
  bgSunset: "Закат",
  bgForest: "Лес",
  bgAurora: "Сияние",
  bgCherry: "Вишня",
  bgMidnight: "Полночь",
  switchToLight: "Светлая тема",
  switchToDark: "Тёмная тема",
  changeBg: "Сменить фон",
  language: "Язык",
  kbFill: "ввод",
  kbNotes: "заметки",
  kbNavigate: "навигация",
  kbErase: "стереть",
  easy: "Лёгкий",
  medium: "Средний",
  hard: "Сложный",
  expert: "Эксперт",
  mistakeCount: (n) => {
    if (n === 1) return "1 ошибка";
    if (n >= 2 && n <= 4) return `${n} ошибки`;
    return `${n} ошибок`;
  },
  deleteSave: "Удалить сохранение",
};

const de: Translations = {
  chooseChallenge: "Wähle deine Herausforderung",
  continueGame: "Spiel fortsetzen",
  mistake: "Fehler",
  mistakes: "Fehler",
  cellsToFill: "Zellen zu füllen",
  basePts: "Basispunkte",
  timeBonus: "Zeitbonus",
  menu: "Menü",
  time: "Zeit",
  points: "Punkte",
  erase: "Löschen",
  notes: "Notizen",
  hint: "Tipp",
  puzzleComplete: "Rätsel gelöst!",
  difficulty: "Schwierigkeit",
  score: "Punktzahl",
  basePoints: "Basispunkte",
  mistakePenalty: "Fehlerstrafe",
  playAgain: "Nochmal spielen",
  background: "Hintergrund",
  bgNone: "Keiner",
  bgOcean: "Ozean",
  bgSunset: "Sonnenuntergang",
  bgForest: "Wald",
  bgAurora: "Aurora",
  bgCherry: "Kirsche",
  bgMidnight: "Mitternacht",
  switchToLight: "Helles Design",
  switchToDark: "Dunkles Design",
  changeBg: "Hintergrund ändern",
  language: "Sprache",
  kbFill: "eingeben",
  kbNotes: "Notizen",
  kbNavigate: "navigieren",
  kbErase: "löschen",
  easy: "Leicht",
  medium: "Mittel",
  hard: "Schwer",
  expert: "Experte",
  mistakeCount: (n) => `${n} Fehler`,
  deleteSave: "Spielstand löschen",
};

const ja: Translations = {
  chooseChallenge: "難易度を選択",
  continueGame: "ゲームを続ける",
  mistake: "ミス",
  mistakes: "ミス",
  cellsToFill: "マスを埋める",
  basePts: "基本点",
  timeBonus: "タイムボーナス",
  menu: "メニュー",
  time: "時間",
  points: "ポイント",
  erase: "消去",
  notes: "メモ",
  hint: "ヒント",
  puzzleComplete: "パズル完成！",
  difficulty: "難易度",
  score: "スコア",
  basePoints: "基本ポイント",
  mistakePenalty: "ミスペナルティ",
  playAgain: "もう一度",
  background: "背景",
  bgNone: "なし",
  bgOcean: "海",
  bgSunset: "夕焼け",
  bgForest: "森",
  bgAurora: "オーロラ",
  bgCherry: "桜",
  bgMidnight: "深夜",
  switchToLight: "ライトモード",
  switchToDark: "ダークモード",
  changeBg: "背景を変更",
  language: "言語",
  kbFill: "入力",
  kbNotes: "メモ",
  kbNavigate: "移動",
  kbErase: "消去",
  easy: "かんたん",
  medium: "ふつう",
  hard: "むずかしい",
  expert: "エキスパート",
  mistakeCount: (n) => `${n}ミス`,
  deleteSave: "セーブデータを削除",
};

const fr: Translations = {
  chooseChallenge: "Choisissez votre défi",
  continueGame: "Continuer la partie",
  mistake: "erreur",
  mistakes: "erreurs",
  cellsToFill: "cases à remplir",
  basePts: "pts de base",
  timeBonus: "bonus temps",
  menu: "Menu",
  time: "Temps",
  points: "Points",
  erase: "Effacer",
  notes: "Notes",
  hint: "Indice",
  puzzleComplete: "Puzzle terminé !",
  difficulty: "difficulté",
  score: "Score",
  basePoints: "Points de base",
  mistakePenalty: "Pénalité d'erreur",
  playAgain: "Rejouer",
  background: "Arrière-plan",
  bgNone: "Aucun",
  bgOcean: "Océan",
  bgSunset: "Coucher de soleil",
  bgForest: "Forêt",
  bgAurora: "Aurore",
  bgCherry: "Cerise",
  bgMidnight: "Minuit",
  switchToLight: "Mode clair",
  switchToDark: "Mode sombre",
  changeBg: "Changer le fond",
  language: "Langue",
  kbFill: "remplir",
  kbNotes: "notes",
  kbNavigate: "naviguer",
  kbErase: "effacer",
  easy: "Facile",
  medium: "Moyen",
  hard: "Difficile",
  expert: "Expert",
  mistakeCount: (n) => `${n} erreur${n !== 1 ? "s" : ""}`,
  deleteSave: "Supprimer la sauvegarde",
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
