import React from "react";
import { useCityStore } from "../store/cityStore";

export default function EventFeed() {
  const events = useCityStore((state) => state.events);

  return (
    <div className="bg-building p-4 rounded-lg mb-4 h-40 overflow-y-auto">
      <h2 className="text-neon mb-2">Event Feed</h2>
      <ul>
        {events.slice(-10).map((e, i) => (
          <li key={i} className="text-energy text-sm">• {e}</li>
        ))}
      </ul>
    </div>
  );
}