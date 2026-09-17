
(function () {
  const COUNTER_URL = "https://script.google.com/macros/s/AKfycbwkhm2FhQbgdc18UpAotjOZ2vbbEALErgCmnp1FQhTh3U55pXVruKKq_TTCqPMBi2J83w/exec";
  const COUNT_ELEMENT_ID = "participantCount";
  const STORAGE_KEY = "sifahi_hesablama_visitor_id";
  const COUNT_CACHE_KEY = "sifahi_hesablama_count";

  function createVisitorId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return "visitor-" + Date.now() + "-" + Math.random().toString(36).slice(2);
  }

  function getVisitorId() {
    try {
      let visitorId = localStorage.getItem(STORAGE_KEY);

      if (!visitorId) {
        visitorId = createVisitorId();
        localStorage.setItem(STORAGE_KEY, visitorId);
      }

      return visitorId;
    } catch (error) {
      return createVisitorId();
    }
  }

  function updateCounter(count) {
    const element = document.getElementById(COUNT_ELEMENT_ID);

    if (element && Number.isFinite(Number(count))) {
      const value = String(count);
      element.textContent = value;

      try {
        localStorage.setItem(COUNT_CACHE_KEY, value);
      } catch (error) {
        // Local storage əlçatan deyilsə, davam et
      }
    }
  }

  function showCachedCount() {
    try {
      const cachedCount = localStorage.getItem(COUNT_CACHE_KEY);

      if (cachedCount !== null && cachedCount !== "") {
        updateCounter(cachedCount);
      }
    } catch (error) {
      // Local storage əlçatan deyilsə, davam et
    }
  }

  function requestCounter() {
    const visitorId = encodeURIComponent(getVisitorId());
    const callbackName =
      "sifahiCounterCallback_" + Date.now() + "_" + Math.random().toString(36).slice(2);

    const script = document.createElement("script");

    window[callbackName] = function (data) {
      if (data && data.ok && typeof data.count !== "undefined") {
        updateCounter(data.count);
      }

      try {
        delete window[callbackName];
      } catch (error) {
        window[callbackName] = undefined;
      }

      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    script.src =
      COUNTER_URL +
      "?action=visit&visitorId=" +
      visitorId +
      "&prefix=" +
      callbackName;

    script.async = true;

    script.onerror = function () {
      try {
        delete window[callbackName];
      } catch (error) {
        window[callbackName] = undefined;
      }

      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    document.head.appendChild(script);
  }

  function startCounter() {
    // Əvvəlki məlum sayı dərhal göstər
    showCachedCount();

    // Sonra Google Sheets-dən aktual sayı al
    requestCounter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startCounter);
  } else {
    startCounter();
  }
})();
```
