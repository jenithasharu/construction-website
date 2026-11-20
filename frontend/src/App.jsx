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
      <img className="hero-art" src="/images/hero-building.jpg" alt="Modern building under construction" />
    </section>
    <section className="section intro"><div><p className="eyebrow">A little about us</p><h2>Good work begins with listening.</h2></div><div><p>Every project is different. We take the time to understand what matters to you, explain the next steps clearly, and bring care and craft to every part of the build.</p><Link className="text-link" to="/contact">Start a conversation <span aria-hidden="true">→</span></Link></div></section>
    <section className="section services-preview"><div className="section-heading"><div><p className="eyebrow">What we do</p><h2>Room to make it yours.</h2></div><p>Our full service details are coming soon.</p></div><div className="card-grid"><article className="service-card"><span className="card-number">01</span><h3>New builds</h3><p>Thoughtful homes designed around the way you want to live.</p></article><article className="service-card"><span className="card-number">02</span><h3>Renovations</h3><p>Fresh possibilities for the home you already love.</p></article><article className="service-card"><span className="card-number">03</span><h3>Extensions</h3><p>More space, carefully connected to what’s already there.</p></article></div></section>
    <section className="section process"><p className="eyebrow">How we work</p><h2>Clear steps. No guesswork.</h2><div className="steps"><article><span>01</span><h3>Tell us your idea</h3><p>Share what you have in mind, even if it’s still taking shape.</p></article><article><span>02</span><h3>Make a plan</h3><p>We’ll talk through the scope, timing, and practical next steps.</p></article><article><span>03</span><h3>Build with confidence</h3><p>We keep you informed as your project moves forward.</p></article></div></section>
    <section className="contact-banner"><div><p className="eyebrow">Have a project in mind?</p><h2>Let's make a start.</h2></div><ButtonLink to="/contact" light>Request a quote</ButtonLink></section>
  </main>;
}

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState(null);
  const [errors, setErrors] = useState({});
  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const nextErrors = {};
    if (!values.name?.trim()) nextErrors.name = 'Enter your name.';
    else if (values.name.trim().length < 2) nextErrors.name = 'Name must be at least 2 characters.';
    if (!values.email?.trim()) nextErrors.email = 'Enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (values.phone?.trim() && values.phone.replace(/\D/g, '').length < 7) nextErrors.phone = 'Enter a valid phone number or leave this blank.';
    if (!values['project-type']) nextErrors['project-type'] = 'Choose a project type.';
    if (!values.details?.trim()) nextErrors.details = 'Add a short description of your project.';
    else if (values.details.trim().length < 20) nextErrors.details = 'Please add a little more detail (at least 20 characters).';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setServerMessage(null);
      form.querySelector(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus();
      return;
    }
    setSubmitting(true);
    setServerMessage(null);
    const payload = { ...values, name: values.name.trim(), email: values.email.trim(), details: values.details.trim() };
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl.replace(/\/$/, '')}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Unable to send your enquiry. Please try again.');
      setServerMessage({ type: 'success', text: result.message || 'Enquiry received.' });
      form.reset();
      setErrors({});
    } catch (error) {
      setServerMessage({
        type: 'error',
        text: error instanceof TypeError ? 'Could not reach the enquiry server. Please try again shortly.' : error.message,
      });
    } finally {
      setSubmitting(false);
    }
  }
  return <main>
    <section className="contact-hero"><p className="eyebrow">Contact / Request a quote</p><h1>Tell us what you're building.</h1><p>Share a few details and we’ll be in touch to talk through your project. The fields below are a starting point and can be tailored to your process.</p></section>
    <section className="enquiry-layout">
      <aside className="contact-aside"><p className="eyebrow">Start here</p><h2>A good project starts with a conversation.</h2><p>Not sure about all the details yet? That’s okay. Tell us what you can, and we’ll take it from there.</p><div className="contact-details"><div><span>Email</span><a href="mailto:hello@example.com">hello@example.com</a></div><div><span>Phone</span><a href="tel:+10000000000">+1 (000) 000-0000</a></div><div><span>Service area</span><p>Your town and surrounding areas</p></div></div><p className="placeholder-note">Contact information shown is placeholder text.</p></aside>
      <form id="enquiry-form" className="enquiry-form" onSubmit={handleSubmit} onChange={() => setServerMessage(null)} noValidate>
        <h2>Project enquiry</h2><p className="form-intro">Fields marked <span>*</span> are required.</p>
        {Object.keys(errors).length > 0 && <div className="error-summary" role="alert">Please review the highlighted fields and try again.</div>}
        <div className="form-grid">
          <label>Full name <span>*</span><input className={errors.name ? 'invalid' : ''} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} name="name" autoComplete="name" placeholder="Your name" />{errors.name && <small className="field-error" id="name-error">{errors.name}</small>}</label>
          <label>Email address <span>*</span><input className={errors.email ? 'invalid' : ''} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} type="email" name="email" autoComplete="email" placeholder="you@example.com" />{errors.email && <small className="field-error" id="email-error">{errors.email}</small>}</label>
          <label>Phone number<input className={errors.phone ? 'invalid' : ''} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined} type="tel" name="phone" autoComplete="tel" placeholder="Your phone number" />{errors.phone && <small className="field-error" id="phone-error">{errors.phone}</small>}</label>
          <label>Project type <span>*</span><select className={errors['project-type'] ? 'invalid' : ''} aria-invalid={Boolean(errors['project-type'])} aria-describedby={errors['project-type'] ? 'type-error' : undefined} name="project-type" defaultValue=""><option value="" disabled>Select a project type</option><option>New build</option><option>Renovation</option><option>Extension</option><option>Other</option></select>{errors['project-type'] && <small className="field-error" id="type-error">{errors['project-type']}</small>}</label>
          <label>Project location<input name="location" autoComplete="address-level2" placeholder="Town or postcode" /></label>
          <label>Estimated budget<select name="budget" defaultValue=""><option value="">Select a range (optional)</option><option>Still working it out</option><option>Under $25,000</option><option>$25,000–$75,000</option><option>$75,000–$150,000</option><option>$150,000+</option></select></label>
          <label>Ideal start date<input type="month" name="timeline" /></label>
          <label className="full-width">Tell us a little about your project <span>*</span><textarea className={errors.details ? 'invalid' : ''} aria-invalid={Boolean(errors.details)} aria-describedby={errors.details ? 'details-error' : undefined} name="details" rows="5" placeholder="What would you like to build or change?" />{errors.details && <small className="field-error" id="details-error">{errors.details}</small>}</label>
        </div>
        <button className="button" type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Send enquiry'} <span aria-hidden="true">→</span></button>
        {serverMessage && <div className={serverMessage.type === 'success' ? 'success-message' : 'error-summary'} role={serverMessage.type === 'success' ? 'status' : 'alert'} aria-live="polite">{serverMessage.text}</div>}
      </form>
    </section>
  </main>;
}

export default function App() {
  return <><Header /><Routes><Route path="/" element={<HomePage />} /><Route path="/contact" element={<ContactPage />} /><Route path="*" element={<HomePage />} /></Routes><Footer /></>;
}
