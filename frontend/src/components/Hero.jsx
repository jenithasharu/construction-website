import { Link } from 'react-router-dom';

// Shows the home page introduction and construction image.
export default function Hero() {
  return <section className="grid min-h-[580px] grid-cols-2 items-center gap-[7vw] bg-[#eef0e8] px-[max(8vw,32px)] pt-[70px] pb-[75px] max-[950px]:gap-[4vw] max-[950px]:pl-[6vw] max-[950px]:pr-[6vw] max-[760px]:grid-cols-1 max-[760px]:gap-[34px] max-[760px]:px-[26px] max-[760px]:pt-[60px] max-[760px]:pb-[44px]">
    <div className="max-w-[540px]"><p className="mb-[18px] text-[10px] font-bold uppercase tracking-[.16em] text-green">Built with care. Made to last.</p><h1 className="mb-[22px] max-w-[650px] font-serif text-[clamp(44px,6vw,76px)] leading-[1.06] font-medium tracking-[-.045em] max-[950px]:text-[60px] max-[760px]:text-[52px]">A better build starts with a good conversation.</h1><p className="mb-[28px] max-w-[450px] text-[16px] text-[#59635c]">From the first idea to the finishing touches, we're here to make your next construction project feel straightforward.</p><Link className="inline-flex min-h-[52px] items-center justify-center gap-[23px] rounded-[3px] border border-green bg-green px-[22px] text-[14px] font-semibold text-white no-underline transition duration-200 hover:-translate-y-px hover:bg-green-dark" to="/contact">Tell us about your project<span aria-hidden="true">â†’</span></Link><p className="mt-6 text-[12px] tracking-[.08em] text-muted">Homes Â· Renovations · Extensions</p></div>
    <img className="relative ml-auto h-[380px] w-full max-w-[500px] overflow-hidden rounded-[14px] bg-[#dce5d7] object-cover shadow-[0_18px_42px_rgba(32,41,35,.16)] max-[760px]:h-[280px] max-[760px]:max-w-none" src="/images/hero-building.jpg" alt="Modern building under construction" />
  </section>;
}
