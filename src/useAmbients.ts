import * as Tone from "tone";
import { useEffect } from "react";

export function useAmbient() {
  useEffect(() => {
    const hum = new Tone.NoiseSynth({noise: { type: "brown" }}).toDestination();
    const reverb = new Tone.Reverb(8).toDestination();

    hum.connect(reverb);
    hum.triggerAttack();

    return () => {
      hum.triggerRelease();
      hum.dispose();
      reverb.dispose();
    };
  }, []);
}
