import { Link } from "react-router-dom";
import site from "../data/site.json";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 text-sm text-neutral-500">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link to="/about" className="hover:text-accent">About</Link>
          <Link to="/contact" className="hover:text-accent">Contact</Link>
          <Link to="/privacy-policy" className="hover:text-accent">Privacy</Link>
          <Link to="/terms" className="hover:text-accent">Terms</Link>
        </div>
        <p>© {site.year} {site.name}. Made in India.</p>
      </div>
    </footer>
  );
}
