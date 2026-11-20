import { useState } from 'react';
import ArrowIcon from './ArrowIcon.jsx';

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

  return <form id="enquiry-form" className="border border-line bg-white p-[34px] max-[760px]:px-[18px] max-[760px]:py-6 [&>h2]:font-serif [&>h2]:text-[31px] [&>h2]:leading-[1.15] [&>h2]:font-medium [&>h2]:tracking-[-.035em] [&_label]:text-[12px] [&_label]:font-semibold [&_label]:text-[#3a463d] [&_label>span]:text-[#a04b35] [&_input]:mt-[7px] [&_input]:min-h-[47px] [&_input]:w-full [&_input]:rounded-[2px] [&_input]:border [&_input]:border-[#dce2da] [&_input]:bg-white [&_input]:px-3 [&_input]:py-[11px] [&_input]:text-[13px] [&_input]:text-ink [&_input]:outline-none [&_input]:focus:border-green [&_input]:focus:shadow-[0_0_0_2px_#315c471c] [&_input]:placeholder:text-[#a0a8a0] [&_select]:mt-[7px] [&_select]:min-h-[47px] [&_select]:w-full [&_select]:rounded-[2px] [&_select]:border [&_select]:border-[#dce2da] [&_select]:bg-white [&_select]:px-3 [&_select]:py-[11px] [&_select]:text-[13px] [&_select]:text-ink [&_select]:outline-none [&_select]:focus:border-green [&_select]:focus:shadow-[0_0_0_2px_#315c471c] [&_textarea]:mt-[7px]  [&_textarea]:w-full [&_textarea]:rounded-[2px] [&_textarea]:border [&_textarea]:border-[#dce2da] [&_textarea]:bg-white [&_textarea]:px-3 [&_textarea]:py-[11px] [&_textarea]:text-[13px] [&_textarea]:text-ink [&_textarea]:outline-none [&_textarea]:focus:border-green [&_textarea]:focus:shadow-[0_0_0_2px_#315c471c] [&_textarea]:placeholder:text-[#a0a8a0] [&_.invalid]:border-[#a04b35] [&_.invalid]:shadow-[0_0_0_2px_rgba(160,75,53,.1)] [&_small]:mt-[5px] [&_small]:block [&_small]:text-[11px]" onSubmit={handleSubmit} onChange={() => setServerMessage(null)} noValidate>
    <h2>Project enquiry</h2><p className="mt-[7px] mb-[25px] text-[12px] text-muted [&>span]:text-[#a04b35]">Fields marked <span>*</span> are required.</p>
    {Object.keys(errors).length > 0 && <div className="my-4 border-l-[3px] border-[#a04b35] bg-[#fbf1ed] px-[14px] py-3 text-[13px] text-[#843d2c]" role="alert">Please review the highlighted fields and try again.</div>}
    <div className="grid grid-cols-2 gap-x-4 gap-y-[17px] max-[760px]:grid-cols-1">
      <label>Full name <span>*</span><input className={errors.name ? 'invalid' : ''} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} name="name" autoComplete="name" placeholder="Your name" />{errors.name && <small className="mt-[5px] block text-[11px] font-medium text-[#a04b35]" id="name-error">{errors.name}</small>}</label>
      <label>Email address <span>*</span><input className={errors.email ? 'invalid' : ''} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} type="email" name="email" autoComplete="email" placeholder="you@example.com" />{errors.email && <small className="mt-[5px] block text-[11px] font-medium text-[#a04b35]" id="email-error">{errors.email}</small>}</label>
      <label>Phone number<input className={errors.phone ? 'invalid' : ''} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined} type="tel" name="phone" autoComplete="tel" placeholder="Your phone number" />{errors.phone && <small className="mt-[5px] block text-[11px] font-medium text-[#a04b35]" id="phone-error">{errors.phone}</small>}</label>
      <label>Project type <span>*</span><select className={errors['project-type'] ? 'invalid' : ''} aria-invalid={Boolean(errors['project-type'])} aria-describedby={errors['project-type'] ? 'type-error' : undefined} name="project-type" defaultValue=""><option value="" disabled>Select a project type</option><option>New build</option><option>Renovation</option><option>Extension</option><option>Other</option></select>{errors['project-type'] && <small className="mt-[5px] block text-[11px] font-medium text-[#a04b35]" id="type-error">{errors['project-type']}</small>}</label>
      <label>Project location<input name="location" autoComplete="address-level2" placeholder="Town or postcode" /></label>
      <label>Estimated budget<select name="budget" defaultValue=""><option value="">Select a range (optional)</option><option>Still working it out</option><option>Under $25,000</option><option>$25,000â€“$75,000</option><option>$75,000â€“$150,000</option><option>$150,000+</option></select></label>
      <label>Ideal start date<input type="month" name="timeline" /></label>
      <label className="col-span-full max-[760px]:col-auto [&_textarea]:min-h-[122px] [&_textarea]:resize-y">Tell us a little about your project <span>*</span><textarea className={"min-h-[122px] resize-y " + (errors.details ? "invalid" : "")} aria-invalid={Boolean(errors.details)} aria-describedby={errors.details ? 'details-error' : undefined} name="details" rows="5" placeholder="What would you like to build or change?" />{errors.details && <small className="mt-[5px] block text-[11px] font-medium text-[#a04b35]" id="details-error">{errors.details}</small>}</label>
    </div>
    <button className="mt-[22px] inline-flex min-h-[52px] items-center justify-center gap-[23px] rounded-[3px] border border-green bg-green px-[22px] text-[14px] font-semibold text-white transition duration-200 hover:-translate-y-px hover:bg-green-dark disabled:cursor-wait" type="submit" disabled={submitting}>{submitting ? 'Sendingâ€¦' : 'Send enquiry'} <ArrowIcon /></button>
    {serverMessage && <div className={serverMessage.type === "success" ? "mt-[18px] grid gap-1 border-l-[3px] border-green bg-[#eef3e9] px-[17px] py-[15px] text-[13px] text-green [&>span]:text-[12px] [&>span]:text-[#526258]" : "my-4 border-l-[3px] border-[#a04b35] bg-[#fbf1ed] px-[14px] py-3 text-[13px] text-[#843d2c]"} role={serverMessage.type === 'success' ? 'status' : 'alert'} aria-live="polite">{serverMessage.text}</div>}
  </form>;
}
