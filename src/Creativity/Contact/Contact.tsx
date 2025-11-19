// local card hover handler to avoid missing module error
function CardHoverEffect() {
    return (e: any) => {
        const el = e.currentTarget as HTMLElement;
        if (!el || !e.clientX || !e.clientY) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // store coordinates in CSS variables for any hover effects in CSS
        el.style.setProperty('--mouse-x', `${x}px`);
        el.style.setProperty('--mouse-y', `${y}px`);
    };
}

import { useNavigate } from "react-router-dom";
import charactervi from "../../assets/suffle_logo/charactervi.webp";

const Contact = () => {
  const navigate = useNavigate();
    const handleMouseMove = CardHoverEffect();

  return (
    <section
      id="contact"
      className="relative flex min-h-screen items-center justify-center px-4 py-16 text-[#bfbaff]"
    >
      <div
        className="relative mx-auto w-full max-w-8xl"
        onMouseMove={handleMouseMove}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_top,#b9b4ff_0%,transparent_65%)] opacity-70 blur-3xl"></div>

        <div className="relative overflow-hidden rounded-[2.5rem] border border-[#7268ff]/20 bg-black px-6 py-34 text-center shadow-[0_40px_120px_rgba(88,64,199,0.4)] sm:px-10 md:px-16">
          <p className="font-general text-xs uppercase tracking-[0.35em] text-[#9ca0ff]">Join JX Gaming</p>
          <h2 className="mt-6 font-zentry text-[3rem] uppercase leading-[0.9] text-[#dedcff] sm:text-[4rem] md:text-[4.5rem]">
            <strong>Let&apos;s build the
            <br /> new era of gaming
            <br /> together.</strong>
          </h2>
          <button
            type="button"
            onClick={() => navigate("/scribble")}
            className="relative mt-10 inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-[#dedcff] px-12 text-xs font-semibold uppercase tracking-[0.3em] text-black shadow-[0_16px_40px_rgba(120,99,255,0.55)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(120,99,255,0.7)]"
          >
            Play Now
          </button>

          <div className="absolute left-6 top-12 hidden rotate-[-10deg] transition-all duration-300 hover:drop-shadow-[0_20px_40px_rgba(255,165,0,0.6)] sm:block">
            <img
              src="img/contact-1.webp"
              alt="forge artwork"
              className="h-40 w-40 rounded-2xl object-cover"
              style={{ clipPath: 'polygon(10% 8%, 100% 0, 89% 90%, 29% 88%)' }}
              loading="lazy"
            />
          </div>

          <div className="absolute right-6 top-6 hidden rotate-[12deg] transition-all duration-300 hover:drop-shadow-[0_20px_40px_rgba(255,165,0,0.6)] sm:block">
            <img
              src="img/swordman.webp"
              alt="strategist artwork"
              className="h-36 w-36 rounded-2xl object-cover"
              style={{ clipPath: 'polygon(10% 9%, 100% 0, 88% 86%, 14% 100%)' }}
              loading="lazy"
            />
          </div>

          <div className="absolute bottom-4 left-[65%] hidden -translate-x-1/2 rotate-[-18deg] transition-all duration-300 hover:drop-shadow-[0_20px_40px_rgba(255,165,0,0.6)] sm:block">
            <img
              src="img/contact-2.webp"
              alt="elixir artwork"
              className="h-44 w-44 rounded-2xl object-cover"
              style={{ clipPath: 'polygon(20% 0, 83% 15%, 79% 89%, 0 100%)' }}
              loading="lazy"
            />
          </div>

          <div className="absolute bottom-6 left-6 hidden rotate-[15deg] transition-all duration-300 hover:drop-shadow-[0_20px_40px_rgba(255,165,0,0.6)] sm:block">
            <img
              src={charactervi}
              alt="warrior artwork"
              className="h-40 w-40 rounded-2xl object-cover"
              style={{ clipPath: 'polygon(0 15%, 85% 0, 100% 92%, 12% 100%)' }}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
