import { Link } from 'react-router-dom';

// Shows the brand, short message, and contact link at the bottom of each page.
export default function Footer() {
  return <footer className="site-footer">
    <Link className="brand" to="/" aria-label="Northline Construction home"><span className="brand-mark">N</span><span>Northline <small>CONSTRUCTION</small></span></Link>
    <p>Built with care, from the ground up.</p>
    <div><Link to="/contact">Contact</Link><span>Â© {new Date().getFullYear()} Northline Construction</span></div>
  </footer>;
}
