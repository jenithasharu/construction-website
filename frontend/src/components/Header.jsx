import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

// Shows the site name and main navigation links.
function Brand() {
  return <Link className="brand" to="/" aria-label="Northline Construction home"><span className="brand-mark">N</span><span>Northline <small>CONSTRUCTION</small></span></Link>;
}

// Shows the main navigation and its small-screen menu button.
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return <header className="site-header">
    <Brand />
    <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="primary-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close' : 'Menu'}</button>
    <nav id="primary-nav" className={`primary-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
      <NavLink to="/" end onClick={closeMenu}>Home</NavLink><NavLink to="/contact" onClick={closeMenu}>Contact</NavLink><Link className="button button-small" to="/contact" onClick={closeMenu}>Request a quote</Link>
    </nav>
  </header>;
}
