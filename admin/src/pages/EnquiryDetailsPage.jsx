import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { apiRequest } from '../api.js';

// Load one enquiry and display its contact and project information.
export default function EnquiryDetailsPage({ onLogout }) {
  const { id } = useParams();
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    apiRequest(`/api/admin/enquiries/${encodeURIComponent(id)}`)
      .then((result) => { if (active) setEnquiry(result.enquiry); })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const fields = enquiry ? [
    ['Email', enquiry.email],
    ['Phone', enquiry.phone],
    ['Project type', enquiry.projectType],
    ['Location', enquiry.location],
    ['Budget', enquiry.budget],
    ['Timeline', enquiry.timeline],
    ['Received', enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleString() : ''],
  ] : [];

  return (
    <DashboardLayout onLogout={onLogout}>
      <Link to="/enquiries" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-green no-underline hover:underline">← All enquiries</Link>
      {loading && <p className="py-12 text-sm text-muted">Loading enquiry…</p>}
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {!loading && enquiry && (
        <>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-green">Enquiry details</p>
          <h1 className="mb-8 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{enquiry.name}</h1>
          <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
            <section className="rounded-2xl border border-line bg-white p-6 shadow-[0_12px_40px_rgba(32,41,35,0.04)] sm:p-8">
              <h2 className="mb-6 font-display text-lg font-bold text-ink">Project overview</h2>
              <dl className="grid gap-x-8 sm:grid-cols-2">
                {fields.map(([label, value]) => <div key={label} className="border-t border-line py-4"><dt className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</dt><dd className="mt-1 text-sm font-medium text-ink">{value || '—'}</dd></div>)}
              </dl>
            </section>
            <section className="rounded-2xl border border-line bg-white p-6 shadow-[0_12px_40px_rgba(32,41,35,0.04)] sm:p-8">
              <h2 className="mb-4 font-display text-lg font-bold text-ink">Project description</h2>
              <p className="whitespace-pre-wrap text-sm leading-7 text-muted">{enquiry.details || 'No description provided.'}</p>
            </section>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
