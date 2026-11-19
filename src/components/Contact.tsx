import { Reveal, SectionLabel } from "./Reveal";
import { SOCIALS } from "./SocialIcons";

export default function Contact() {
  return (
    <section id="contact" className="px-5 py-20 md:px-10 md:py-28">
      <SectionLabel>Contact</SectionLabel>
      <Reveal>
        <h2 className="mt-6 font-display text-[clamp(2rem,4vw,4rem)] leading-[1.05] tracking-[-0.04em] md:mt-8">
          Let&apos;s <em className="text-accent">talk.</em>
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-14 md:mt-16 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <Reveal>
            <p className="max-w-md text-lg leading-relaxed text-fg/75">
              Have a role, a project, or a question? Send a note and I&apos;ll
              get back to you.
            </p>
          </Reveal>
          <ul className="mt-10">
            {SOCIALS.map((s, i) => (
              <li key={s.label}>
                <Reveal delay={i * 0.07}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between border-b border-line py-5 transition-[padding] duration-300 hover:pl-3"
                  >
                    <span className="flex items-center gap-3 font-display text-2xl tracking-[-0.02em] transition-colors duration-300 group-hover:text-accent">
                      <s.Icon className="h-5 w-5 shrink-0" />
                      {s.label}
                    </span>
                    <span className="flex items-center gap-2 text-sm text-dim">
                      {s.handle}
                      <span
                        aria-hidden
                        className="text-base transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      >
                        ↗
                      </span>
                    </span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <Reveal delay={0.1} className="md:col-span-6 md:col-start-7">
          <form
            action="https://formspree.io/f/mnnbwlek"
            method="POST"
            className="space-y-8"
          >
            <div className="grid gap-8 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm text-dim">Name</span>
                <input
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  className="field"
                />
              </label>
              <label className="block">
                <span className="text-sm text-dim">Email</span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="field"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm text-dim">Message</span>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="What's on your mind?"
                className="field resize-none"
              />
            </label>
            <button type="submit" className="btn btn-solid w-full sm:w-auto">
              Send message <span className="arrow">↗</span>
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
