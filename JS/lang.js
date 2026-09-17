(function () {
  "use strict";
  const dict = {
    az: {
      siteTitle: "ŞİFAHİ HESABLAMA",
      quote: "Riyaziyyat elmlərin şahı, hesab isə tacıdır!",
      quoteAuthor: "Karl Fridrix Qauss",
      add: "Toplama",
      sub: "Çıxma",
      mul: "Vurma",
      div: "Bölmə",
      addsub: "Toplama və Çıxma",
      muldiv: "Vurma və Bölmə",
      tenQuestions: "10 sual",
      tenSeconds: "10 saniyə",
      fourOptions: "4 variant",
      correctMotto: "Doğru Hesabla",
      fastMotto: "Çevik ol",
      winMotto: "Qalib ol",
      preparedBy: "Hazırladı:",
      correct: "Düzgündür!",
      wrong: "Səhv cavab!",
      timeUp: "Vaxt bitdi!",
      result: "Nəticə",
      resultReady: "Nəticən hazırdır.",
      correctAnswers: "Düzgün cavab",
      wrongAnswers: "Səhv cavab",
      time: "Vaxt",
      seconds: "saniyə",
      retry: "↻ Yenidən oyna",
      homeMenu: "Əsas menyu",
      menuAria: "Əsas səhifə",
      answer: "Cavab",
      rightAnswer: "Düzgün cavab",
      right: "Düzgün",
      incorrect: "Səhv",
      insufficient: "QEYRİ-KAFİ",
      sufficient: "KAFİ",
      good: "YAXŞI",
      excellent: "ƏLA",
      congratulations: "TƏBRİKLƏR!",
      winnerSubtitle: "Möhtəşəm nəticə!",
      msgInsufficient: "Daha çox məşq et, hər yeni cəhd səni daha da gücləndirəcək!",
      msgSufficient: "Yaxşı başlanğıcdır! Bir az da məşq et, daha yüksək nəticə əldə edəcəksən.",
      msgGood: "Çox yaxşı nəticədir! Zirvəyə çox yaxınsan, belə davam et!",
      msgExcellent: "Mükəmməlsən, zirvəni əldən vermə!"
    },
    en: {
      siteTitle: "MENTAL MATH",
      quote: "Mathematics is the queen of sciences, and arithmetic is its crown!",
      quoteAuthor: "Carl Friedrich Gauss",
      add: "Addition",
      sub: "Subtraction",
      mul: "Multiplication",
      div: "Division",
      addsub: "Addition & Subtraction",
      muldiv: "Multiplication & Division",
      tenQuestions: "10 questions",
      tenSeconds: "10 seconds",
      fourOptions: "4 options",
      correctMotto: "Calculate Correctly",
      fastMotto: "Be Quick",
      winMotto: "Be a Winner",
      preparedBy: "Prepared by:",
      correct: "Correct!",
      wrong: "Wrong answer!",
      timeUp: "Time's up!",
      result: "Result",
      resultReady: "Your result is ready.",
      correctAnswers: "Correct answers",
      wrongAnswers: "Wrong answers",
      time: "Time",
      seconds: "seconds",
      retry: "↻ Play again",
      homeMenu: "Main menu",
      menuAria: "Home",
      answer: "Answer",
      rightAnswer: "Correct answer",
      right: "Correct",
      incorrect: "Wrong",
      insufficient: "NOT ENOUGH",
      sufficient: "ENOUGH",
      good: "GOOD",
      excellent: "EXCELLENT",
      congratulations: "CONGRATULATIONS!",
      winnerSubtitle: "Amazing result!",
      msgInsufficient: "Keep practicing. Every new attempt makes you stronger!",
      msgSufficient: "A good start! Practice a little more to achieve a higher score.",
      msgGood: "Great result! You are very close to the top. Keep going!",
      msgExcellent: "Excellent! Keep your momentum going!"
    },
    ru: {
      siteTitle: "УСТНЫЙ СЧЁТ",
      quote: "Математика — царица наук, а счёт — её корона!",
      quoteAuthor: "Карл Фридрих Гаусс",
      add: "Сложение",
      sub: "Вычитание",
      mul: "Умножение",
      div: "Деление",
      addsub: "Сложение и вычитание",
      muldiv: "Умножение и деление",
      tenQuestions: "10 вопросов",
      tenSeconds: "10 секунд",
      fourOptions: "4 варианта",
      correctMotto: "Считай правильно",
      fastMotto: "Будь быстрым",
      winMotto: "Побеждай",
      preparedBy: "Подготовила:",
      correct: "Верно!",
      wrong: "Неверный ответ!",
      timeUp: "Время вышло!",
      result: "Результат",
      resultReady: "Ваш результат готов.",
      correctAnswers: "Правильные ответы",
      wrongAnswers: "Неверные ответы",
      time: "Время",
      seconds: "секунд",
      retry: "↻ Играть снова",
      homeMenu: "Главное меню",
      menuAria: "Главная",
      answer: "Ответ",
      rightAnswer: "Правильный ответ",
      right: "Верно",
      incorrect: "Ошибка",
      insufficient: "НЕДОСТАТОЧНО",
      sufficient: "ДОСТАТОЧНО",
      good: "ХОРОШО",
      excellent: "ОТЛИЧНО",
      congratulations: "ПОЗДРАВЛЯЕМ!",
      winnerSubtitle: "Потрясающий результат!",
      msgInsufficient: "Продолжай тренироваться — каждая новая попытка делает тебя сильнее!",
      msgSufficient: "Хорошее начало! Ещё немного практики — и результат станет выше.",
      msgGood: "Очень хороший результат! Ты уже совсем близко к вершине!",
      msgExcellent: "Превосходно! Продолжай в том же духе!"
    }
  };

  const supported = Object.keys(dict);
  const normalize = (value) => supported.includes(value) ? value : "az";
  const urlLang = new URLSearchParams(window.location.search).get("lang");
  let lang = normalize(urlLang || localStorage.getItem("shifahiLang") || document.documentElement.lang || "az");
  localStorage.setItem("shifahiLang", lang);

  const t = (key) => (dict[lang] && dict[lang][key]) || dict.az[key] || key;
  window.i18n = {
    get lang() { return lang; },
    setLanguage(value) {
      const next = normalize(value);
      lang = next;
      localStorage.setItem("shifahiLang", next);
      const onHome = /(^|\/)index\.html?$/i.test(window.location.pathname) || /(^|\/)$/i.test(window.location.pathname);
      if (onHome && next !== normalize(new URLSearchParams(window.location.search).get("lang"))) {
        const url = new URL(window.location.href);
        url.searchParams.set("lang", next);
        window.location.replace(url.href);
        return;
      }
      apply();
    },
    t,
    dict
  };

  function apply() {
    document.documentElement.lang = lang === "en" ? "en" : lang === "ru" ? "ru" : "az";
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.i18nAriaLabel)); });
    document.querySelectorAll("[data-lang]").forEach((button) => {
      button.classList.toggle("active", button.dataset.lang === lang);
      button.setAttribute("aria-pressed", button.dataset.lang === lang ? "true" : "false");
    });
    const title = document.querySelector("title[data-i18n]");
    if (title) title.textContent = t(title.dataset.i18n);
    document.dispatchEvent(new CustomEvent("languagechange", { detail: { lang } }));
  }

  function bindLanguageButtons() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-lang]");
      if (!button) return;
      const next = normalize(button.dataset.lang);
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const onHome = /(^|\/)index\.html?$/i.test(window.location.pathname) || /(^|\/)$/i.test(window.location.pathname);
      if (onHome) {
        localStorage.setItem("shifahiLang", next);
        const url = new URL(window.location.href);
        url.searchParams.set("lang", next);
        window.location.replace(url.href);
      } else {
        setLanguage(next);
      }
    }, true);

    document.querySelectorAll("[data-lang]").forEach((button) => {
      button.setAttribute("type", "button");
      button.style.pointerEvents = "auto";
      button.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          button.click();
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindLanguageButtons();
    apply();
  });

  if (document.readyState !== "loading") {
    bindLanguageButtons();
    apply();
  }
}());
