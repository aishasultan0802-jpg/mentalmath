
(function () {
  const COUNTER_URL = "https://script.google.com/macros/s/AKfycbwkhm2FhQbgdc18UpAotjOZ2vbbEALErgCmnp1FQhTh3U55pXVruKKq_TTCqPMBi2J83w/exec";

  const COUNT_ELEMENT_ID = "participantCount";
  const VISITOR_KEY = "sifahi_hesablama_visitor_id";
  const COUNT_KEY = "sifahi_hesablama_count";

  function createVisitorId() {
    return "visitor-" +
      Date.now() +
      "-" +
      Math.random().toString(36).substring(2, 15);
  }

  function getVisitorId() {
    try {
      let id = localStorage.getItem(VISITOR_KEY);

      if (!id) {
        id = createVisitorId();
        localStorage.setItem(VISITOR_KEY, id);
      }

      return id;
    } catch (e) {
      return createVisitorId();
    }
  }

  function showCount(count) {
    const element = document.getElementById(COUNT_ELEMENT_ID);

    if (!element || count === undefined || count === null) {
      return;
    }

    element.textContent = String(count);

    try {
      localStorage.setItem(COUNT_KEY, String(count));
    } catch (e) {}
  }

  function showSavedCount() {
    try {
      const saved = localStorage.getItem(COUNT_KEY);

      if (saved) {
        showCount(saved);
      }
    } catch (e) {}
  }

  function loadCounter() {
    const callbackName =
      "counterCallback_" +
      Date.now() +
      "_" +
      Math.random().toString(36).substring(2, 8);

    const visitorId = encodeURIComponent(getVisitorId());

    const script = document.createElement("script");

    window[callbackName] = function (data) {
      if (data && data.ok && data.count !== undefined) {
        showCount(data.count);
      }

      try {
        delete window[callbackName];
      } catch (e) {
        window[callbackName] = undefined;
      }

      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    script.src =
      COUNTER_URL +
      "?action=visit" +
      "&visitorId=" +
      visitorId +
      "&prefix=" +
      encodeURIComponent(callbackName);

    script.async = true;

    script.onerror = function () {
      try {
        delete window[callbackName];
      } catch (e) {
        window[callbackName] = undefined;
      }

      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    document.head.appendChild(script);
  }

  function start() {
    // Əvvəlki məlum sayı dərhal göstər
    showSavedCount();

    // Sonra Google Sheets-dən aktual sayı al
    loadCounter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
```
