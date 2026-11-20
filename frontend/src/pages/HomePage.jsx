import { Link } from 'react-router-dom';
import Hero from '../components/Hero.jsx';

// Adds the shared button style to a navigation link.
function ButtonLink({ to, children, light = false }) {
  return <Link className={`button${light ? ' button-light' : ''}`} to={to}>{children}<span aria-hidden="true">â†’</span></Link>;
}

// Shows the home page sections about the company and its services.
export default function HomePage() {
  return <main>
    <Hero />
    <section className="section intro"><div><p className="eyebrow">A little about us</p><h2>Good work begins with listening.</h2></div><div><p>Every project is different. We take the time to understand what matters to you, explain the next steps clearly, and bring care and craft to every part of the build.</p><Link className="text-link" to="/contact">Start a conversation <span aria-hidden="true">â†’</span></Link></div></section>
    <section className="section services-preview"><div className="section-heading"><div><p className="eyebrow">What we do</p><h2>Room to make it yours.</h2></div><p>Our full service details are coming soon.</p></div><div className="card-grid"><article className="service-card"><span className="card-number">01</span><h3>New builds</h3><p>Thoughtful homes designed around the way you want to live.</p></article><article className="service-card"><span className="card-number">02</span><h3>Renovations</h3><p>Fresh possibilities for the home you already love.</p></article><article className="service-card"><span className="card-number">03</span><h3>Extensions</h3><p>More space, carefully connected to whatâ€™s already there.</p></article></div></section>
    <section className="section process"><p className="eyebrow">How we work</p><h2>Clear steps. No guesswork.</h2><div className="steps"><article><span>01</span><h3>Tell us your idea</h3><p>Share what you have in mind, even if itâ€™s still taking shape.</p></article><article><span>02</span><h3>Make a plan</h3><p>Weâ€™ll talk through the scope, timing, and practical next steps.</p></article><article><span>03</span><h3>Build with confidence</h3><p>We keep you informed as your project moves forward.</p></article></div></section>
    <section className="contact-banner"><div><p className="eyebrow">Have a project in mind?</p><h2>Let's make a start.</h2></div><ButtonLink to="/contact" light>Request a quote</ButtonLink></section>
  </main>;
}
