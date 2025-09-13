"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";

// Reusable variants for motion 
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const sections = ["hero", "about", "projects", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3, rootMargin: "-100px 0px -100px 0px" }
    );
    sections.forEach((section) => {
      const el = document.getElementById(section);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    el?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(sectionId);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Nav Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 nav-dark shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-zinc-100 tracking-tight">
              Jake Floch
            </div>
            <div className="hidden md:flex items-center gap-2">
              {["Home", "About", "Projects", "Contact"].map((item) => {
                const id =
                  item.toLowerCase() === "home" ? "hero" : item.toLowerCase();
                const active = activeSection === id;
                return (
                  <Button
                    key={item}
                    variant={active ? "default" : "ghost"}
                    size="sm"
                    className={`relative font-medium transition-colors px-4 ${
                      active
                        ? "nav-link-active text-primary-foreground"
                        : "text-zinc-300"
                    }`}
                    onClick={() => scrollToSection(id)}
                    data-grid-shield
                  >
                    {item}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        id="hero"
        className="min-h-screen flex items-center justify-center relative pt-20 text-white cursor-none"
      >
        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="mb-10"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <motion.h1
              className="grid-title text-5xl md:text-7xl font-bold mb-8 text-gray-100 tracking-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-zinc-200 via-zinc-100 to-zinc-400">
                Jake Floch
              </span>
            </motion.h1>
            <motion.p
              className="hero-sub text-lg md:text-2xl text-zinc-300/90 mb-4 font-mono flex items-center justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8 }}
            >
              Aspiring Software Engineer
              <motion.span
                className="ml-2 caret-blink text-purple-400"
                aria-hidden="true"
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              >
                |
              </motion.span>
            </motion.p>
            <p className="text-sm md:text-base text-zinc-500 max-w-lg mx-auto leading-relaxed hidden md:block">
              Student at Emory University studying Computer Science with a
              concentration in A.I. and a Business minor.
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.35, duration: 0.8 }}
          >
            <Button
              onClick={() => scrollToSection("projects")}
              className="cursor-none px-8 py-6 text-sm font-semibold tracking-wider btn-hero-outline"
              data-grid-shield
            >
              View Projects
            </Button>
            <Button
              onClick={() => scrollToSection("contact")}
              variant="outline"
              className="cursor-none px-8 py-6 text-sm font-semibold tracking-wider btn-hero-outline"
              data-grid-shield
            >
              Contact Me
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 relative grid-section">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            className="grid-section-title text-4xl md:text-5xl font-bold text-center mb-20"
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            About Me
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div
              className="space-y-7"
              initial="hidden"
              whileInView="visible"
              variants={fadeUp}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <motion.p
                className="text-lg leading-relaxed text-zinc-300/90"
                variants={fadeUp}
                transition={{ delay: 0.05 }}
              >
                I&apos;m an aspiring software engineer with several years of
                programming experience. I started programming in high school and
                have continued studying Computer Science at Emory. I enjoy the
                problem-solving aspect of development and the satisfaction of
                building something that people actually use.
              </motion.p>
              <motion.p
                className="text-lg leading-relaxed text-zinc-300/90"
                variants={fadeUp}
                transition={{ delay: 0.15 }}
              >
                Currently, I am working as Research Assistant for a lab in the
                Nell Hodgson Woodruff School of Nursing at Emory University. I
                am working with OpenCv and Python to develop and maintain data
                processing pipelines that use thermal imaging data to detect and
                classify pressure injuries.
              </motion.p>
              <motion.div
                className="mt-10"
                variants={fadeIn}
                transition={{ delay: 0.25 }}
              >
                <Card
                  data-surface="glow"
                  className="p-6 md:p-8"
                  role="region"
                  aria-labelledby="connect-links-title"
                >
                  <div className="space-y-5">
                    <div>
                      <h3
                        id="connect-links-title"
                        className="text-lg font-semibold tracking-tight text-zinc-100"
                      >
                        Connect & Links
                      </h3>
                      <p className="text-sm text-zinc-400">
                        Quick access to my profiles and resume
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <motion.a
                        href="https://github.com/JakeFloch"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="group h-12 inline-flex items-center rounded-lg border border-white/10 bg-zinc-900/20 px-4 text-sm text-zinc-200 transition-colors hover:border-white/20 hover:bg-zinc-900/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 will-change-transform"
                        data-grid-shield
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 30,
                        }}
                      >
                        <GitHubLogoIcon className="mr-3 h-5 w-5 text-zinc-400 transition-colors group-hover:text-white" />
                        <span>GitHub</span>
                        <span className="ml-auto text-zinc-500 group-hover:text-zinc-300 transition-colors">
                          ↗
                        </span>
                      </motion.a>

                      <motion.a
                        href="https://www.linkedin.com/in/jake-floch/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="group h-12 inline-flex items-center rounded-lg border border-white/10 bg-zinc-900/20 px-4 text-sm text-zinc-200 transition-colors hover:border-white/20 hover:bg-zinc-900/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 will-change-transform"
                        data-grid-shield
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 30,
                        }}
                      >
                        <LinkedInLogoIcon className="mr-3 h-5 w-5 text-zinc-400 transition-colors group-hover:text-white" />
                        <span>LinkedIn</span>
                        <span className="ml-auto text-zinc-500 group-hover:text-zinc-300 transition-colors">
                          ↗
                        </span>
                      </motion.a>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div
              className="self-start"
              initial="hidden"
              whileInView="visible"
              variants={fadeUp}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div className="mt-0">
                <motion.div
                  className="mt-0"
                  variants={fadeIn}
                  transition={{ delay: 0.25 }}
                >
                  <h3 className="text-md font-semibold tracking-[0.15em] text-zinc-400 uppercase mb-4">
                    Education & Experience
                  </h3>
                  <ul className="space-y-4 text-md">
                    <li className="flex items-start gap-3">
                      {/* small gradient dot used as bullet point */}
                      <span
                        className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-zinc-200">
                          B.S. Computer Science · Emory University
                        </p>
                        <p className="text-xs text-zinc-500/90">
                          August 2023– May 2027
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span
                        className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-zinc-200">
                          Research Assistant / Developer · Nell Hodgson Woodruff
                          (Emory)
                        </p>
                        <p className="text-xs text-zinc-500/90">
                          July 2025 – Present
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span
                        className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-zinc-200">
                          App Development Intern · Youphoria
                        </p>
                        <p className="text-xs text-zinc-500/90">
                          May – August 2025
                        </p>
                      </div>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="grid-section-title text-4xl md:text-5xl font-bold text-center mb-20">
            Featured Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Unity Game - Top-Down Shooter",
                description:
                  "Two dimensional top-down casino themed arcade shooter game where the player navigates through various levels filled with enemies and obstacles. The player can buy upgrades and wager their character's and their enemies' attributes for money.",
                tech: ["Unity", "C#", "Unity Scripting API"],
                gradient: "from-cyan-300 to-slate-900",
                logo: "/unity-69-logo-png-transparent.png",
                links: {
                  demo: "https://miguelchaveznava.itch.io/raging-gambler",
                  github: "https://github.com/JMBreard/CS370-Raging-Gambler",
                },
              },
              {
                title: "Invitide",
                description:
                  "Invitide is a modern event management platform where users can easily create, manage, and share events with friends, generate AI event descriptions, and track attendance with QR codes.",
                tech: [
                  "Next.js",
                  "TypeScript",
                  "React",
                  "Supabase",
                  "Tailwind",
                  "Socket.io",
                  "Shadcn UI",
                ],
                gradient: "from-gray-500 to-fuchsia-100",
                logo: "/invitide_logo.png",
                links: {
                  demo: "https://invitide.vercel.app/",
                  github: "https://github.com/alexlautin/invitide",
                },
              },
              {
                title: "GalleryBoard",
                description:
                  "GalleryBoard is a collaborative classroom whiteboard platform where teachers can create rooms, students can join with a code, and everyone gets a real-time, private whiteboard. Teachers can view live previews of all student boards.",
                tech: [
                  "Next.js",
                  "TypeScript",
                  "React",
                  "Supabase",
                  "Tailwind",
                  "Shadcn UI",
                ],
                gradient: "from-slate-50 to-gray-100",
                logo: "/galleryboardlogo.png",
                links: {
                  demo: "https://galleryboard.vercel.app/",
                  github: "https://github.com/alexlautin/galleryboard",
                },
              },
            ].map((project, index) => (
              <motion.div
                key={project.title}
                className="group relative"
                initial="hidden"
                whileInView="visible"
                variants={fadeUp}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.65, delay: index * 0.08 }}
              >
                <Card
                  data-surface="glow"
                  className="p-8 transition-all duration-500 h-full hover:shadow-purple-500/10 flex flex-col"
                >
                  <motion.div
                    className={`relative w-full h-48 rounded-xl mb-6 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-300 bg-gradient-to-br ${project.gradient} shadow-inner overflow-hidden`}
                    layout
                  >
                    <Image
                      src={project.logo}
                      alt={`${project.title} logo`}
                      fill
                      className={`object-contain ${
                        project.title === "GalleryBoard"
                          ? "scale-130 p-3"
                          : "p-6"
                      }`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 2}
                    />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-3 text-zinc-100 tracking-tight card-title-minh">
                    {project.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-5 desc-minh">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6 badges-minh">
                    {project.tech.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="tech-badge"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-auto flex space-x-6 text-sm font-medium pt-2">
                    <motion.a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-300 hover:text-purple-200 transition-colors duration-300"
                      whileHover={{ x: 4 }}
                    >
                      Live Demo →
                    </motion.a>
                    <motion.a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-zinc-300 transition-colors duration-300"
                      whileHover={{ x: 4 }}
                    >
                      GitHub →
                    </motion.a>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative grid-section">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="grid-section-title text-4xl md:text-5xl font-bold text-center mb-20">
            Contact
          </h2>
          <Card data-surface="subtle" className="p-8 form-dark">
            <form
              action="https://formspree.io/f/mnnbwlek"
              method="POST"
              className="space-y-6"
            >
              <div>
        {/* data-brand-focus enables the gradient focus ring in CSS */}
                <Input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="h-12"
                  data-brand-focus="true"
                />
              </div>
              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="h-12"
                  data-brand-focus="true"
                />
              </div>
              <div>
                <Textarea
                  name="message"
                  rows={5}
                  placeholder="Your Message"
                  required
                  className="resize-none min-h-40"
                  data-brand-focus="true"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-sm font-semibold tracking-wider"
                data-grid-shield
              >
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-dark relative overflow-hidden py-6 md:py-8">
        {/* Ambient animated glow */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
        >
          <motion.div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-purple-600/10 to-indigo-600/10 blur-3xl"
            animate={{ x: [-40, 40, -40] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <div className="max-w-6xl mx-auto px-6 text-center tracking-wide">
          <motion.div
            className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent mb-6 md:mb-8"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ transformOrigin: "center" }}
          />

          {/* Fade-in text */}
          <motion.p
            className="text-[11px] sm:text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            © 2025 Jake Floch. Built with Next.js and Tailwind CSS.
          </motion.p>
        </div>
      </footer>
    </div>
  );
}
