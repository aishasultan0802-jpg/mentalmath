/**
 * Google Sheets + Google Apps Script visitor counter.
 * Replace COUNTER_API_URL with your deployed Apps Script Web App URL.
 *
 * JSONP is used so the counter also works from a GitHub Pages site
 * without needing cross-origin request permissions.
 */
const COUNTER_API_URL = "https://script.google.com/macros/s/AKfycbxToXXOoMLguymRzdm3AgSgSysFUTKkup581R-hpqyHvIV1p1yqZbjR9gIbKa8poqZr/exec";

document.addEventListener("DOMContentLoaded", () => {
  const counterEl = document.getElementById("participantCount");
  if (!counterEl || !COUNTER_API_URL || COUNTER_API_URL.includes("YOUR_")) return;

  const callbackName = `participantCounter_${Date.now()}`;
  const script = document.createElement("script");

  window[callbackName] = (data) => {
    if (data && typeof data.count === "number") {
      counterEl.textContent = new Intl.NumberFormat("az-AZ").format(data.count);
    }
    cleanup();
  };

  const cleanup = () => {
    delete window[callbackName];
    script.remove();
  };

  script.onerror = cleanup;
  script.src = `${COUNTER_API_URL}?action=visit&prefix=${encodeURIComponent(callbackName)}`;
  document.head.appendChild(script);
});
