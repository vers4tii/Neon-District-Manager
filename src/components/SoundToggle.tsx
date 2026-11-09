import { useEffect, useState } from "react";
import * as Tone from "tone";
import { Volume2, VolumeX } from "lucide-react";

const MUTED_KEY = "neon-district-muted";

// Lets players turn the music and sound effects off (and remembers the choice)
export default function SoundToggle() {
  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem(MUTED_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    Tone.getDestination().mute = muted;
    try {
      localStorage.setItem(MUTED_KEY, muted ? "1" : "0");
    } catch {
      // storage unavailable: the choice just won't be remembered
    }
  }, [muted]);

  return (
    <button
      onClick={() => setMuted((value) => !value)}
      aria-pressed={muted}
      aria-label={muted ? "Sound is off. Turn sound on" : "Sound is on. Turn sound off"}
      title={muted ? "Sound is off" : "Sound is on"}
      className="flex items-center gap-2 text-energy border border-energy rounded px-2.5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-energy/10 min-h-[40px]"
    >
      {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  );
}
