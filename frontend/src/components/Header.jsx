import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

// Shows the site name and main navigation links.
function Brand() {
  return <Link className="inline-flex items-center gap-[11px] font-display text-[17px] font-bold tracking-[-.04em] no-underline" to="/" aria-label="Northline Construction home"><span className="grid size-[35px] place-items-center rounded-full bg-green font-serif text-[18px] font-bold text-white">N</span><span>Northline <small className="block font-sans text-[9px] font-semibold tracking-[.19em] text-muted">CONSTRUCTION</small></span></Link>;
}

// Shows the main navigation and its small-screen menu button.
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return <header className="relative z-[2] flex h-[84px] items-center justify-between border-b border-[rgba(32,41,35,.08)] bg-paper px-[max(5vw,24px)] max-[760px]:h-[70px] max-[760px]:px-[22px]">
    <Brand />
    <button className="hidden rounded-[3px] border border-line bg-transparent px-[11px] py-[7px] text-[12px] text-ink max-[760px]:block" type="button" aria-expanded={menuOpen} aria-controls="primary-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close' : 'Menu'}</button>
    <nav id="primary-nav" className={`relative flex items-center gap-[36px] max-[760px]:absolute max-[760px]:top-[69px] max-[760px]:left-0 max-[760px]:right-0 max-[760px]:hidden max-[760px]:items-stretch max-[760px]:gap-[17px] max-[760px]:border-b max-[760px]:border-line max-[760px]:bg-paper max-[760px]:px-[22px] max-[760px]:pt-[18px] max-[760px]:pb-[22px] ${menuOpen ? 'max-[760px]:!flex max-[760px]:flex-col' : ''}`} aria-label="Main navigation">
      <NavLink className="text-[14px] text-muted no-underline hover:text-ink [&.active]:text-ink" to="/" end onClick={closeMenu}>Home</NavLink><NavLink className="text-[14px] text-muted no-underline hover:text-ink [&.active]:text-ink" to="/contact" onClick={closeMenu}>Contact</NavLink><Link className="inline-flex min-h-[42px] items-center justify-center gap-[23px] rounded-[3px] border border-green bg-green px-[17px] text-[13px] font-semibold text-white no-underline transition duration-200 hover:-translate-y-px hover:bg-green-dark max-[760px]:self-start" to="/contact" onClick={closeMenu}>Request a quote</Link>
    </nav>
  </header>;
}
