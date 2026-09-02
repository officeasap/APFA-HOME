import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const WHATSAPP = "2349050283400";

const TOPICS = [
  "Academy registration",
  "Screening competition 2026",
  "Under 15 category",
  "Under 16 category",
  "Under 17 category",
  "Training schedule",
  "Training fees",
  "Education Hub access",
  "Boarding and accommodation",
  "Goalkeeper training",
  "Scouting and trials",
  "International exposure",
  "Coaching staff",
  "Parent enquiries",
  "Sponsorship and partnership",
  "Kit and equipment",
  "Nutrition and fitness",
  "Match fixtures",
  "General enquiry",
];

export function FloatingChat() {
  const [open, setOpen] = useState(false);

  function send(topic: string) {
    const text = encodeURIComponent(
      `Hello Allen Premier Football Academy, I would like to enquire about: ${topic}.`,
    );
    window.open(`https://wa.me/${WHATSAPP}?text=${text}`, "_blank", "noopener");
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open ? (
        <div className="cathedral-card w-[19rem] max-w-[calc(100vw-2.5rem)] overflow-hidden !p-0">
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ background: "#008000", borderRadius: "23px 23px 0 0" }}
          >
            <span className="display text-sm uppercase tracking-wide text-primary-foreground">
              Chat with APFA
            </span>
            <button type="button" aria-label="Close chat" onClick={() => setOpen(false)}>
              <X size={18} className="text-primary-foreground" />
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto p-3">
            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Pick a topic — we reply on WhatsApp
            </p>
            <div className="grid gap-2">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => send(t)}
                  className="cathedral-press rounded-[12px_12px_4px_4px] px-3 py-2 text-left text-sm font-semibold text-accent"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        aria-label="Open chat"
        onClick={() => setOpen((v) => !v)}
        className="btn-firm h-14 w-14 !rounded-full !p-0"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
}
