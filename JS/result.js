document.addEventListener("DOMContentLoaded", () => {
  const raw = sessionStorage.getItem("shifahiResult");
  const data = raw ? JSON.parse(raw) : {mode:"addsub",correct:0,wrong:0,elapsedSeconds:0,answerReport:[]};
  const correct = Number(data.correct) || 0;
  const wrong = Number(data.wrong) || 0;
  const seconds = Number(data.elapsedSeconds) || 0;

  const starsFor = (n) => {
    if (n <= 0) return 0;
    if (n <= 4) return 1;
    if (n <= 8) return 2;
    if (n <= 12) return 3;
    if (n <= 14) return 4;
    return 5; // 15 and above
  };

  const stars = starsFor(correct);
  const winner = correct >= 15;

  let titleKey = "insufficient", messageKey = "msgInsufficient";
  if (stars === 3) { titleKey="sufficient"; messageKey="msgSufficient"; }
  else if (stars === 4) { titleKey="good"; messageKey="msgGood"; }
  else if (stars === 5) { titleKey="excellent"; messageKey="msgExcellent"; }

  const t = (key) => window.i18n ? window.i18n.t(key) : key;
  const answeredQuestions = Array.isArray(data.answerReport) ? data.answerReport.length : (correct + wrong);
  const playedAt = data.playedAt ? new Date(data.playedAt) : new Date();

  const render = () => {
    document.title = `${t("result")} — ${t("siteTitle")}`;
    const title = document.querySelector("#resultTitle");
    title.textContent = t(titleKey);
    if (winner) {
      title.innerHTML = `${t("excellent")} <img class="result-trophy" src="./images/kubok.png" alt="Kubok">`;
    }
    document.querySelector("#resultMessage").textContent = t(messageKey);
    document.querySelector("#correct").textContent = correct;
    document.querySelector("#wrong").textContent = wrong;
    document.querySelector("#elapsedTime").textContent = `${seconds} ${t("seconds")}`;
    document.querySelector("#resultStars").innerHTML = Array.from({length:5},(_,i)=>`<span class="star ${i<stars?"earned":"dim"}">★</span>`).join("");
    document.querySelector("#answerReport").innerHTML = (data.answerReport||[]).map(item => {
      const ok = item.status === "correct" || item.status === "Düzgün";
      const statusText = ok ? t("right") : (item.selected === "timeUp" || item.selected === "Vaxt bitdi" ? t("timeUp") : t("incorrect"));
      const selected = item.selected === "timeUp" ? t("timeUp") : item.selected;
      return `<div class="answer-item ${ok?"correct-answer":"wrong-answer"}"><span><b>${item.question}.</b> ${item.text} — ${t("answer")}: <b>${selected}</b>${ok?"":` · ${t("rightAnswer")}: <b>${item.correct}</b>`}</span><span class="answer-status">${ok?"✓ ":"✗ "}${statusText}</span></div>`;
    }).join("");
  };

  render();
  document.addEventListener("languagechange", render);
  const certificateActionWrap = document.querySelector("#certificateActionWrap");
  const certificateModal = document.querySelector("#certificateModal");
  const certificateView = document.querySelector("#certificateView");
  const certificateName = document.querySelector("#certificateName");
  const certificateError = document.querySelector("#certificateError");

  function showCertificateForm() {
    certificateModal.hidden = false;
    certificateModal.setAttribute("aria-hidden", "false");
    certificateError.textContent = "";
    certificateName.value = "";
    setTimeout(() => certificateName.focus(), 50);
  }

  function closeCertificateForm() {
    certificateModal.hidden = true;
    certificateModal.setAttribute("aria-hidden", "true");
  }

  function createCertificate() {
    const name = certificateName.value.trim().replace(/\s+/g, " ");
    if (name.length < 3) {
      certificateError.textContent = "Zəhmət olmasa ad və soyadı yazın.";
      certificateName.focus();
      return;
    }
    const dateText = String(playedAt.getDate()).padStart(2,"0") + "." + String(playedAt.getMonth() + 1).padStart(2,"0") + "." + playedAt.getFullYear();
    document.querySelector("#certificateParticipant").textContent = name;
    document.querySelector("#certificateQuestions").textContent = correct;
    document.querySelector("#certificateStars").textContent = "★".repeat(stars);
    document.querySelector("#certificateText").textContent = `Bu sertifikat ${dateText} tarixində şifahi hesablama oyununda göstərdiyi nəticəyə görə təqdim olunur.`;
    closeCertificateForm();
    certificateView.hidden = false;
    document.querySelector(".result-intro").classList.add("certificate-open");
  }

  if (winner) certificateActionWrap.hidden = false;
  document.querySelector("#certificateBtn").addEventListener("click", showCertificateForm);
  document.querySelector("#certificateClose").addEventListener("click", closeCertificateForm);
  document.querySelector("#certificateCreate").addEventListener("click", createCertificate);
  certificateName.addEventListener("keydown", (event) => { if (event.key === "Enter") createCertificate(); });
  certificateModal.addEventListener("click", (event) => { if (event.target === certificateModal) closeCertificateForm(); });
  document.querySelector("#certificateBack").addEventListener("click", () => { certificateView.hidden = true; document.querySelector(".result-intro").classList.remove("certificate-open"); });
  document.querySelector("#certificatePrint").addEventListener("click", () => window.print());

  document.querySelector("#again").addEventListener("click", () => {
    const lang = window.i18n ? window.i18n.lang : "az";
    window.location.href = `gameplay.html?mode=${data.mode === "muldiv" ? "muldiv" : "addsub"}&lang=${encodeURIComponent(lang)}`;
  });
  document.querySelector("#homeBtn").addEventListener("click", () => window.location.href="index.html");
});
