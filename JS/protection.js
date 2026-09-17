/*
 * Basic browser-side protection for the public website.
 * This only blocks common right-click / source / developer-tools shortcuts.
 * It does NOT make client-side HTML/CSS/JS impossible to access.
 */
(function () {
  'use strict';

  // Disable the browser context menu (right-click).
  document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
  });

  // Block common shortcuts used to open/view source or developer tools.
  document.addEventListener('keydown', function (event) {
    const key = String(event.key || '').toLowerCase();

    const blocked =
      key === 'f12' ||
      (event.ctrlKey && event.shiftKey && ['i', 'j', 'c'].includes(key)) ||
      (event.ctrlKey && key === 'u');

    if (blocked) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
})();
