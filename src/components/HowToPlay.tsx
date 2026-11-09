import { useEffect, useRef, type ReactNode } from "react";
import {
  AUTO_TURN_SECONDS,
  BASE_ENERGY_PER_TURN,
  BASE_INCOME_PER_TURN,
  BLACKOUT_LIMIT,
  DEBT_LIMIT,
  ENERGY_CONVERT_COST,
  INVEST_COST,
  MAX_ACTIONS_PER_TURN,
  POLLUTION_SAFE_LEVEL,
} from "../store/cityStore";
import { X } from "lucide-react";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-5">
      <h3 className="text-neon font-bold uppercase tracking-wider text-sm mb-2">
        {title}
      </h3>
      <div className="text-slate-100 text-sm leading-relaxed space-y-2">
        {children}
      </div>
    </section>
  );
}

export default function HowToPlay({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Move focus into the dialog, keep it there, and give it back when closing
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusable = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    focusable()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, []);

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[80] overflow-y-auto bg-bg/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-to-play-title"
    >
      <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
        <div className="bg-building rounded-lg p-4 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <h2 id="how-to-play-title" className="holo-title !text-3xl sm:!text-4xl">
              HOW TO PLAY
            </h2>
            <button
              onClick={onClose}
              className="text-energy hover:text-neon p-3 -m-3"
              aria-label="Close"
            >
              <X size={26} />
            </button>
          </div>

          <Section title="🎯 Your goal">
            <p>
              You manage a neon-lit district. Keep it alive for{" "}
              <strong className="text-neon">as many turns as possible</strong>{" "}
              and reach the <strong className="text-neon">highest score</strong>
              . Grow the population, but don't let the city run out of power,
              money, happiness or health.
            </p>
          </Section>

          <Section title="⏱️ How a turn works">
            <p>
              Each turn you have{" "}
              <strong className="text-neon">{MAX_ACTIONS_PER_TURN} actions</strong>{" "}
              (the Automation Tech upgrade gives one more). These use one
              action:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>build, upgrade or demolish</li>
              <li>
                <strong>Invest</strong> – ${INVEST_COST} for +5 happiness
              </li>
              <li>
                <strong>Energy</strong> – sell {ENERGY_CONVERT_COST} energy for
                +$40
              </li>
            </ul>
            <p>
              When you are done, press <strong>Next / End Turn</strong>. The
              district then earns income, uses energy, grows or shrinks, and a
              random event may happen. <strong>Auto</strong> ends the turn for
              you every {AUTO_TURN_SECONDS} seconds.
            </p>
            <p className="text-slate-300">
              Every turn the district also gets a free ${BASE_INCOME_PER_TURN}{" "}
              and {BASE_ENERGY_PER_TURN} energy.
            </p>
          </Section>

          <Section title="💀 You lose if…">
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Blackout</strong> – energy stays at 0 for{" "}
                {BLACKOUT_LIMIT} turns in a row
              </li>
              <li>
                <strong>Revolt</strong> – happiness reaches 0%
              </li>
              <li>
                <strong>Epidemic</strong> – health reaches 0%
              </li>
              <li>
                <strong>Bankruptcy</strong> – budget drops below -$
                {Math.abs(DEBT_LIMIT)}
              </li>
            </ul>
          </Section>

          <Section title="📊 What to watch">
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Energy</strong> – buildings and citizens use it. Build
                Solar Farms before it runs out.
              </li>
              <li>
                <strong>Budget</strong> – pays for everything. Factories earn
                the most.
              </li>
              <li>
                <strong>Pollution</strong> – factories pollute. Above{" "}
                {POLLUTION_SAFE_LEVEL}% it hurts health and happiness.
              </li>
              <li>
                <strong>Health</strong> – heal it with Hospitals and clean the
                air with Parks and Recycling Centers.
              </li>
              <li>
                <strong>Happiness</strong> – also drives how fast the
                population grows.
              </li>
            </ul>
          </Section>

          <Section title="🏆 Score">
            <p>
              Every turn adds your positive income, plus population ÷ 10, plus
              happiness to your score. Your best score is saved in this
              browser.
            </p>
          </Section>

          <Section title="💡 Tips">
            <ul className="list-disc pl-5 space-y-1">
              <li>Hover a card (or tap it on a phone) to see its details.</li>
              <li>Stat tooltips show what will change next turn.</li>
              <li>Some upgrades need another one first (🔒).</li>
              <li>
                A few factories pay well, but plan Hospitals, Parks or
                Recycling Centers before the pollution builds up.
              </li>
            </ul>
          </Section>

          <button className="btn-neon w-full sm:w-auto" onClick={onClose}>
            START PLAYING
          </button>
        </div>
      </div>
    </div>
  );
}
