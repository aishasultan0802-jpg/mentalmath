(function () {
  const COUNTER_URL = "https://script.google.com/macros/s/AKfycbxToXXOoMLguymRzdm3AgSgSysFUTKkup581R-hpqyHvIV1p1yqZbjR9gIbKa8po/exec";

  const COUNT_ELEMENT_ID = "participantCount";
  const STORAGE_KEY = "sifahi_hesablama_visitor_id";

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
      element.textContent = String(count);
    }
  }

  function requestCounter() {
    const visitorId = encodeURIComponent(getVisitorId());
    const callbackName = "sifahiCounterCallback_" + Date.now();

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

    const script = document.createElement("script");

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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", requestCounter);
  } else {
    requestCounter();
  }
})();
