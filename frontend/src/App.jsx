import { useState } from 'react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';

function Brand() {
  return <Link className="brand" to="/" aria-label="Northline Construction home"><span className="brand-mark">N</span><span>Northline <small>CONSTRUCTION</small></span></Link>;
}

function Header() {
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

function Footer() {
  return <footer className="site-footer"><Brand /><p>Built with care, from the ground up.</p><div><Link to="/contact">Contact</Link><span>© {new Date().getFullYear()} Northline Construction</span></div></footer>;
}

function ButtonLink({ to, children, light = false }) {
  return <Link className={`button${light ? ' button-light' : ''}`} to={to}>{children}<span aria-hidden="true">→</span></Link>;
}

function HomePage() {
  return <main>
    <section className="hero">
      <div className="hero-content"><p className="eyebrow">Built with care. Made to last.</p><h1>A better build starts with a good conversation.</h1><p className="hero-copy">From the first idea to the finishing touches, we're here to make your next construction project feel straightforward.</p><ButtonLink to="/contact">Tell us about your project</ButtonLink><p className="hero-note">Homes · Renovations · Extensions</p></div>
      <img className="hero-art" src="/images/modern-building.jpeg" alt="Modern building under construction" />
    </section>
    <section className="section intro"><div><p className="eyebrow">A little about us</p><h2>Good work begins with listening.</h2></div><div><p>Every project is different. We take the time to understand what matters to you, explain the next steps clearly, and bring care and craft to every part of the build.</p><Link className="text-link" to="/contact">Start a conversation <span aria-hidden="true">→</span></Link></div></section>
    <section className="section services-preview"><div className="section-heading"><div><p className="eyebrow">What we do</p><h2>Room to make it yours.</h2></div><p>Our full service details are coming soon.</p></div><div className="card-grid"><article className="service-card"><span className="card-number">01</span><h3>New builds</h3><p>Thoughtful homes designed around the way you want to live.</p></article><article className="service-card"><span className="card-number">02</span><h3>Renovations</h3><p>Fresh possibilities for the home you already love.</p></article><article className="service-card"><span className="card-number">03</span><h3>Extensions</h3><p>More space, carefully connected to what’s already there.</p></article></div></section>
    <section className="section process"><p className="eyebrow">How we work</p><h2>Clear steps. No guesswork.</h2><div className="steps"><article><span>01</span><h3>Tell us your idea</h3><p>Share what you have in mind, even if it’s still taking shape.</p></article><article><span>02</span><h3>Make a plan</h3><p>We’ll talk through the scope, timing, and practical next steps.</p></article><article><span>03</span><h3>Build with confidence</h3><p>We keep you informed as your project moves forward.</p></article></div></section>
    <section className="contact-banner"><div><p className="eyebrow">Have a project in mind?</p><h2>Let's make a start.</h2></div><ButtonLink to="/contact" light>Request a quote</ButtonLink></section>
  </main>;
}

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  function handleSubmit(event) {
    event.preventDefault();
    if (event.currentTarget.reportValidity()) setSubmitted(true);
  }
  return <main>
    <section className="contact-hero"><p className="eyebrow">Contact / Request a quote</p><h1>Tell us what you're building.</h1><p>Share a few details and we’ll be in touch to talk through your project. The fields below are a starting point and can be tailored to your process.</p></section>
    <section className="enquiry-layout">
      <aside className="contact-aside"><p className="eyebrow">Start here</p><h2>A good project starts with a conversation.</h2><p>Not sure about all the details yet? That’s okay. Tell us what you can, and we’ll take it from there.</p><div className="contact-details"><div><span>Email</span><a href="mailto:hello@example.com">hello@example.com</a></div><div><span>Phone</span><a href="tel:+10000000000">+1 (000) 000-0000</a></div><div><span>Service area</span><p>Your town and surrounding areas</p></div></div><p className="placeholder-note">Contact information shown is placeholder text.</p></aside>
      <form id="enquiry-form" className="enquiry-form" onSubmit={handleSubmit}>
        <h2>Project enquiry</h2><p className="form-intro">Fields marked <span>*</span> are required.</p>
        <div className="form-grid">
          <label>Full name <span>*</span><input name="name" autoComplete="name" required placeholder="Your name" /></label>
          <label>Email address <span>*</span><input type="email" name="email" autoComplete="email" required placeholder="you@example.com" /></label>
          <label>Phone number<input type="tel" name="phone" autoComplete="tel" placeholder="Your phone number" /></label>
          <label>Project type <span>*</span><select name="project-type" required defaultValue=""><option value="" disabled>Select a project type</option><option>New build</option><option>Renovation</option><option>Extension</option><option>Other</option></select></label>
          <label>Project location<input name="location" autoComplete="address-level2" placeholder="Town or postcode" /></label>
          <label>Estimated budget<select name="budget" defaultValue=""><option value="">Select a range (optional)</option><option>Still working it out</option><option>Under $25,000</option><option>$25,000–$75,000</option><option>$75,000–$150,000</option><option>$150,000+</option></select></label>
          <label>Ideal start date<input type="month" name="timeline" /></label>
          <label className="full-width">Tell us a little about your project <span>*</span><textarea name="details" rows="5" required placeholder="What would you like to build or change?" /></label>
        </div>
        <button className="button" type="submit">Send enquiry <span aria-hidden="true">→</span></button>
        <p className="form-note">This demo form does not send data yet. Connect it to your preferred email or form service to receive enquiries.</p>
        <p className="form-status" role="status" aria-live="polite">{submitted ? 'Thanks for sharing your project. This demo form is ready to connect to an enquiry service.' : ''}</p>
      </form>
    </section>
  </main>;
}

export default function App() {
  return <><Header /><Routes><Route path="/" element={<HomePage />} /><Route path="/contact" element={<ContactPage />} /><Route path="*" element={<HomePage />} /></Routes><Footer /></>;
}
