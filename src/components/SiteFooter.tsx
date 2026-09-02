import { Link } from "@tanstack/react-router";
import { Instagram, Music2, Ghost, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/apfa-logo.png.asset.json";
import { GrassBand } from "@/components/cathedral";

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/allenpremierapfa2025", Icon: Instagram },
  { label: "TikTok", href: "https://tiktok.com/@allenpremierapfa2025", Icon: Music2 },
  { label: "Snapchat", href: "https://snapchat.com/add/apfacademy2025", Icon: Ghost },
  { label: "X", href: "https://x.com/allenpremier201", Icon: Twitter },
  { label: "YouTube", href: "https://youtube.com/@AllenPremierFootballAcademy", Icon: Youtube },
];

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/programs", label: "Programs" },
  { to: "/training", label: "Training" },
  { to: "/coaches", label: "Coaches" },
  { to: "/education", label: "Education" },
  { to: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="mt-20">
      <GrassBand height={40} />
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="neu-circle flex h-16 w-16 items-center justify-center p-2">
              <img src={logo.url} alt="Allen Premier Football Academy crest" className="h-full w-full object-contain" loading="lazy" />
            </span>
            <span>
              <span className="display block text-lg uppercase text-accent">Allen Premier</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                Football Academy
              </span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Catch them young, build them strong. Developing disciplined, tactically intelligent
            footballers from Benin City to the world.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="neu-circle flex h-11 w-11 items-center justify-center text-accent transition-transform active:translate-y-0.5"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="engraved-title mb-4 text-lg uppercase">Navigate</h3>
          <ul className="grid gap-2">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm font-semibold uppercase tracking-wide text-accent hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="engraved-title mb-4 text-lg uppercase">Contact</h3>
          <ul className="grid gap-3 text-sm text-foreground">
            <li className="flex gap-2">
              <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
              Benin City, Edo State, Nigeria
            </li>
            <li className="flex gap-2">
              <Phone size={18} className="mt-0.5 shrink-0 text-primary" />
              <span>
                09050283400
                <br />
                08033459962
                <br />
                08103879566
              </span>
            </li>
            <li className="flex gap-2">
              <Mail size={18} className="mt-0.5 shrink-0 text-primary" />
              <span>
                admin@ap-fa.com
                <br />
                allenpremierapfa2025@gmail.com
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        © 2028 Allen Premier Football Academy
      </div>
    </footer>
  );
}
