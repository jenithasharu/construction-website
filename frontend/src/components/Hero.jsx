import { Link } from 'react-router-dom';

// Shows the home page introduction and construction image.
export default function Hero() {
  return <section className="hero">
    <div className="hero-content"><p className="eyebrow">Built with care. Made to last.</p><h1>A better build starts with a good conversation.</h1><p className="hero-copy">From the first idea to the finishing touches, we're here to make your next construction project feel straightforward.</p><Link className="button" to="/contact">Tell us about your project<span aria-hidden="true">â†’</span></Link><p className="hero-note">Homes Â· Renovations Â· Extensions</p></div>
    <img className="hero-art" src="/images/hero-building.jpg" alt="Modern building under construction" />
  </section>;
}
