document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const optionButtons = Array.from(document.querySelectorAll(".option"));
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode") === "muldiv" ? "muldiv" : "addsub";

  const soundFiles = {
    chalk: "./Sounds/chalk_write.wav",
    correct: "./Sounds/correct_answer.mp3",
    wrong: "./Sounds/wrong_answer.mp3",
    timeout: "./Sounds/time_up.mp3",
  };
  const sounds = Object.fromEntries(Object.entries(soundFiles).map(([key, src]) => {
    const audio = new Audio(src); audio.preload = "auto"; return [key, audio];
  }));

  const playSound = (audio) => {
    if (!audio) return;
    try { audio.pause(); audio.currentTime = 0; audio.volume = 1; audio.play().catch(() => {}); } catch (_) {}
  };
  const stopSound = (audio) => {
    if (!audio) return;
    try { audio.pause(); audio.currentTime = 0; } catch (_) {}
  };
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffle = (array) => {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
    return copy;
  };
  const t = (key) => window.i18n ? window.i18n.t(key) : key;

  let answerValue = 0, questionNo = 0, time = 60, timer = null, nextTimeout = null, locked = false, gameStarted = false;
  let currentOptions = [], currentQuestionText = "", elapsedSeconds = 0, correct = 0, wrong = 0;
  const answerReport = [], recentQuestions = new Set();

  function updateStaticLanguage() {
    const addsub = t("addsub");
    const muldiv = t("muldiv");
    $("#modeName").textContent = mode === "addsub" ? addsub : muldiv;
    $("#options").setAttribute("aria-label", t("fourOptions"));
    document.title = `${mode === "addsub" ? addsub : muldiv} — ${t("siteTitle")}`;
  }
  updateStaticLanguage();
  document.addEventListener("languagechange", updateStaticLanguage);

  function buildOptions() {
    const values = new Set([answerValue]);
    const offsets = [-1, 1, -2, 2, -10, 10, -5, 5, -20, 20];
    for (const offset of shuffle(offsets)) {
      const candidate = answerValue + offset;
      if (candidate >= 0 && candidate !== answerValue) values.add(candidate);
      if (values.size >= 4) break;
    }
    let safety = 0;
    while (values.size < 4 && safety++ < 60) {
      const candidate = Math.max(0, answerValue + randomInt(-20, 20));
      if (candidate !== answerValue) values.add(candidate);
    }
    currentOptions = shuffle(Array.from(values).slice(0, 4));
    optionButtons.forEach((button, index) => {
      button.className = "option";
      button.disabled = false;
      button.querySelector("strong").textContent = currentOptions[index];
    });
  }

  function makeQuestion() {
    let a, b, op, key;
    for (let attempt = 0; attempt < 80; attempt++) {
      if (mode === "addsub") {
        a = randomInt(10, 99);
        b = Math.random() < .5 ? randomInt(10, 99) : randomInt(1, 9);
        op = Math.random() < .5 ? "+" : "−";
        if (op === "−") {
          if (b > a) [a, b] = [b, a];
          if (a === b) continue; // eyni ədədlərin çıxılması qadağandır
        }
        answerValue = op === "+" ? a + b : a - b;
      } else {
        const multiplication = Math.random() < .5;
        if (multiplication) {
          a = randomInt(10,99);
          b = randomInt(2,9);
          op = "×";
          answerValue = a*b;
        } else {
          op = "÷";
          const twoDigitDivisor = Math.random() < .5;
          if (twoDigitDivisor) {
            b = randomInt(10,99);
            const q = [];
            for (let n=2; n<=9; n++) if (b*n>=10 && b*n<=99) q.push(n);
            if (!q.length) continue;
            answerValue = q[randomInt(0,q.length-1)];
            a = b * answerValue;
          } else {
            b = randomInt(2,9);
            answerValue = randomInt(2,Math.floor(99/b));
            a = b * answerValue;
            if (a < 10 || a > 99 || a === b) continue;
          }
        }
      }
      key = `${a}${op}${b}`; if (!recentQuestions.has(key)) break;
    }
    recentQuestions.add(key); if (recentQuestions.size > 40) recentQuestions.delete(recentQuestions.values().next().value);
    currentQuestionText = `${a} ${op} ${b} = ?`;
    $("#question").textContent = currentQuestionText;
    buildOptions();
    animateChalkQuestion();
  }

  function animateChalkQuestion() {
    const question = $("#question");
    question.classList.remove("chalk-writing"); void question.offsetWidth; question.classList.add("chalk-writing");
    playSound(sounds.chalk);
  }

  function setFeedback(ok, text) {
    const el=$("#feedback");
    el.textContent=text;
    el.className="feedback "+(ok?"good":"bad");
  }

  function resetTimeoutAlarm() {
    stopSound(sounds.timeout);
    $("#boardTime").classList.remove("critical");
  }

  function startGame() {
    const boardTime = $("#boardTime");
    const feedback = $("#feedback");
    const options = $("#options");

    feedback.textContent = "";
    feedback.className = "feedback";
    boardTime.classList.remove("hidden");
    boardTime.classList.remove("critical");
    options.classList.remove("waiting");
    optionButtons.forEach((button) => {
      button.disabled = true;
      button.className = "option";
      button.querySelector("strong").textContent = "";
    });

    gameStarted = true;
    nextQuestion();
    startGlobalTimer();
  }

  function updateTimeProgress() {
    $("#progress").style.width = `${Math.max(0, Math.min(100, (time / 60) * 100))}%`;
  }

  function nextQuestion() {
    clearTimeout(nextTimeout);
    resetTimeoutAlarm();
    if (!gameStarted || time <= 0) return;
    locked=false; questionNo++;
    makeQuestion();
    $("#counter").textContent = `${questionNo}`;
    $("#feedback").textContent=""; $("#feedback").className="feedback";
    updateTimeProgress();
  }

  function startGlobalTimer() {
    clearInterval(timer);
    time = 60;
    $("#time").textContent = time;
    updateTimeProgress();
    timer = setInterval(() => {
      time--;
      $("#time").textContent = time;
      updateTimeProgress();
      if(time === 5){
        $("#boardTime").classList.add("critical");
        playSound(sounds.timeout);
      }
      if(time <= 0){
        clearInterval(timer);
        timer = null;
        stopSound(sounds.timeout);
        $("#boardTime").classList.remove("critical");
        locked = true;
        optionButtons.forEach(button=>button.disabled=true);
        setFeedback(false,`⏱ ${t("timeUp")}`);
        finishGame();
      }
    },1000);
  }

  function chooseAnswer(index) {
    if(locked || !Number.isInteger(index)) return;
    locked=true; resetTimeoutAlarm();
    const selected=currentOptions[index], isCorrect=selected===answerValue;
    optionButtons.forEach((button,i)=>{button.disabled=true;if(currentOptions[i]===answerValue)button.classList.add("correct");if(i===index&&!isCorrect)button.classList.add("wrong");});
    if(isCorrect){
      correct++; setFeedback(true,`✓ ${t("correct")}`); playSound(sounds.correct);
    } else {
      wrong++; setFeedback(false,`✗ ${t("wrong")} ${t("rightAnswer")}: ${answerValue}`); playSound(sounds.wrong);
    }
    answerReport.push({question:questionNo,text:currentQuestionText,status:isCorrect?"correct":"wrong",selected,correct:answerValue});
    nextTimeout=setTimeout(() => {
      if (time > 0) nextQuestion();
    },900);
  }

  function finishGame(){
    clearInterval(timer); clearTimeout(nextTimeout); resetTimeoutAlarm(); $("#progress").style.width="0%";
    const data={mode,correct,wrong,elapsedSeconds:60-time,answerReport,playedAt:new Date().toISOString()};
    sessionStorage.setItem("shifahiResult",JSON.stringify(data));
    window.location.href="result.html";
  }

  optionButtons.forEach(button=>button.addEventListener("click",()=>chooseAnswer(Number(button.dataset.index))));
  $("#quit").addEventListener("click",()=>{clearInterval(timer);clearTimeout(nextTimeout);resetTimeoutAlarm();window.location.href="index.html";});
  startGame();
});
