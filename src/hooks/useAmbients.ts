import * as Tone from "tone";
import { useEffect } from "react";

export function useAmbient() {
  useEffect(() => {
    let isActive = true;

    const drone = new Tone.FMSynth({
      harmonicity: 0.5,
      modulationIndex: 2,
      envelope: {
        attack: 8,
        decay: 0,
        sustain: 1,
        release: 8
      }
    }).toDestination();

    const noise = new Tone.NoiseSynth({
      noise: { type: "brown" },
      envelope: {
        attack: 1,
        decay: 2,
        sustain: 0.3,
        release: 4
      }
    }).toDestination();

    const reverb = new Tone.Reverb({
      decay: 10,
      preDelay: 0.1
    }).toDestination();

    const autoFilter = new Tone.AutoFilter({
      frequency: 0.1,
      depth: 0.5,
      baseFrequency: 100
    }).toDestination();

    const distortion = new Tone.Distortion(0.2).toDestination();

    drone.connect(reverb);
    drone.connect(autoFilter);
    noise.connect(reverb);
    noise.connect(distortion);

    const startAudio = async () => {
      await Tone.start();
      
      if (!isActive) return;

      autoFilter.start();
      
      drone.triggerAttack("C1", Tone.now());
      
      noise.triggerAttack();

      const synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sine" },
        envelope: {
          attack: 0.5,
          decay: 1,
          sustain: 0.3,
          release: 2
        }
      }).toDestination();

      synth.connect(reverb);

      const notes = ["C4", "E4", "G4", "B4", "D5", "G4", "E4", "C4"];
      let noteIndex = 0;

      const arpPattern = new Tone.Loop((time) => {
        if (isActive) {
          synth.triggerAttackRelease(notes[noteIndex % notes.length], "8n", time, 0.1);
          noteIndex++;
        }
      }, "4n");

      arpPattern.start(0);
      Tone.getTransport().bpm.value = 60;
      Tone.start();

      const atmSynth = new Tone.MetalSynth({
        envelope: {
          attack: 0.001,
          decay: 0.5,
          release: 1
        },
        harmonicity: 3.1,
        modulationIndex: 16,
        resonance: 4000,
        octaves: 1.5
      }).toDestination();

      atmSynth.connect(reverb);
      atmSynth.volume.value = -20;

      const randomHits = () => {
        if (isActive && Math.random() > 0.7) {
          atmSynth.triggerAttackRelease("8n", Tone.now(), 0.3);
        }
        if (isActive) {
          setTimeout(randomHits, Math.random() * 5000 + 3000);
        }
      };

      setTimeout(randomHits, 3000);
    };

    const handleInteraction = () => {
      startAudio();
      document.removeEventListener('click', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);

    return () => {
      isActive = false;
      document.removeEventListener('click', handleInteraction);
      
      drone.triggerRelease();
      noise.triggerRelease();
      Tone.getTransport().stop();
      
      setTimeout(() => {
        drone.dispose();
        noise.dispose();
        reverb.dispose();
        autoFilter.dispose();
        distortion.dispose();
      }, 2000);
    };
  }, []);
}

export function useSoundEffects() {
  const playClick = () => {
    const synth = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 4,
      oscillator: { type: "sine" },
      envelope: {
        attack: 0.001,
        decay: 0.4,
        sustain: 0.01,
        release: 1.4,
        attackCurve: "exponential"
      }
    }).toDestination();
    
    synth.volume.value = -10;
    synth.triggerAttackRelease("C2", "8n");
    
    setTimeout(() => synth.dispose(), 2000);
  };

  const playSuccess = () => {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0.2,
        release: 0.8
      }
    }).toDestination();

    synth.volume.value = -10;
    synth.triggerAttackRelease(["C5", "E5", "G5"], "8n");
    
    setTimeout(() => synth.dispose(), 2000);
  };

  const playError = () => {
    const synth = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0
      }
    }).toDestination();

    synth.volume.value = -15;
    synth.triggerAttackRelease("16n");
    
    setTimeout(() => synth.dispose(), 1000);
  };

  return { playClick, playSuccess, playError };
}