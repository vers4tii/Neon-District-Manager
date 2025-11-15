import * as Tone from "tone";
import { useEffect, useState } from "react";

export function useAmbient() {
  const [audioStarted, setAudioStarted] = useState(false);

  useEffect(() => {
    let isActive = true;
    let synthObjects: any[] = [];

    const startAudio = async () => {
      if (audioStarted) return;
      
      try {
      await Tone.start();
      setAudioStarted(true);
      
      if (!isActive) return;

      Tone.getDestination().volume.value = -20;

        const drone = new Tone.FMSynth({
          harmonicity: 0.5,
          modulationIndex: 2,
          envelope: {
            attack: 8,
            decay: 0,
            sustain: 1,
            release: 8
          },
          volume: -30
        }).toDestination();

        const noise = new Tone.NoiseSynth({
          noise: { type: "brown" },
          envelope: {
            attack: 1,
            decay: 2,
            sustain: 0.3,
            release: 4
          },
          volume: -35
        }).toDestination();

        const reverb = new Tone.Reverb({
          decay: 10,
          preDelay: 0.1,
          wet: 0.3
        }).toDestination();

        const autoFilter = new Tone.AutoFilter({
          frequency: 0.1,
          depth: 0.5,
          baseFrequency: 100,
          wet: 0.5
        }).toDestination();

        drone.connect(reverb);
        drone.connect(autoFilter);
        noise.connect(reverb);

        synthObjects = [drone, noise, reverb, autoFilter];

        autoFilter.start();
        
        drone.triggerAttack("C1", "+0.1");
        
        noise.triggerAttack("+0.2");

        const synth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: "sine" },
          envelope: {
            attack: 0.5,
            decay: 1,
            sustain: 0.3,
            release: 2
          },
          volume: -35
        }).toDestination();

        synth.connect(reverb);
        synthObjects.push(synth);

        const notes = ["C4", "E4", "G4", "B4", "D5", "G4", "E4", "C4"];
        let noteIndex = 0;

        const arpPattern = new Tone.Loop((time) => {
          if (isActive) {
            synth.triggerAttackRelease(notes[noteIndex % notes.length], "8n", time, 0.05);
            noteIndex++;
          }
        }, "2n");

        arpPattern.start(0);
        Tone.getTransport().bpm.value = 40;
        Tone.start();
      } catch (error) {
        console.error("Audio initialization failed:", error);
      }
    };

    const handleInteraction = () => {
      startAudio();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('keydown', handleInteraction, { once: true });

    return () => {
      isActive = false;
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      
      try {
        Tone.getTransport().stop();
        synthObjects.forEach(obj => {
          if (obj && typeof obj.dispose === 'function') {
            obj.dispose();
          }
        });
      } catch (error) {
        console.error("Audio cleanup failed:", error);
      }
    };
  }, [audioStarted]);
}

export function useSoundEffects() {
  const playClick = async () => {
    try {
      await Tone.start();
      const synth = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 4,
        oscillator: { type: "sine" },
        envelope: {
          attack: 0.001,
          decay: 0.4,
          sustain: 0.01,
          release: 0.4
        },
        volume: -25
      }).toDestination();
      
      synth.triggerAttackRelease("C2", "32n");
      setTimeout(() => synth.dispose(), 1000);
    } catch (error) {
      console.error("Click sound failed:", error);
    }
  };

  const playSuccess = async () => {
    try {
      await Tone.start();
      const synth = new Tone.Synth({
        oscillator: { type: "triangle" },
        envelope: {
          attack: 0.01,
          decay: 0.2,
          sustain: 0.1,
          release: 0.3
        },
        volume: -20
      }).toDestination();

      synth.triggerAttackRelease("C5", "16n");
      setTimeout(() => {
        synth.triggerAttackRelease("E5", "16n");
      }, 50);
      
      setTimeout(() => synth.dispose(), 1000);
    } catch (error) {
      console.error("Success sound failed:", error);
    }
  };

  const playError = async () => {
    try {
      await Tone.start();
      const synth = new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: {
          attack: 0.001,
          decay: 0.1,
          sustain: 0
        },
        volume: -25
      }).toDestination();

      synth.triggerAttackRelease("32n");
      setTimeout(() => synth.dispose(), 500);
    } catch (error) {
      console.error("Error sound failed:", error);
    }
  };

  return { playClick, playSuccess, playError };
}