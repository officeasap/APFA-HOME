import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  GraduationCap,
  House,
  MessageCircle,
  Send,
  ShieldCheck,
  Trophy,
  Users,
  X,
} from "lucide-react";

class APFAWhatsAppService {
  private static instance: APFAWhatsAppService;

  static getInstance(): APFAWhatsAppService {
    if (!APFAWhatsAppService.instance) {
      APFAWhatsAppService.instance = new APFAWhatsAppService();
    }

    return APFAWhatsAppService.instance;
  }

  private readonly phoneNumber = "2348103879566";

  openWhatsAppDirectly(message: string): void {
    const encodedMessage = encodeURIComponent(message);

    const whatsappAppUrl = `whatsapp://send?phone=${this.phoneNumber}&text=${encodedMessage}`;
    const whatsappWebUrl = `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(
      navigator.userAgent,
    );

    if (isMobile) {
      window.location.href = whatsappAppUrl;

      window.setTimeout(() => {
        window.open(
          whatsappWebUrl,
          "_blank",
          "noopener,noreferrer",
        );
      }, 500);

      return;
    }

    window.open(
      whatsappWebUrl,
      "_blank",
      "noopener,noreferrer",
    );
  }
}

const apfaWhatsAppService = APFAWhatsAppService.getInstance();

interface InquiryButton {
  label: string;
  message: string;
  icon: typeof GraduationCap;
}

const INQUIRY_BUTTONS: InquiryButton[] = [
  {
    label: "ACADEMY REGISTRATION",
    message:
      "Hello Allen Premier Football Academy, I would like to enquire about Academy registration. Please provide the registration requirements and process.",
    icon: GraduationCap,
  },
  {
    label: "SCREENING 2026",
    message:
      "Hello Allen Premier Football Academy, I would like to enquire about the 2026 screening competition. Please provide the screening details.",
    icon: CalendarDays,
  },
  {
    label: "UNDER 15",
    message:
      "Hello Allen Premier Football Academy, I would like to enquire about the Under 15 screening category. Please provide the relevant details.",
    icon: Users,
  },
  {
    label: "UNDER 16",
    message:
      "Hello Allen Premier Football Academy, I would like to enquire about the Under 16 screening category. Please provide the relevant details.",
    icon: Users,
  },
  {
    label: "UNDER 17",
    message:
      "Hello Allen Premier Football Academy, I would like to enquire about the Under 17 screening category. Please provide the relevant details.",
    icon: Users,
  },
  {
    label: "TRAINING SCHEDULE",
    message:
      "Hello Allen Premier Football Academy, I would like to enquire about the training schedule. Please provide the available training days and times.",
    icon: CalendarDays,
  },
  {
    label: "TRAINING FEES",
    message:
      "Hello Allen Premier Football Academy, I would like to enquire about training fees. Please provide the current fee structure.",
    icon: CircleHelp,
  },
  {
    label: "EDUCATION HUB",
    message:
      "Hello Allen Premier Football Academy, I would like to enquire about Education Hub access. Please provide information about the available educational programmes and access process.",
    icon: GraduationCap,
  },
  {
    label: "BOARDING",
    message:
      "Hello Allen Premier Football Academy, I would like to enquire about boarding and accommodation options. Please provide the available arrangements.",
    icon: House,
  },
  {
    label: "GOALKEEPER TRAINING",
    message:
      "Hello Allen Premier Football Academy, I would like to enquire about goalkeeper training. Please provide information about the programme.",
    icon: ShieldCheck,
  },
  {
    label: "SCOUTING & TRIALS",
    message:
      "Hello Allen Premier Football Academy, I would like to enquire about scouting and trials. Please provide information about the available opportunities.",
    icon: Trophy,
  },
  {
    label: "INTERNATIONAL EXPOSURE",
    message:
      "Hello Allen Premier Football Academy, I would like to enquire about international exposure opportunities. Please provide further information.",
    icon: Trophy,
  },
  {
    label: "COACHING STAFF",
    message:
      "Hello Allen Premier Football Academy, I would like to enquire about the coaching staff and their areas of expertise. Please provide further information.",
    icon: Users,
  },
  {
    label: "PARENT ENQUIRY",
    message:
      "Hello Allen Premier Football Academy, I am a parent and would like to make an enquiry about the Academy. Please assist me.",
    icon: Users,
  },
  {
    label: "SPONSORSHIP",
    message:
      "Hello Allen Premier Football Academy, I would like to enquire about sponsorship and partnership opportunities. Please provide the appropriate contact information.",
    icon: CheckCircle2,
  },
  {
    label: "KIT & EQUIPMENT",
    message:
      "Hello Allen Premier Football Academy, I would like to enquire about Academy kits and football equipment. Please provide the available options.",
    icon: ShieldCheck,
  },
  {
    label: "NUTRITION & FITNESS",
    message:
      "Hello Allen Premier Football Academy, I would like to enquire about nutrition and fitness support for Academy players. Please provide further information.",
    icon: CheckCircle2,
  },
  {
    label: "MATCH FIXTURES",
    message:
      "Hello Allen Premier Football Academy, I would like to enquire about upcoming match fixtures. Please provide the latest fixture information.",
    icon: CalendarDays,
  },
  {
    label: "GENERAL ENQUIRY",
    message:
      "Hello Allen Premier Football Academy, I have a general enquiry and would appreciate your assistance.",
    icon: MessageCircle,
  },
];

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleOpenChat = (event: Event) => {
      const customEvent = event as CustomEvent<{
        message?: string;
      }>;

      setIsOpen(true);

      if (customEvent.detail?.message) {
        setMessage(customEvent.detail.message);
      }
    };

    window.addEventListener(
      "open-apfa-chat",
      handleOpenChat as EventListener,
    );

    return () => {
      window.removeEventListener(
        "open-apfa-chat",
        handleOpenChat as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const focusTimer = window.setTimeout(() => {
      textareaRef.current?.focus();
    }, 120);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      textareaRef.current?.focus();
      return;
    }

    apfaWhatsAppService.openWhatsAppDirectly(trimmedMessage);

    setIsOpen(false);
    setMessage("");
  };

  const handleInquiry = (inquiryMessage: string) => {
    setMessage(inquiryMessage);

    window.setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  return (
    <>
      {/* =========================================================
          APFA FLOATING CHAT TRIGGER
          Cathedral Law:
          FIRM GREEN EDGE → SOLID SURFACE → DARK PRESSED DEPTH
          No white glow. No blur. No decorative illumination.
          ========================================================= */}
      <button
        type="button"
        aria-label={
          isOpen
            ? "Close Allen Premier Football Academy chat"
            : "Open Allen Premier Football Academy chat"
        }
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          zIndex: 9999,
          width: "58px",
          height: "58px",
          minWidth: "58px",
          minHeight: "58px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "18px",
          border: "3px solid var(--primary-dark)",
          background: "var(--card)",
          color: "var(--primary-dark)",
          boxShadow:
            "8px 8px 18px rgba(30,25,20,0.32), inset 2px 2px 5px rgba(30,25,20,0.10)",
          cursor: "pointer",
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {isOpen ? (
          <X
            style={{
              width: "25px",
              height: "25px",
              display: "block",
              flexShrink: 0,
            }}
            strokeWidth={2.3}
          />
        ) : (
          <MessageCircle
            style={{
              width: "25px",
              height: "25px",
              display: "block",
              flexShrink: 0,
            }}
            strokeWidth={2.3}
          />
        )}
      </button>

      {isOpen ? (
        <>
          {/* =====================================================
              BACKDROP
              ===================================================== */}
          <div
            aria-hidden="true"
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9998,
              background: "rgba(0,0,0,0.62)",
            }}
          />

          {/* =====================================================
              CHAT PANEL
              ===================================================== */}
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="apfa-floating-chat-title"
            onClick={(event) => event.stopPropagation()}
            style={{
              position: "fixed",
              zIndex: 10000,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(92vw, 440px)",
              maxWidth: "440px",
              maxHeight: "calc(100vh - 32px)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              borderRadius: "22px",
              border: "3px solid var(--primary-dark)",
              background: "var(--card)",
              color: "var(--foreground)",
              boxShadow:
                "14px 14px 30px rgba(30,25,20,0.36), inset 3px 3px 8px rgba(30,25,20,0.08)",
            }}
          >
            {/* ===================================================
                HEADER
                =================================================== */}
            <header
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                padding: "14px 16px",
                borderBottom: "2px solid rgba(0,68,0,0.18)",
                background: "var(--card)",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    minWidth: "48px",
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "5px",
                    background: "var(--card)",
                    border: "2px solid rgba(0,68,0,0.22)",
                    boxShadow:
                      "inset 3px 3px 7px rgba(30,25,20,0.20)",
                  }}
                >
                  <img
                    src="/Allen-Premier-Football-Academy-Logo.png"
                    alt="Allen Premier Football Academy official logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                    width={512}
                    height={512}
                  />
                </div>

                <div style={{ minWidth: 0 }}>
                  <h2
                    id="apfa-floating-chat-title"
                    style={{
                      margin: 0,
                      fontSize: "15px",
                      lineHeight: 1.25,
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--primary-dark)",
                    }}
                  >
                    Allen Premier Football Academy
                  </h2>

                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "10px",
                      lineHeight: 1.3,
                      fontWeight: 700,
                      letterSpacing: "0.10em",
                      textTransform: "uppercase",
                      color: "rgba(44,36,32,0.62)",
                    }}
                  >
                    APFA Enquiries
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close chat"
                onClick={() => setIsOpen(false)}
                style={{
                  width: "40px",
                  height: "40px",
                  minWidth: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "12px",
                  border: "2px solid rgba(0,68,0,0.20)",
                  background: "var(--card)",
                  color: "var(--primary-dark)",
                  boxShadow:
                    "4px 4px 9px rgba(30,25,20,0.20), inset 2px 2px 5px rgba(30,25,20,0.08)",
                  cursor: "pointer",
                  touchAction: "manipulation",
                }}
              >
                <X
                  style={{
                    width: "18px",
                    height: "18px",
                    display: "block",
                  }}
                  strokeWidth={2.3}
                />
              </button>
            </header>

            {/* ===================================================
                BODY
                =================================================== */}
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                padding: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              >
                {/* =================================================
                    INTRO
                    ================================================= */}
                <div style={{ textAlign: "center" }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      lineHeight: 1.3,
                      fontWeight: 800,
                      letterSpacing: "0.13em",
                      textTransform: "uppercase",
                      color: "#006b00",
                    }}
                  >
                    How can we help?
                  </h3>

                  <p
                    style={{
                      margin: "7px auto 0",
                      maxWidth: "340px",
                      fontSize: "11px",
                      lineHeight: 1.6,
                      color: "rgba(44,36,32,0.68)",
                    }}
                  >
                    For academy registration, screening, training,
                    player development, education, partnerships,
                    or general enquiries.
                  </p>
                </div>

                {/* =================================================
                    MESSAGE FIELD
                    ================================================= */}
                <div>
                  <label
                    htmlFor="apfa-floating-chat-message"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "10px",
                      lineHeight: 1.3,
                      fontWeight: 800,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "#006b00",
                    }}
                  >
                    Your message
                  </label>

                  <textarea
                    ref={textareaRef}
                    id="apfa-floating-chat-message"
                    value={message}
                    onChange={(event) =>
                      setMessage(event.target.value)
                    }
                    placeholder="Type your message here..."
                    rows={4}
                    maxLength={2000}
                    style={{
                      width: "100%",
                      minWidth: 0,
                      minHeight: "110px",
                      boxSizing: "border-box",
                      resize: "vertical",
                      padding: "13px 14px",
                      borderRadius: "15px",
                      border: "2px solid rgba(0,68,0,0.20)",
                      outline: "none",
                      background: "var(--card)",
                      color: "var(--foreground)",
                      fontFamily: "inherit",
                      fontSize: "16px",
                      lineHeight: 1.5,
                      boxShadow:
                        "inset 5px 6px 12px rgba(30,25,20,0.25), inset -2px -2px 4px rgba(30,25,20,0.08)",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color: "rgba(44,36,32,0.52)",
                      }}
                    >
                      {message.length}/2000
                    </span>
                  </div>
                </div>

                {/* =================================================
                    QUICK ENQUIRIES
                    ================================================= */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "10px",
                        lineHeight: 1.3,
                        fontWeight: 800,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "#006b00",
                      }}
                    >
                      Quick enquiries
                    </p>

                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "rgba(44,36,32,0.50)",
                      }}
                    >
                      Tap to load
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(2, minmax(0, 1fr))",
                      gap: "8px",
                    }}
                  >
                    {INQUIRY_BUTTONS.map((inquiry) => {
                      const Icon = inquiry.icon;
                      const selected =
                        message === inquiry.message;

                      return (
                        <button
                          key={inquiry.label}
                          type="button"
                          aria-pressed={selected}
                          onClick={() =>
                            handleInquiry(inquiry.message)
                          }
                          style={{
                            minWidth: 0,
                            minHeight: "46px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "7px",
                            padding: "8px 9px",
                            borderRadius: "13px",
                            border: selected
                              ? "2px solid var(--primary-dark)"
                              : "1px solid rgba(0,68,0,0.16)",
                            background: "var(--card)",
                            color: "var(--primary-dark)",
                            boxShadow: selected
                              ? "inset 4px 4px 9px rgba(30,25,20,0.23)"
                              : "5px 5px 10px rgba(30,25,20,0.18), inset 1px 1px 3px rgba(30,25,20,0.05)",
                            cursor: "pointer",
                            touchAction: "manipulation",
                            textAlign: "left",
                          }}
                        >
                          <span
                            style={{
                              minWidth: 0,
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <span
                              style={{
                                width: "25px",
                                height: "25px",
                                minWidth: "25px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "8px",
                                background:
                                  "rgba(0,68,0,0.08)",
                                boxShadow:
                                  "inset 2px 2px 4px rgba(30,25,20,0.12)",
                              }}
                            >
                              <Icon
                                style={{
                                  width: "14px",
                                  height: "14px",
                                  display: "block",
                                }}
                                strokeWidth={2.1}
                              />
                            </span>

                            <span
                              style={{
                                minWidth: 0,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                fontSize: "9px",
                                lineHeight: 1.25,
                                fontWeight: 800,
                                letterSpacing: "0.03em",
                              }}
                            >
                              {inquiry.label}
                            </span>
                          </span>

                          <ChevronRight
                            style={{
                              width: "13px",
                              height: "13px",
                              minWidth: "13px",
                              display: "block",
                            }}
                            strokeWidth={2.1}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* =================================================
                    WHATSAPP BUTTON
                    ================================================= */}
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!message.trim()}
                  style={{
                    width: "100%",
                    minHeight: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "9px",
                    padding: "12px 16px",
                    borderRadius: "15px",
                    border: "2px solid var(--primary-dark)",
                    background: message.trim()
                      ? "var(--primary-dark)"
                      : "rgba(0,68,0,0.35)",
                    color: "var(--apfa-text-on-card)",
                    fontFamily: "inherit",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.10em",
                    cursor: message.trim()
                      ? "pointer"
                      : "not-allowed",
                    opacity: message.trim() ? 1 : 0.62,
                    boxShadow:
                      "7px 7px 14px rgba(30,25,20,0.28), inset 2px 2px 5px rgba(0,0,0,0.10)",
                    touchAction: "manipulation",
                  }}
                >
                  <Send
                    style={{
                      width: "16px",
                      height: "16px",
                      display: "block",
                      flexShrink: 0,
                    }}
                    strokeWidth={2.2}
                  />

                  <span>SEND ON WHATSAPP</span>

                  <ChevronRight
                    style={{
                      width: "16px",
                      height: "16px",
                      display: "block",
                      flexShrink: 0,
                    }}
                    strokeWidth={2.2}
                  />
                </button>

                {/* =================================================
                    FOOTER NOTE
                    ================================================= */}
                <p
                  style={{
                    margin: 0,
                    padding: "0 8px",
                    textAlign: "center",
                    fontSize: "9px",
                    lineHeight: 1.5,
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: "rgba(44,36,32,0.48)",
                  }}
                >
                  📱 Opens WhatsApp on your device
                </p>
              </div>
            </div>
          </section>
        </>
      ) : null}
    </>
  );
}

export default FloatingChat;