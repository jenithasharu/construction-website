import { Link } from 'react-router-dom';

// Give the enquiry pages a shared header, navigation, and logout button.
export default function DashboardLayout({ children, onLogout }) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-paper/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Link to="/enquiries" className="flex items-center gap-3 no-underline">
            <span className="grid size-10 place-items-center rounded-full bg-green text-sm font-bold tracking-widest text-white">N</span>
            <span>
              <span className="block font-display text-base font-extrabold tracking-tight text-ink">NORTHLINE</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Admin workspace</span>
            </span>
          </Link>
          <button onClick={onLogout} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-green transition hover:border-green hover:bg-white">
            Log out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">{children}</main>
    </div>
  );
}
