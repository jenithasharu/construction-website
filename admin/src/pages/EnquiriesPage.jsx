import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { apiRequest } from '../api.js';

// Load enquiries and show the key project details in a clean table.
export default function EnquiriesPage({ onLogout }) {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    apiRequest('/api/admin/enquiries')
      .then((result) => { if (active) setEnquiries(result.enquiries || []); })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <DashboardLayout onLogout={onLogout}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-green">Project inbox</p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Enquiries</h1>
          <p className="mt-2 text-sm text-muted">A clear view of the people ready to build.</p>
        </div>
        <span className="rounded-full bg-lime/50 px-4 py-2 text-sm font-semibold text-green">{enquiries.length} total</span>
      </div>

      {error && <div role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_12px_40px_rgba(32,41,35,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="bg-[#f0f2eb] text-xs font-bold uppercase tracking-[0.1em] text-muted">
              <tr><th className="px-6 py-4">Name</th><th className="px-6 py-4">Phone</th><th className="px-6 py-4">Project type</th><th className="px-6 py-4">Location</th><th className="px-6 py-4">Received</th><th className="px-6 py-4"><span className="sr-only">Open</span></th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading && <tr><td colSpan="6" className="px-6 py-12 text-center text-sm text-muted">Loading enquiries…</td></tr>}
              {!loading && !error && enquiries.length === 0 && <tr><td colSpan="6" className="px-6 py-12 text-center text-sm text-muted">No enquiries yet. New requests will appear here.</td></tr>}
              {!loading && enquiries.map((enquiry) => (
                <tr key={enquiry._id} className="transition hover:bg-paper/60">
                  <td className="px-6 py-4 font-semibold text-ink">{enquiry.name || '—'}</td>
                  <td className="px-6 py-4 text-sm text-muted">{enquiry.phone || '—'}</td>
                  <td className="px-6 py-4 text-sm text-ink">{enquiry.projectType || '—'}</td>
                  <td className="px-6 py-4 text-sm text-muted">{enquiry.location || '—'}</td>
                  <td className="px-6 py-4 text-sm text-muted">{enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="px-6 py-4 text-right"><Link to={`/enquiries/${enquiry._id}`} className="text-sm font-bold text-green no-underline hover:underline">View <span aria-hidden="true">→</span></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
