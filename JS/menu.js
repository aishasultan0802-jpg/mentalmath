document.addEventListener("DOMContentLoaded", () => {
  const sound = new Audio("./Sounds/operation_click.mp3");
  sound.preload = "auto";

  const playHoverSound = () => {
    try {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    } catch (_) {}
  };

  const updateLabels = () => {
    const t = (key) => window.i18n ? window.i18n.t(key) : key;
    document.querySelectorAll(".operation").forEach(button => {
      button.setAttribute("aria-label", button.dataset.mode === "muldiv" ? t("muldiv") : t("addsub"));
    });
  };
  updateLabels();
  document.addEventListener("languagechange", updateLabels);

  document.querySelectorAll(".operation").forEach(button => {
    button.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse") playHoverSound();
    }, { passive: true });
    button.addEventListener("click", () => {
      const mode = button.dataset.mode === "muldiv" ? "muldiv" : "addsub";
      const lang = window.i18n ? window.i18n.lang : "az";
      window.location.href = `gameplay.html?mode=${mode}&lang=${encodeURIComponent(lang)}`;
    });
  });
});
