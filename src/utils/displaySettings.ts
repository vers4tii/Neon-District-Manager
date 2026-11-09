export interface DisplaySettings {
  reduceGlow: boolean;
  highContrast: boolean;
  largeText: boolean;
}

const STORAGE_KEY = "neon-district-display";

const prefers = (query: string) =>
  typeof window !== "undefined" && window.matchMedia(query).matches;

// Saved choice first; otherwise follow the system preferences
export function loadDisplaySettings(): DisplaySettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<DisplaySettings>;
      return {
        reduceGlow: !!parsed.reduceGlow,
        highContrast: !!parsed.highContrast,
        largeText: !!parsed.largeText,
      };
    }
  } catch {
    // storage unavailable or corrupted: fall back to the defaults
  }

  return {
    reduceGlow: prefers("(prefers-reduced-motion: reduce)"),
    highContrast: prefers("(prefers-contrast: more)"),
    largeText: false,
  };
}

export function saveDisplaySettings(settings: DisplaySettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // the choice just won't be remembered
  }
}

// Each setting is a class on <html>, styled in index.css
export function applyDisplaySettings(settings: DisplaySettings) {
  const root = document.documentElement;
  root.classList.toggle("reduce-glow", settings.reduceGlow);
  root.classList.toggle("high-contrast", settings.highContrast);
  root.classList.toggle("large-text", settings.largeText);
}
