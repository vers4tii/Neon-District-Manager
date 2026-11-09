import { useEffect, useRef } from "react";
import { useCityStore } from "../store/cityStore";
import { Terminal } from "lucide-react";

export default function EventFeed() {
  const events = useCityStore((state) => state.events);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="bg-building p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Terminal className="text-energy" size={24} />
        <h2 className="text-neon text-xl font-bold">EVENT LOG</h2>
      </div>

      {/* Announces the newest events to screen readers */}
      <div className="sr-only" role="status" aria-live="polite">
        {events.slice(-2).join(". ")}
      </div>

      <div
        ref={scrollRef}
        role="log"
        aria-live="off"
        aria-label="Event log"
        tabIndex={0}
        className="event-terminal p-3 rounded h-28 overflow-y-auto scrollbar-thin scrollbar-thumb-energy scrollbar-track-bg"
      >
        {events.length === 0 ? (
          <div className="text-energy opacity-50">
            Awaiting system events...
          </div>
        ) : (
          <ul>
            {events.slice(-15).map((e, i) => (
              <li key={i} className="event-item text-energy text-sm">
                <span className="text-neon mr-2">
                  [{new Date().toLocaleTimeString()}]
                </span>
                {e}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
