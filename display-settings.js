/* VIVITEK SHARED DISPLAY SETTINGS */

(function () {
  function initializeDisplaySettings() {

    // Load shared stylesheet
    if (!document.querySelector('link[data-vivitek-display]')) {
      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = "display-settings.css";
      stylesheet.setAttribute("data-vivitek-display", "true");
      document.head.appendChild(stylesheet);
    }

    // Find existing settings area or create one
    let settings = document.querySelector(".display-settings");

    if (!settings) {
      settings = document.createElement("div");
      settings.className = "display-settings";

      const nav = document.querySelector("nav");
      const header = document.querySelector("header");

      if (nav) {
        nav.insertAdjacentElement("afterend", settings);
      } else if (header) {
        header.insertAdjacentElement("afterend", settings);
      } else {
        document.body.prepend(settings);
      }
    }

    // Create switches if they do not already exist
    if (!document.getElementById("darkModeToggle")) {
      settings.insertAdjacentHTML("beforeend",
        '<label><input type="checkbox" id="darkModeToggle"> Dark Mode</label>'
      );
    }

    if (!document.getElementById("desktopModeToggle")) {
      settings.insertAdjacentHTML("beforeend",
        '<label><input type="checkbox" id="desktopModeToggle"> Desktop View</label>'
      );
    }

    const darkToggle = document.getElementById("darkModeToggle");
    const desktopToggle = document.getElementById("desktopModeToggle");

    // Restore saved preferences
    darkToggle.checked = localStorage.getItem("vivitekDarkMode") === "on";
    desktopToggle.checked = localStorage.getItem("vivitekDesktopMode") === "on";

    document.body.classList.toggle("dark-mode", darkToggle.checked);
    document.body.classList.toggle("desktop-mode", desktopToggle.checked);

    // Save and apply Dark Mode
    darkToggle.addEventListener("change", function () {
      document.body.classList.toggle("dark-mode", this.checked);
      localStorage.setItem("vivitekDarkMode", this.checked ? "on" : "off");
    });

    // Save and apply Desktop View
    desktopToggle.addEventListener("change", function () {
      document.body.classList.toggle("desktop-mode", this.checked);
      localStorage.setItem("vivitekDesktopMode", this.checked ? "on" : "off");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeDisplaySettings);
  } else {
    initializeDisplaySettings();
  }
})();
