import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  applyDisplaySettings,
  loadDisplaySettings,
  saveDisplaySettings,
  type DisplaySettings as Settings,
} from "../utils/displaySettings";

const OPTIONS: { key: keyof Settings; label: string; hint: string }[] = [
  {
    key: "reduceGlow",
    label: "Reduce glow",
    hint: "Removes glowing text, flicker and shimmer effects.",
  },
  {
    key: "highContrast",
    label: "High contrast",
    hint: "White text on black, solid borders, no dimmed text.",
  },
  {
    key: "largeText",
    label: "Larger text",
    hint: "Makes the text about 19% bigger.",
  },
];

// Lets players tone down the neon look; the choice is remembered
export default function DisplaySettings() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(loadDisplaySettings);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    applyDisplaySettings(settings);
  }, [settings]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggle = (key: keyof Settings) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    saveDisplaySettings(next);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Display settings"
        title="Display settings"
        className="flex items-center gap-2 text-energy border border-energy rounded px-2.5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-energy/10 min-h-[40px]"
      >
        <SlidersHorizontal size={18} />
      </button>

      {open && (
        <div
          role="group"
          aria-label="Display settings"
          className="fixed left-3 right-3 top-16 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-72 z-[75] rounded-lg border border-energy bg-bg p-3 shadow-[0_0_20px_rgba(20,255,247,0.25)]"
        >
          <p className="text-sm font-bold text-neon mb-2">Display</p>
          <ul className="space-y-3">
            {OPTIONS.map((option) => (
              <li key={option.key}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[option.key]}
                    onChange={() => toggle(option.key)}
                    className="mt-1 h-5 w-5 shrink-0 accent-[#ff6bd0]"
                  />
                  <span className="text-sm text-slate-100">
                    <span className="block font-bold">{option.label}</span>
                    <span className="block text-xs text-slate-300">
                      {option.hint}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
