import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#050414] text-slate-100">
      <section className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-24">
        <header className="space-y-4 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8245ec]">
            About
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            I build thoughtful, resilient web experiences.
          </h1>
          <p className="text-base text-slate-400 sm:text-lg">
            I am Jay Gupta, a full-stack developer focused on solving problems with clean design
            and dependable code. My daily toolkit includes the MERN stack, rapid prototyping, and a
            curiosity for how people interact with digital products.
          </p>
        </header>

        <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-[#8245ec]/20 backdrop-blur">
          <h2 className="text-2xl font-semibold text-white">What drives my work</h2>
          <ul className="grid gap-6 md:grid-cols-2">
            <li className="space-y-2">
              <h3 className="text-lg font-semibold text-white">User-first thinking</h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Every interface I craft begins with empathy. I prioritize accessibility, clarity, and
                calm user journeys so teams can ship confidently and users feel welcome.
              </p>
            </li>
            <li className="space-y-2">
              <h3 className="text-lg font-semibold text-white">End-to-end ownership</h3>
              <p className="text-sm leading-relaxed text-slate-400">
                From planning data models to polishing animations, I stay close to the entire lifecycle.
                That focus helps keep features robust, maintainable, and on schedule.
              </p>
            </li>
            <li className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Continuous iteration</h3>
              <p className="text-sm leading-relaxed text-slate-400">
                I champion short feedback loops, generous code reviews, and measurable releases—because
                great products are never static.
              </p>
            </li>
            <li className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Collaborative mindset</h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Designers, PMs, and engineers all bring something vital. I love transparent communication
                and building momentum as a team.
              </p>
            </li>
          </ul>
        </section>

        <section className="rounded-3xl border border-[#8245ec]/30 bg-[#8245ec]/10 p-8 text-center sm:text-left">
          <h2 className="text-2xl font-semibold text-white">Let&apos;s collaborate</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            I&apos;m always excited to tackle new challenges—whether it&apos;s refining an existing platform or
            launching something from scratch. If you have an idea in mind, feel free to reach out.
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#8245ec] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#8245ec]/40 transition hover:scale-[1.015] hover:bg-[#9f5df7] cursor-pointer"
          >
            Start a conversation
          </button>
        </section>
      </section>
    </main>
  );
};

export default AboutPage;
