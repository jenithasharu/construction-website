import EnquiryForm from '../components/EnquiryForm.jsx';

// Shows contact information and the project enquiry form.
export default function ContactPage() {
  return <main>
    <section className="contact-hero"><p className="eyebrow">Contact / Request a quote</p><h1>Tell us what you're building.</h1><p>Share a few details and weâ€™ll be in touch to talk through your project. The fields below are a starting point and can be tailored to your process.</p></section>
    <section className="enquiry-layout">
      <aside className="contact-aside"><p className="eyebrow">Start here</p><h2>A good project starts with a conversation.</h2><p>Not sure about all the details yet? Thatâ€™s okay. Tell us what you can, and weâ€™ll take it from there.</p><div className="contact-details"><div><span>Email</span><a href="mailto:hello@example.com">hello@example.com</a></div><div><span>Phone</span><a href="tel:+10000000000">+1 (000) 000-0000</a></div><div><span>Service area</span><p>Your town and surrounding areas</p></div></div><p className="placeholder-note">Contact information shown is placeholder text.</p></aside>
      <EnquiryForm />
    </section>
  </main>;
}
