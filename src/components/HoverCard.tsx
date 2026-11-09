import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

export type TipLine =
  | { title: string; subtitle?: string }
  | { heading: string }
  | { label: string; value: number | string; invert?: boolean; plain?: boolean }
  | { note: string; warn?: boolean; plain?: boolean };

const signed = (n: number) => (n > 0 ? `+${n}` : `${n}`);

// Renders the rows of a tooltip (title, headings, label/value rows, notes)
export function TipLines({ lines }: { lines: TipLine[] }) {
  return (
    <>
      {lines.map((line, i) => {
        if ("title" in line) {
          return (
            <div key={i} className="mb-2">
              <div className="text-sm font-bold text-neon">{line.title}</div>
              {line.subtitle && (
                <div className="text-energy opacity-70">{line.subtitle}</div>
              )}
            </div>
          );
        }
        if ("heading" in line) {
          return (
            <div
              key={i}
              className="mt-2 first:mt-0 mb-1 font-bold text-neon uppercase tracking-wide"
            >
              {line.heading}
            </div>
          );
        }
        if ("note" in line) {
          return (
            <div
              key={i}
              className={`mt-2 leading-snug ${line.warn ? "text-[#ff2e63]" : line.plain ? "text-energy" : "text-energy opacity-70"}`}
            >
              {line.note}
            </div>
          );
        }

        let color = "text-energy";
        let text: string;
        if (typeof line.value === "number") {
          const good = line.invert ? line.value < 0 : line.value > 0;
          const bad = line.invert ? line.value > 0 : line.value < 0;
          color = line.plain
            ? "text-energy"
            : good
              ? "text-energy"
              : bad
                ? "text-[#ff2e63]"
                : "text-energy opacity-60";
          text = line.plain ? line.value.toLocaleString() : signed(line.value);
        } else {
          text = line.value;
        }

        return (
          <div key={i} className="flex justify-between gap-2 text-energy">
            <span>{line.label}</span>
            <span className={`font-bold text-right ${color}`}>{text}</span>
          </div>
        );
      })}
    </>
  );
}

const MARGIN = 8;
const POPOVER_WIDTH = 288;
const MOBILE_BREAKPOINT = 640;

// Wraps a card and shows `content` next to it: on hover with a mouse, on tap
// on touch screens (as a bottom sheet on phones). The popover is rendered in a
// portal, so it is never clipped by a scrolling or overflow-hidden parent.
export function HoverCard({
  content,
  children,
  className = "",
}: {
  content: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState<CSSProperties>({ visibility: "hidden" });
  const anchorRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const pointerType = useRef("mouse");

  useLayoutEffect(() => {
    if (!open) return;

    const place = () => {
      const anchor = anchorRef.current;
      const popover = popoverRef.current;
      if (!anchor || !popover) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      if (vw < MOBILE_BREAKPOINT) {
        // Bottom sheet, above the action bar
        setStyle({
          left: MARGIN,
          right: MARGIN,
          bottom: 120,
          width: "auto",
          maxHeight: "55vh",
          overflowY: "auto",
        });
        return;
      }

      const rect = anchor.getBoundingClientRect();
      const width = Math.min(POPOVER_WIDTH, vw - MARGIN * 2);
      const height = popover.offsetHeight;
      const left = Math.max(
        MARGIN,
        Math.min(rect.left, vw - width - MARGIN),
      );
      let top = rect.bottom + MARGIN;
      if (top + height > vh - MARGIN) {
        const above = rect.top - height - MARGIN;
        top = above >= MARGIN ? above : Math.max(MARGIN, vh - height - MARGIN);
      }
      setStyle({ left, top, width });
    };

    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (anchorRef.current?.contains(target)) return;
      close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    const onScroll = (event: Event) => {
      // Scrolling inside the popover itself must not close it
      if (popoverRef.current?.contains(event.target as Node)) return;
      close();
    };
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    // Mouse users get the tooltip on hover; touch users tap the card body
    if (pointerType.current === "mouse") return;
    if ((event.target as HTMLElement).closest("button")) return;
    setOpen((value) => !value);
  };

  return (
    <div
      ref={anchorRef}
      className={className}
      onPointerDown={(event) => {
        pointerType.current = event.pointerType;
      }}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setOpen(false);
      }}
      onClick={handleClick}
    >
      {children}
      {open &&
        createPortal(
          <div
            ref={popoverRef}
            role="tooltip"
            style={{
              position: "fixed",
              zIndex: 70,
              width: Math.min(POPOVER_WIDTH, window.innerWidth - MARGIN * 2),
              ...style,
            }}
            className="pointer-events-none rounded-lg border border-energy bg-bg p-3 text-xs shadow-[0_0_20px_rgba(20,255,247,0.25)]"
          >
            {content}
          </div>,
          document.body,
        )}
    </div>
  );
}
