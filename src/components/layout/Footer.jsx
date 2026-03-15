import { Film, Globe, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/router/routes";

const exploreLinks = [
  { label: "Top Rated", to: ROUTES.SEARCH },
  { label: "Upcoming", to: ROUTES.SEARCH },
  { label: "Popular", to: ROUTES.SEARCH },
  { label: "Cinemas Near Me", to: ROUTES.SEARCH },
];

const supportLinks = [
  { label: "Help Center", to: "#" },
  { label: "Privacy Policy", to: "#" },
  { label: "Terms of Use", to: "#" },
  { label: "Contact", to: "#" },
];

const socialIcons = [
  { icon: Globe, label: "Website" },
  { icon: Twitter, label: "Twitter" },
  { icon: Instagram, label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="border-t border-primary/20 bg-black/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <Link to={ROUTES.HOME} className="flex items-center gap-2 w-fit">
              <Film size={22} className="text-primary" />
              <span className="text-lg font-extrabold tracking-tight text-text-primary">
                CinemaDark
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-text-secondary">
              Discover the ultimate cinematic experience. Explore thousands of
              movies, TV shows, and cast details with real-time ratings.
            </p>
          </div>

          {/* Explore column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">
              Explore
            </h3>
            <ul className="flex flex-col gap-3">
              {exploreLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-primary/70 transition-colors hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">
              Support
            </h3>
            <ul className="flex flex-col gap-3">
              {supportLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-primary/70 transition-colors hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">
              Follow Us
            </h3>
            <div className="flex gap-3">
              {socialIcons.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-card border border-surface-border text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="mt-10 border-t border-surface-border pt-6 text-center">
          <p className="text-xs text-text-muted">
            © 2024 CinemaDark Movie Database. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
