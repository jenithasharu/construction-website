import { useState } from 'react';

// Validates and sends the project enquiry to the backend.
export default function EnquiryForm() {
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

  return <form id="enquiry-form" className="enquiry-form" onSubmit={handleSubmit} onChange={() => setServerMessage(null)} noValidate>
    <h2>Project enquiry</h2><p className="form-intro">Fields marked <span>*</span> are required.</p>
    {Object.keys(errors).length > 0 && <div className="error-summary" role="alert">Please review the highlighted fields and try again.</div>}
    <div className="form-grid">
      <label>Full name <span>*</span><input className={errors.name ? 'invalid' : ''} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} name="name" autoComplete="name" placeholder="Your name" />{errors.name && <small className="field-error" id="name-error">{errors.name}</small>}</label>
      <label>Email address <span>*</span><input className={errors.email ? 'invalid' : ''} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} type="email" name="email" autoComplete="email" placeholder="you@example.com" />{errors.email && <small className="field-error" id="email-error">{errors.email}</small>}</label>
      <label>Phone number<input className={errors.phone ? 'invalid' : ''} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined} type="tel" name="phone" autoComplete="tel" placeholder="Your phone number" />{errors.phone && <small className="field-error" id="phone-error">{errors.phone}</small>}</label>
      <label>Project type <span>*</span><select className={errors['project-type'] ? 'invalid' : ''} aria-invalid={Boolean(errors['project-type'])} aria-describedby={errors['project-type'] ? 'type-error' : undefined} name="project-type" defaultValue=""><option value="" disabled>Select a project type</option><option>New build</option><option>Renovation</option><option>Extension</option><option>Other</option></select>{errors['project-type'] && <small className="field-error" id="type-error">{errors['project-type']}</small>}</label>
      <label>Project location<input name="location" autoComplete="address-level2" placeholder="Town or postcode" /></label>
      <label>Estimated budget<select name="budget" defaultValue=""><option value="">Select a range (optional)</option><option>Still working it out</option><option>Under $25,000</option><option>$25,000â€“$75,000</option><option>$75,000â€“$150,000</option><option>$150,000+</option></select></label>
      <label>Ideal start date<input type="month" name="timeline" /></label>
      <label className="full-width">Tell us a little about your project <span>*</span><textarea className={errors.details ? 'invalid' : ''} aria-invalid={Boolean(errors.details)} aria-describedby={errors.details ? 'details-error' : undefined} name="details" rows="5" placeholder="What would you like to build or change?" />{errors.details && <small className="field-error" id="details-error">{errors.details}</small>}</label>
    </div>
    <button className="button" type="submit" disabled={submitting}>{submitting ? 'Sendingâ€¦' : 'Send enquiry'} <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.5 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
    {serverMessage && <div className={serverMessage.type === 'success' ? 'success-message' : 'error-summary'} role={serverMessage.type === 'success' ? 'status' : 'alert'} aria-live="polite">{serverMessage.text}</div>}
  </form>;
}
