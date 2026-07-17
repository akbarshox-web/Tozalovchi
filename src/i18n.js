/**
 * Translations — UZ (Uzbek) / RU (Russian) / EN (English).
 * Every user-visible string in the app flows through `t[key]`.
 */

export const DICT = {
  /* --------------------------------------------------------- ENGLISH */
  en: {
    nav: { title: "Water Ejector", tagline: "Shake the water out of your speakers in 60 seconds" },
    hero: {
      idle: { title: "Ready to clean", sub: "Pick a mode and press start" },
      cleaning: { title: "Ejecting water…", sub: "Keep your speaker facing down" },
      done: { title: "All clean!", sub: "Your speaker sounds fresh" },
      ready: "Ready",
      cleaning_lbl: "Cleaning",
    },
    cta: {
      start: "Start Cleaning",
      stop: "Stop",
      again: "Clean Again",
    },
    modes: {
      deep: { label: "Deep Clean", desc: "165 Hz pulse — most effective for water ejection" },
      fast: { label: "Fast Clean", desc: "250 Hz pulse — fast vibration for light moisture" },
      manual: { label: "Manual", desc: "Custom frequency from 80 Hz to 500 Hz" },
      turbo: { label: "Turbo ⚡", desc: "300 Hz with 12 Hz LFO — clean in just 30 seconds" },
      sweep: { label: "Sweep ↔", desc: "Auto-frequency sweep 120–450 Hz — best for stubborn water" },
    },
    controls: {
      manualFreq: "Manual Frequency",
      volume: "Volume",
    },
    stats: {
      freq: "Freq",
      left: "Left",
    },
    rules: {
      heading: "How to Use",
      step: "Step",
      items: [
        { title: "Screen Down", body: "Turn your phone screen facing down so water can easily drip out." },
        { title: "Volume MAX", body: "Turn your media volume to the absolute maximum (100%)." },
        { title: "Unplug Everything", body: "Unplug any headphones or chargers before starting." },
        { title: "Don't Stop", body: "Do not stop the sound until the progress bar reaches 100%." },
      ],
    },
    footer: {
      tip: "Pro tip: hold your phone with the speaker facing down for best results.",
      made: "Built with love and the Web Audio API",
    },
    a11y: {
      start: "Start cleaning",
      stop: "Stop cleaning",
    },
  },

  /* --------------------------------------------------------- UZBEK */
  uz: {
    nav: { title: "Suv Chiqargich", tagline: "60 soniyada dinamikdagi suvni chiqaring" },
    hero: {
      idle: { title: "Tozalashga tayyor", sub: "Rejimni tanlang va boshlashni bosing" },
      cleaning: { title: "Suv chiqarilmoqda…", sub: "Telefonni ekrani pastga qaratilgan holda ushlang" },
      done: { title: "Tozalandi!", sub: "Dinamikingiz yangidek eshitiladi" },
      ready: "Tayyor",
      cleaning_lbl: "Tozalanmoqda",
    },
    cta: {
      start: "TOZALASHNI BOSHLASH",
      stop: "TO'XTATISH",
      again: "YANA TOZALASH",
    },
    modes: {
      deep: { label: "Chuqur Tozalash", desc: "165 Hz — suvni eng samarali chiqaradi" },
      fast: { label: "Tez Tozalash", desc: "250 Hz — yengil namlik uchun tezkor tebranish" },
      manual: { label: "Qo'lda", desc: "80 Hz dan 500 Hz gacha ixtiyoriy chastota" },
      turbo: { label: "Tezkor ⚡", desc: "300 Hz + 12 Hz LFO — atigi 30 soniyada tozalash" },
      sweep: { label: "Sweep ↔", desc: "120–450 Hz avtomatik chastota — qiyin suv uchun eng yaxshi" },
    },
    controls: {
      manualFreq: "Qo'lda Chastota",
      volume: "Ovoz",
    },
    stats: {
      freq: "Chastota",
      left: "Qoldi",
    },
    rules: {
      heading: "Qanday ishlatiladi",
      step: "Qadam",
      items: [
        { title: "Ekranni pastga", body: "Suv oson tomishi uchun telefon ekranini pastga qarating." },
        { title: "Ovozni MAX qiling", body: "Media ovozini eng yuqori darajaga (100%) qo'ying." },
        { title: "Hamma narsani uzing", body: "Naushnik yoki zaryadkani boshlashdan oldin uzing." },
        { title: "To'xtatmang", body: "Progress 100% bo'lguncha ovozni to'xtatmang." },
      ],
    },
    footer: {
      tip: "Maslahat: eng yaxshi natija uchun telefon dinamigini pastga qaratib ushlang.",
      made: "Web Audio API bilan yaratildi",
    },
    a11y: {
      start: "Tozalashni boshlash",
      stop: "Tozalashni to'xtatish",
    },
  },

  /* --------------------------------------------------------- RUSSIAN */
  ru: {
    nav: { title: "Чистка Динамика", tagline: "Удалите воду из динамика за 60 секунд" },
    hero: {
      idle: { title: "Готов к очистке", sub: "Выберите режим и нажмите старт" },
      cleaning: { title: "Выталкиваем воду…", sub: "Держите динамик направленным вниз" },
      done: { title: "Готово!", sub: "Динамик звучит как новый" },
      ready: "Готов",
      cleaning_lbl: "Очистка",
    },
    cta: {
      start: "НАЧАТЬ ОЧИСТКУ",
      stop: "СТОП",
      again: "ОЧИСТИТЬ СНОВА",
    },
    modes: {
      deep: { label: "Глубокая", desc: "165 Гц — самый эффективный импульс для удаления воды" },
      fast: { label: "Быстрая", desc: "250 Гц — быстрая вибрация для лёгкой влаги" },
      manual: { label: "Вручную", desc: "Своя частота от 80 Гц до 500 Гц" },
      turbo: { label: "Турбо ⚡", desc: "300 Гц + 12 Гц LFO — очистка всего за 30 секунд" },
      sweep: { label: "Sweep ↔", desc: "Авто-развёртка 120–450 Гц — для стойкой воды" },
    },
    controls: {
      manualFreq: "Частота",
      volume: "Громкость",
    },
    stats: {
      freq: "Частота",
      left: "Осталось",
    },
    rules: {
      heading: "Как использовать",
      step: "Шаг",
      items: [
        { title: "Экраном вниз", body: "Переверните телефон экраном вниз, чтобы воде было легче стекать." },
        { title: "Громкость MAX", body: "Установите громкость медиа на максимум (100%)." },
        { title: "Отключите всё", body: "Отключите наушники и зарядку перед запуском." },
        { title: "Не останавливайте", body: "Не останавливайте звук, пока прогресс не дойдёт до 100%." },
      ],
    },
    footer: {
      tip: "Совет: для лучшего результата держите динамик направленным вниз.",
      made: "Сделано с любовью и Web Audio API",
    },
    a11y: {
      start: "Начать очистку",
      stop: "Остановить очистку",
    },
  },
};

// Pastga ko'chirildi va xavfsiz nomga o'zgartirildi
export const LANGUAGES = [
  { code: "uz", label: "O'zbek", flag: "🇺🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇬🇧" },
];