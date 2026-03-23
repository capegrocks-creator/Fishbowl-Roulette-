import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FishbowlScene } from '@/components/Illustrations';

const BASE = import.meta.env.BASE_URL;
const sandraImg = `${BASE}images/sandra.jpg`;

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleJoinList = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSubmitted(true);
    setTimeout(() => setEmailSubmitted(false), 4000);
    (e.target as HTMLFormElement).reset();
  };

  const navLinks = [
    { label: 'Listen Now', href: '#listen' },
    { label: 'About', href: '#about' },
    { label: 'Episodes', href: '#listen' },
    { label: 'Follow', href: '#join' },
  ];

  return (
    <div className="min-h-screen bg-dark-bg-1 text-light-bg-1 overflow-x-hidden">

      {/* ─── HEADER ─── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-dark-bg-1/92 backdrop-blur-sm py-3 shadow-xl shadow-black/60 border-b border-white/5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="font-serif font-bold text-xl tracking-tight">
            <span className="text-primary">Fishbowl</span>
            <span className="text-accent italic"> Roulette</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <a
                key={l.label}
                href={l.href}
                className="font-sans text-sm tracking-widest uppercase text-light-bg-3 hover:text-accent transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 z-60"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-light-bg-1 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-light-bg-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-light-bg-1 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="md:hidden bg-dark-bg-1/97 backdrop-blur-md border-t border-white/5 px-6 py-6 flex flex-col gap-5">
            {navLinks.map(l => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="font-sans text-base tracking-widest uppercase text-light-bg-1 hover:text-accent transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-dark-bg-1" style={{ minHeight: '100svh' }}>

        {/* RIGHT — Sandra's photo, absolute-positioned to fill right half */}
        <div className="absolute inset-y-0 right-0 w-full md:w-[55%] pointer-events-none">
          <img
            src={sandraImg}
            alt="Sandra, host of Fishbowl Roulette"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: '45% 18%' }}
          />
          {/* Left-edge gradient — photo bleeds into dark left column */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark-bg-1 via-dark-bg-1/60 to-transparent" />
          {/* Bottom-edge gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg-1/80 via-transparent to-transparent" />
          {/* Warm tone overlay */}
          <div className="absolute inset-0" style={{ background: 'rgba(42,16,8,0.22)', mixBlendMode: 'multiply' }} />
        </div>

        {/* On mobile: faint photo visible at top through gradient */}
        <div className="md:hidden absolute inset-x-0 top-0 h-60 pointer-events-none">
          <img
            src={sandraImg}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            style={{ objectPosition: '45% 15%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-bg-1/50 to-dark-bg-1" />
        </div>

        {/* LEFT — copy, above the photo layer */}
        <div className="relative z-10 flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-20 pt-24 pb-16 md:w-[50%]" style={{ minHeight: '100svh' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
            className="space-y-6 max-w-md"
          >
            <p className="font-sans text-accent tracking-[0.22em] uppercase text-xs font-semibold">
              The New Podcast
            </p>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.08] text-light-bg-1">
              You don't get<br />to prepare<br />for this.
            </h1>

            <div className="font-sans text-base md:text-lg text-light-bg-3 leading-relaxed space-y-1">
              <p>We reach into the bowl...<br />and whatever comes out—comes out of us too.</p>
              <p className="font-serif italic text-light-bg-2 text-xl pt-1">No script. No warning. No hiding.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <a
                href="#listen"
                className="inline-flex justify-center items-center gap-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-sans font-semibold tracking-wide transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 text-sm"
              >
                🎧 Drop into the conversation
              </a>
              <a
                href="#join"
                className="inline-flex justify-center items-center gap-2 px-6 py-3.5 rounded-xl bg-transparent border border-light-bg-3/25 hover:border-accent hover:text-accent text-light-bg-1 font-sans font-medium tracking-wide transition-all duration-300 text-sm"
              >
                🔔 Don't miss the next question
              </a>
            </div>
          </motion.div>

          {/* Fishbowl + wine glass scene */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-8 max-w-xs"
          >
            <FishbowlScene />
          </motion.div>
        </div>
      </section>

      {/* ─── ABOUT (This gets real + I'm Sandra) ─── */}
      <section id="about" className="py-20 md:py-28 bg-light-bg-1 text-text-dark relative">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20 items-start">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="space-y-7"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              This gets <span className="text-primary italic">real...</span> fast.
            </h2>
            <ul className="space-y-3 font-sans text-lg text-text-dark/80">
              {['We don\'t overthink it.', 'We don\'t clean it up.', 'We just answer.'].map((item, i) => (
                <li key={i} className="flex items-center gap-4">
                  <span className={`w-7 h-px ${i === 2 ? 'bg-primary' : 'bg-accent'} shrink-0`} />
                  <span className={i === 2 ? 'font-bold text-primary' : ''}>{item}</span>
                </li>
              ))}
            </ul>
            <p className="font-sans text-lg text-text-dark/70 leading-relaxed">
              Sometimes it's funny.<br />
              Sometimes it's uncomfortable.<br />
              Sometimes it hits something you didn't expect.<br /><br />
              <span className="font-semibold text-text-dark">Good. That's the point.</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-7"
          >
            {/* Sandra photo card — editorial framed */}
            <div className="relative inline-block">
              <div className="w-full max-w-[280px] aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl shadow-black/20 border border-accent/20 rotate-1">
                <img
                  src={sandraImg}
                  alt="Sandra, host of Fishbowl Roulette"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: '50% 15%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg-1/60 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-3 -left-3 bg-dark-bg-1 border border-accent/30 rounded-xl px-4 py-2 shadow-lg">
                <p className="font-serif italic text-accent text-sm">Host</p>
              </div>
            </div>

            <div className="space-y-5">
              <h2 className="text-3xl md:text-4xl font-serif font-bold italic">I'm Sandra.</h2>
              <p className="font-sans text-lg text-text-dark/80 leading-relaxed">
                I like real conversations—the kind that don't stay on the surface for long.
              </p>
              <p className="font-sans text-lg text-text-dark/80 leading-relaxed">
                Somewhere along the way, I realized the right question can change everything. So I built this. A space where people stop performing, start telling the truth, and sometimes surprise themselves in the process.
              </p>
              <p className="font-sans text-lg text-text-dark/80 leading-relaxed">
                I'll be right there with them.<br />
                <span className="italic">No script. No pretending. Just seeing what comes up.</span>
              </p>
              <a
                href="#listen"
                className="inline-flex items-center gap-2 text-primary font-sans font-bold tracking-wide uppercase text-sm hover:text-primary-hover transition-colors group"
              >
                Listen to my first episode
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── DARK FEATURE SECTION ─── */}
      <section className="py-16 md:py-24 bg-dark-bg-2 texture-overlay-dark">
        <div className="max-w-5xl mx-auto px-6">

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-2xl md:text-4xl lg:text-5xl font-serif font-semibold text-center mb-12 md:mb-16 leading-tight"
          >
            We pulled the first question...<br />
            <span className="italic text-accent">and it went there.</span>
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
            {[
              { title: 'Beliefs', icon: '🧠', text: "What do you believe when no one's listening?" },
              { title: 'Relationships', icon: '❤️', text: "The stuff we think... but don't always say out loud." },
              { title: 'Wildcards', icon: '🎲', text: 'No rules. No warning.' },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="bg-card text-card-foreground p-7 rounded-2xl shadow-xl shadow-black/40 texture-overlay-light hover:-translate-y-1 transition-transform duration-400 border border-black/5"
              >
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="text-xl font-serif font-bold mb-2">{card.title}</h3>
                <p className="font-sans text-sm text-text-dark/80 leading-relaxed">{card.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className="text-center font-serif italic text-light-bg-3 text-lg md:text-xl"
          >
            The truth is usually one question away.
          </motion.p>
        </div>
      </section>

      {/* ─── PLATFORMS ─── */}
      <section id="listen" className="py-10 md:py-14 bg-dark-bg-2 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <PlatformBtn name="Spotify" icon={<SpotifyIcon />} href="#" />
            <PlatformBtn name="Apple Podcasts" icon={<AppleIcon />} href="#" />
            <PlatformBtn name="YouTube" icon={<YoutubeIcon />} href="#" />
            <PlatformBtn name="TikTok" icon={<TikTokIcon />} href="#" />
          </div>
        </div>
      </section>

      {/* ─── EMAIL CAPTURE ─── */}
      <section id="join" className="py-12 md:py-16 bg-dark-bg-2 border-t border-white/5">
        <div className="max-w-xl mx-auto px-6">
          <form
            onSubmit={handleJoinList}
            className="flex flex-col sm:flex-row gap-3 items-stretch"
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="flex-1 bg-light-bg-2/10 border border-light-bg-3/20 focus:border-accent/60 outline-none rounded-xl px-5 py-3.5 font-sans text-light-bg-1 placeholder:text-light-bg-3/50 transition-all text-sm"
            />
            <button
              type="submit"
              disabled={emailSubmitted}
              className="bg-primary hover:bg-primary-hover text-white rounded-xl px-7 py-3.5 font-sans font-semibold tracking-wide transition-colors duration-300 whitespace-nowrap text-sm disabled:opacity-70"
            >
              {emailSubmitted ? 'You\'re on the list!' : 'Join the List'}
            </button>
          </form>
          <p className="text-center font-sans text-xs text-light-bg-3/40 mt-3">No spam. Just real conversations.</p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-16 md:py-20 bg-dark-bg-1 border-t border-white/5 texture-overlay-dark">
        <div className="max-w-2xl mx-auto px-6 text-center space-y-3">
          <h2 className="text-3xl md:text-5xl font-serif font-bold italic text-light-bg-1">
            Pull up a chair.
          </h2>
          <p className="font-sans text-lg md:text-xl text-light-bg-3 font-light">
            You never know what question is coming next.
          </p>
          <p className="font-serif italic text-accent text-base pt-2">
            Careful... you might get asked next.
          </p>
          <div className="pt-8 border-t border-white/5">
            <p className="font-sans text-xs text-light-bg-3/30 tracking-widest uppercase">
              © {new Date().getFullYear()} Fishbowl Roulette &mdash; fishbowlroulette.com
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

/* ─── Platform button ─── */
const PlatformBtn = ({ name, icon, href }: { name: string; icon: React.ReactNode; href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-dark-bg-3 border border-white/8 hover:border-accent/40 hover:bg-black/40 transition-all duration-300 shadow-md hover:-translate-y-0.5"
  >
    <span className="text-light-bg-3 group-hover:text-accent transition-colors">{icon}</span>
    <span className="font-sans font-medium text-light-bg-1 text-sm tracking-wide">{name}</span>
  </a>
);

/* ─── Platform SVG icons ─── */
const SpotifyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

export default Home;
