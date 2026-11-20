import { Link } from 'react-router-dom';

// Shows the brand, short message, and contact link at the bottom of each page.
export default function Footer() {
  return <footer className="flex items-center justify-between gap-[25px] bg-ink px-[max(5vw,24px)] py-[28px] text-paper max-[760px]:items-start max-[760px]:flex-col max-[760px]:gap-[14px] max-[760px]:px-[22px] max-[760px]:py-[27px]">
    <Link className="inline-flex items-center gap-[11px] font-display text-[17px] font-bold tracking-[-.04em] text-paper no-underline" to="/" aria-label="Northline Construction home"><span className="grid size-[35px] place-items-center rounded-full bg-lime font-serif text-[18px] font-bold text-green">N</span><span>Northline <small className="block font-sans text-[9px] font-semibold tracking-[.19em] text-[#b9c4b9]">CONSTRUCTION</small></span></Link>
    <p className="text-[12px] text-[#c2cbc1] max-[760px]:m-0">Built with care, from the ground up.</p>
    <div className="flex items-center gap-6 text-[11px] text-[#c2cbc1] max-[760px]:w-full max-[760px]:justify-between max-[760px]:gap-[10px]"><Link className="no-underline" to="/contact">Contact</Link><span>Â© {new Date().getFullYear()} Northline Construction</span></div>
  </footer>;
}
