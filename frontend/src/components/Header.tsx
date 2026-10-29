import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import site from "../data/site.json";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-neutral-900" onClick={() => setOpen(false)}>
          <img src="/logo.svg" alt="" width={28} height={28} />
          <span>
            PPM <span className="text-accent">Creator</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {site.nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg ${
                  isActive ? "text-accent font-medium" : "text-neutral-600 hover:text-accent"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="md:hidden p-2 text-neutral-600"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-neutral-200 px-4 py-2 bg-white">
          {site.nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block py-2 text-sm ${
                  isActive ? "text-accent font-medium" : "text-neutral-600"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
