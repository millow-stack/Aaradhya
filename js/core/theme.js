/**
 * themes.js
 * Autonomous Light / Dark Theme Manager
 *
 * Modes:
 *   - manual  : user explicitly chooses light/dark
 *   - daytime : light during daytime, dark at night
 *   - system   : follows OS/browser preference
 *
 * Public API:
 *   ThemeManager.init()
 *   ThemeManager.setMode("manual" | "daytime" | "system")
 *   ThemeManager.setTheme("light" | "dark")
 *   ThemeManager.toggle()
 *   ThemeManager.getMode()
 *   ThemeManager.getTheme()
 */

(() => {
    "use strict";

    const CONFIG = {
        storageKey: "theme-preference",

        // Daytime boundaries
        daytime: {
            lightFrom: 6,   // 06:00
            darkFrom: 18    // 18:00
        },

        // Change these if your application uses different selectors.
        rootSelector: document.documentElement,

        // Optional external CSS files.
        stylesheets: {
            light: null, // "css/light.css"
            dark: null   // "css/dark.css"
        }
    };

    const MODES = Object.freeze({
        MANUAL: "manual",
        DAYTIME: "daytime",
        SYSTEM: "system"
    });

    const THEMES = Object.freeze({
        LIGHT: "light",
        DARK: "dark"
    });

    let currentMode = MODES.SYSTEM;
    let currentTheme = THEMES.LIGHT;

    const mediaQuery = window.matchMedia(
        "(prefers-color-scheme: dark)"
    );

    /* --------------------------------------------------
       Storage
    -------------------------------------------------- */

    function loadPreference() {
        try {
            const stored = localStorage.getItem(CONFIG.storageKey);

            if (!stored) return null;

            return JSON.parse(stored);
        } catch {
            return null;
        }
    }

    function savePreference() {
        localStorage.setItem(
            CONFIG.storageKey,
            JSON.stringify({
                mode: currentMode,
                theme: currentTheme
            })
        );
    }

    /* --------------------------------------------------
       Theme calculation
    -------------------------------------------------- */

    function getSystemTheme() {
        return mediaQuery.matches
            ? THEMES.DARK
            : THEMES.LIGHT;
    }

    function getDaytimeTheme() {
        const hour = new Date().getHours();

        return (
            hour >= CONFIG.daytime.lightFrom &&
            hour < CONFIG.daytime.darkFrom
        )
            ? THEMES.LIGHT
            : THEMES.DARK;
    }

    function calculateTheme() {
        switch (currentMode) {
            case MODES.MANUAL:
                return currentTheme;

            case MODES.DAYTIME:
                return getDaytimeTheme();

            case MODES.SYSTEM:
            default:
                return getSystemTheme();
        }
    }

    /* --------------------------------------------------
       Apply theme
    -------------------------------------------------- */

    function applyTheme(theme) {
        currentTheme = theme;

        const root = CONFIG.rootSelector;

        // CSS-variable approach
        root.setAttribute("data-theme", theme);

        // Useful for CSS media-query overrides
        root.classList.toggle("theme-light", theme === THEMES.LIGHT);
        root.classList.toggle("theme-dark", theme === THEMES.DARK);

        // Accessibility / browser UI
        root.style.colorScheme = theme;

        // Optional external stylesheets
        applyStylesheet(theme);

        // Notify application
        window.dispatchEvent(
            new CustomEvent("themechange", {
                detail: {
                    theme,
                    mode: currentMode
                }
            })
        );
    }

    function applyStylesheet(theme) {
        const href = CONFIG.stylesheets[theme];

        if (!href) return;

        let stylesheet = document.getElementById(
            "theme-stylesheet"
        );

        if (!stylesheet) {
            stylesheet = document.createElement("link");
            stylesheet.id = "theme-stylesheet";
            stylesheet.rel = "stylesheet";

            document.head.appendChild(stylesheet);
        }

        stylesheet.href = href;
    }

    /* --------------------------------------------------
       Mode management
    -------------------------------------------------- */

    function setMode(mode) {
        if (!Object.values(MODES).includes(mode)) {
            throw new Error(
                `Invalid theme mode: ${mode}`
            );
        }

        currentMode = mode;

        const theme = calculateTheme();

        applyTheme(theme);
        savePreference();

        return theme;
    }

    /* --------------------------------------------------
       Manual theme
    -------------------------------------------------- */

    function setTheme(theme) {
        if (!Object.values(THEMES).includes(theme)) {
            throw new Error(
                `Invalid theme: ${theme}`
            );
        }

        currentMode = MODES.MANUAL;
        currentTheme = theme;

        applyTheme(theme);
        savePreference();

        return theme;
    }

    function toggle() {
        const nextTheme =
            currentTheme === THEMES.LIGHT
                ? THEMES.DARK
                : THEMES.LIGHT;

        setTheme(nextTheme);

        return nextTheme;
    }

    /* --------------------------------------------------
       Automatic updates
    -------------------------------------------------- */

    function handleSystemChange() {
        if (currentMode !== MODES.SYSTEM) return;

        applyTheme(getSystemTheme());
    }

    function handleDaytimeChange() {
        if (currentMode !== MODES.DAYTIME) return;

        applyTheme(getDaytimeTheme());
    }

    function scheduleDaytimeCheck() {
        // Re-check every minute.
        setInterval(handleDaytimeChange, 60 * 1000);
    }

    /* --------------------------------------------------
       Initialization
    -------------------------------------------------- */

    function init() {
        const stored = loadPreference();

        if (stored) {
            if (
                Object.values(MODES).includes(
                    stored.mode
                )
            ) {
                currentMode = stored.mode;
            }

            if (
                Object.values(THEMES).includes(
                    stored.theme
                )
            ) {
                currentTheme = stored.theme;
            }
        }

        // Manual mode needs the stored theme.
        // Automatic modes calculate their own theme.
        const theme = calculateTheme();

        applyTheme(theme);

        mediaQuery.addEventListener(
            "change",
            handleSystemChange
        );

        scheduleDaytimeCheck();

        return {
            mode: currentMode,
            theme
        };
    }

    /* --------------------------------------------------
       Public API
    -------------------------------------------------- */

    window.ThemeManager = Object.freeze({
        init,
        setMode,
        setTheme,
        toggle,

        getMode: () => currentMode,
        getTheme: () => currentTheme,

        modes: MODES,
        themes: THEMES
    });
})();