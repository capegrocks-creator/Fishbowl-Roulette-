import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RouletteWheel } from '../components/RouletteWheel';

const BASE = import.meta.env.BASE_URL;
const sandraImg = `${BASE}images/sandra.jpg`;
const fishbowlQuestionsImg = `${BASE}images/fishbowl-questions.png`;
const textureBg = `${BASE}images/dark-texture.png`;

/* ── Theme init: respect localStorage, default to light ── */
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('fr-theme');
    if (stored === 'light' || stored === 'dark') return stored;
  }
  return 'light';
};

const Home = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);

  /* Episode list state — fetched from /api/podcast/episodes on mount.
     Each episode has its own native HTML5 audio element so listeners can
     pick any episode from the list and play it inline. */
  interface FbrEpisode {
    guid: string;
    title: string;
    pubDate: string;
    pubDateMs: number;
    description: string;
    durationSeconds: number | null;
    audioUrl: string;
    episodeUrl: string;
    episodeNumber: number | null;
  }
  const [episodes, setEpisodes] = useState<FbrEpisode[]>([]);
  const [episodesLoading, setEpisodesLoading] = useState(true);
  const [episodesError, setEpisodesError] = useState<string | null>(null);
  const [activeEpisodeGuid, setActiveEpisodeGuid] = useState<string | null>(null);

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    const next: 'light' | 'dark' = isDark ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('fr-theme', next);
  };

  /** Open the Podbean player and scroll to it */
  const openPlayerAndScroll = () => {
    setPlayerOpen(true);
    setTimeout(() => {
      document.getElementById('episodes')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Fetch the full episode list from the Podbean RSS feed (via our API).
     The endpoint is server-cached for 30 minutes, so the list is always
     fresh after each Wednesday's release without code changes. */
  useEffect(() => {
    let cancelled = false;
    const apiBase = `${import.meta.env.BASE_URL}api`.replace(/\/+/g, '/');
    setEpisodesLoading(true);
    fetch(`${apiBase}/podcast/episodes`)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(`status ${r.status}`))))
      .then((data: { episodes?: FbrEpisode[] }) => {
        if (cancelled) return;
        const list = Array.isArray(data?.episodes) ? data.episodes : [];
        setEpisodes(list);
        setEpisodesError(list.length === 0 ? 'No episodes available' : null);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setEpisodesError(err.message || 'Could not load episodes');
      })
      .finally(() => {
        if (!cancelled) setEpisodesLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  /* Helpers for the episode list */
  const formatPubDate = (ms: number): string => {
    if (!ms) return '';
    return new Date(ms).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };
  const formatDuration = (sec: number | null): string => {
    if (sec === null || sec <= 0) return '';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m >= 60) {
      const h = Math.floor(m / 60);
      const mm = m % 60;
      return `${h}h ${mm}m`;
    }
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const handleJoinList = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSubmitted(true);
    setTimeout(() => setEmailSubmitted(false), 4000);
    (e.target as HTMLFormElement).reset();
  };

  const navLinks = [
    { label: 'Listen Now', href: '#episodes' },
    { label: 'About', href: '#about' },
    { label: 'Episodes', href: '#episodes' },
    { label: 'Follow', href: '#join' },
  ];

  /* ── Theme-aware colour tokens ── */
  const bg        = isDark ? '#1a1008' : '#F7F5F2';
  const bgAlt     = isDark ? '#1e1009' : '#EEE9E1';
  const bgAlt2    = isDark ? '#231410' : '#E8E2D8';
  const text      = isDark ? '#f1e3d3' : '#2B2B2B';
  const textMuted = isDark ? 'rgba(217,194,173,0.72)' : 'rgba(43,43,43,0.58)';
  const textSubtle= isDark ? 'rgba(217,194,173,0.3)'  : 'rgba(43,43,43,0.28)';
  const accent    = isDark ? '#8f2f2a' : '#E36A5D';
  const gold      = isDark ? '#c49a6c' : '#B8854A';
  const border    = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(43,43,43,0.09)';

  const headerScrolledBg  = isDark ? 'rgba(18,10,5,0.96)'    : 'rgba(247,245,242,0.96)';
  const headerScrolledShadow = isDark ? '0 2px 20px rgba(0,0,0,0.5)' : '0 2px 20px rgba(43,43,43,0.07)';

  return (
    <div
      data-theme={theme}
      className="min-h-screen overflow-x-hidden"
      style={{ background: bg, color: text, transition: 'background 0.3s, color 0.3s' }}
    >

      {/* ─── HEADER ─── */}
      <header
        className="fixed top-0 inset-x-0 z-50 transition-all duration-400"
        style={{
          padding: isScrolled ? '10px 0' : '18px 0',
          background: isScrolled ? headerScrolledBg : 'transparent',
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          boxShadow: isScrolled ? headerScrolledShadow : 'none',
          borderBottom: isScrolled ? `1px solid ${border}` : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <div className="font-serif font-bold text-xl tracking-tight" style={{ color: gold }}>
            Fishbowl<em> Roulette</em>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map(l => (
              <a key={l.label} href={l.href}
                className="font-sans text-sm tracking-widest uppercase transition-colors duration-200"
                style={{ color: isDark ? '#d9c2ad' : '#444', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = gold)}
                onMouseLeave={e => (e.currentTarget.style.color = isDark ? '#d9c2ad' : '#444')}
              >
                {l.label}
              </a>
            ))}
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{
                background: 'transparent',
                border: `1.5px solid ${isDark ? 'rgba(196,154,108,0.35)' : 'rgba(43,43,43,0.18)'}`,
                borderRadius: '20px', padding: '5px 13px',
                cursor: 'pointer', color: isDark ? '#c49a6c' : '#555',
                fontSize: '0.75rem', letterSpacing: '0.06em',
                display: 'flex', alignItems: 'center', gap: '5px',
                transition: 'all 0.2s',
              }}
            >
              {isDark ? '☀ Light' : '☾ Dark'}
            </button>
          </nav>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-3">
            <button onClick={toggleTheme} aria-label="Toggle theme"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', color: text }}
            >
              {isDark ? '☀' : '☾'}
            </button>
            <button className="flex flex-col gap-1.5 p-1"
              onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu"
            >
              <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} style={{ background: text }} />
              <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} style={{ background: text }} />
              <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} style={{ background: text }} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t px-6 py-6 flex flex-col gap-5"
            style={{ background: isDark ? 'rgba(18,10,5,0.98)' : 'rgba(247,245,242,0.98)', backdropFilter: 'blur(10px)', borderColor: border }}
          >
            {navLinks.map(l => (
              <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
                className="font-sans text-base tracking-widest uppercase"
                style={{ color: text, textDecoration: 'none' }}
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════════════
          HERO — proper 2-column grid, no overlapping
      ═══════════════════════════════════════════════════ */}
      <section
        style={{
          background: isDark
            ? `radial-gradient(ellipse 60% 55% at 65% 45%, rgba(140,65,10,0.28) 0%, transparent 70%),
               radial-gradient(ellipse 110% 100% at 50% 50%, transparent 35%, rgba(8,4,2,0.45) 100%),
               url(${textureBg}) center/cover no-repeat,
               #1a1008`
            : bg,
          minHeight: '100svh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '72px',
        }}
      >
        <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 md:px-14 py-10 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

            {/* ── LEFT: prominently featured roulette wheel ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotate: -25 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.95, ease: 'easeOut', delay: 0.05 }}
              className="flex justify-center md:justify-start"
            >
              <RouletteWheel size="min(420px, 82vw)" isDark={isDark} spinSeconds={14} />
            </motion.div>

            {/* ── RIGHT: text content + CTAs ── */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.18 }}
              className="flex flex-col gap-5"
            >
              {/* Wednesday badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                color: gold, fontFamily: 'var(--font-sans)', fontWeight: 700,
              }}>
                <span style={{ fontSize: '0.55rem' }}>●</span>
                New episode every Wednesday
              </div>

              <h1 className="font-serif font-bold" style={{
                fontSize: 'clamp(2.1rem, 4.5vw, 3.4rem)',
                color: text, lineHeight: 1.1,
              }}>
                You don't get<br />to prepare for this.
              </h1>

              <div className="font-sans" style={{
                fontSize: 'clamp(0.9rem, 1.35vw, 1.02rem)',
                color: textMuted, lineHeight: 1.68,
              }}>
                <p>We reach into the bowl…<br />and whatever comes out—comes out of us too.</p>
                <p style={{ marginTop: '6px' }}>You never know what question is coming next. And neither do they.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <a
                  href="#episodes"
                  onClick={(e) => { e.preventDefault(); openPlayerAndScroll(); }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    gap: '0.45rem', padding: '13px 24px', borderRadius: '8px',
                    background: accent, color: '#fff',
                    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.875rem',
                    letterSpacing: '0.02em', textDecoration: 'none', cursor: 'pointer',
                    boxShadow: isDark ? '0 4px 18px rgba(143,47,42,0.5)' : '0 4px 18px rgba(227,106,93,0.32)',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = isDark ? '#a63a34' : '#D05A4D')}
                  onMouseLeave={e => (e.currentTarget.style.background = accent)}
                >
                  🎧 Start Listening
                </a>
                <a href="#join" style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  gap: '0.45rem', padding: '13px 24px', borderRadius: '8px',
                  background: 'transparent',
                  border: `1.5px solid ${isDark ? 'rgba(217,194,173,0.35)' : 'rgba(43,43,43,0.2)'}`,
                  color: text,
                  fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.875rem',
                  textDecoration: 'none', transition: 'border-color 0.2s',
                }}>
                  🔔 Get the Wednesday Question
                </a>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MEET SANDRA — host bio with photo
      ═══════════════════════════════════════════ */}
      <section id="about" style={{
        background: bgAlt,
        borderTop: `1px solid ${border}`,
        padding: '64px 24px 72px',
      }}>
        <div className="w-full max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

            {/* Sandra photo (now lower on the page, in its own section) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
              className="flex justify-center md:justify-start"
            >
              {/* Outer wrapper is `position: relative` WITHOUT overflow:hidden,
                  so the "Host" tag (positioned with negative offsets) can sit
                  outside the photo's rounded edge without being clipped. */}
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '380px',
              }}>
                <div style={{
                  width: '100%',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  aspectRatio: '4 / 5',
                  position: 'relative',
                  boxShadow: isDark
                    ? '0 24px 64px rgba(0,0,0,0.65), 0 4px 16px rgba(0,0,0,0.4)'
                    : '0 12px 52px rgba(43,43,43,0.13), 0 2px 8px rgba(43,43,43,0.06)',
                  border: isDark
                    ? '1px solid rgba(196,154,108,0.14)'
                    : '3px solid #fff',
                }}>
                  <img
                    src={sandraImg}
                    alt="Sandra, host of Fishbowl Roulette"
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'cover',
                      objectPosition: '40% 28%',
                      display: 'block',
                      ...(isDark ? {
                        WebkitMaskImage: 'radial-gradient(ellipse 92% 88% at 52% 46%, black 55%, rgba(0,0,0,0.7) 78%, transparent 95%)',
                        maskImage: 'radial-gradient(ellipse 92% 88% at 52% 46%, black 55%, rgba(0,0,0,0.7) 78%, transparent 95%)',
                      } : {}),
                    }}
                  />
                  {isDark && (
                    <>
                      <div style={{ position: 'absolute', inset: '0 0 auto 0', height: '15%', background: 'linear-gradient(to bottom, rgba(10,5,2,0.55) 0%, transparent 100%)', pointerEvents: 'none' }} />
                      <div style={{ position: 'absolute', inset: 'auto 0 0 0', height: '18%', background: 'linear-gradient(to top, rgba(10,5,2,0.5) 0%, transparent 100%)', pointerEvents: 'none' }} />
                    </>
                  )}
                </div>
                {/* "Host" tag — sibling of the photo, NOT a child, so it can
                    overhang the rounded corner without being clipped. */}
                <div style={{
                  position: 'absolute',
                  bottom: '-14px', left: '-14px',
                  background: isDark ? '#1f1108' : '#2B2B2B',
                  border: `1px solid ${isDark ? 'rgba(196,154,108,0.35)' : 'rgba(196,154,108,0.4)'}`,
                  borderRadius: '12px',
                  padding: '6px 14px',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.18)',
                  zIndex: 2,
                }}>
                  <p className="font-serif" style={{
                    fontStyle: 'italic', color: gold,
                    fontSize: '0.85rem', margin: 0,
                  }}>
                    Host
                  </p>
                </div>
              </div>
            </motion.div>

            {/* About Sandra copy */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="flex flex-col gap-5"
            >
              <div style={{
                fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                color: gold, fontFamily: 'var(--font-sans)', fontWeight: 700,
              }}>
                Meet your host
              </div>

              <h2 className="font-serif font-bold" style={{
                fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)',
                color: text, lineHeight: 1.15, fontStyle: 'italic',
                margin: 0,
              }}>
                I'm Sandra.
              </h2>

              <div className="font-sans" style={{
                fontSize: '1rem', color: textMuted,
                lineHeight: 1.7,
              }}>
                <p style={{ marginBottom: '14px' }}>
                  I like real conversations — the kind that don't stay on the surface for long.
                </p>
                <p style={{ marginBottom: '14px' }}>
                  Somewhere along the way, I realized the right question can change everything.
                  So I built this. A space where people stop performing, start telling the truth,
                  and sometimes surprise themselves in the process.
                </p>
                <p style={{ margin: 0 }}>
                  I'll be right there with them.{' '}
                  <span style={{ fontStyle: 'italic', color: text }}>
                    No script. No pretending. Just seeing what comes up.
                  </span>
                </p>
              </div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CARDS SECTION
      ═══════════════════════════════════════════ */}
      <section id="cards" style={{
        background: bgAlt2,
        borderTop: `1px solid ${border}`,
        padding: '52px 0 44px',
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-serif font-semibold text-center"
            style={{
              fontSize: 'clamp(1.3rem, 3.2vw, 2.1rem)',
              color: text, marginBottom: '32px', lineHeight: 1.3,
            }}
          >
            We pulled the first question...{' '}
            <span style={{ color: accent, fontStyle: 'italic' }}>and it went there.</span>
          </motion.h2>

          {/* Layout:
                Row 1: [Beliefs] [Fishbowl image] [Relationships]
                Row 2:        [    Wildcards centered    ]
              On mobile (1-col grid) the order is preserved vertically. */}
          {(() => {
            const cardData = {
              Beliefs:       { icon: <BrainIcon />, text: "What do you believe when no one's listening?" },
              Relationships: { icon: <HeartIcon />, text: "The stuff we think... but don't always say out loud." },
              Wildcards:     { icon: <DiceIcon />, text: 'No rules. No warning. Anything goes.' },
            } as const;
            const renderCard = (title: keyof typeof cardData, delay: number) => {
              const c = cardData[title];
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay }}
                  className="fr-parchment-card"
                >
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg, rgba(255,235,200,0.18) 0%, transparent 60%)', pointerEvents: 'none' }} />
                  <div style={{ position: 'relative' }}>
                    <div style={{ marginBottom: '10px' }}>{c.icon}</div>
                    <h3 className="font-serif font-bold" style={{ fontSize: '1.2rem', color: '#2a1208', marginBottom: '7px' }}>
                      {title}
                    </h3>
                    <p className="font-sans" style={{ fontSize: '0.83rem', color: 'rgba(38,15,6,0.75)', lineHeight: 1.55 }}>
                      {c.text}
                    </p>
                  </div>
                </motion.div>
              );
            };
            return (
              <>
                {/* Row 1: card | fishbowl | card */}
                <div
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-center"
                  style={{ marginBottom: '16px' }}
                >
                  {renderCard('Beliefs', 0)}

                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.12 }}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '4px 0',
                    }}
                  >
                    <img
                      src={fishbowlQuestionsImg}
                      alt="A glass fishbowl filled with rolled-up question slips labeled Relationships, Beliefs and Wildcards"
                      style={{
                        width: '100%',
                        maxWidth: '260px',
                        height: 'auto',
                        display: 'block',
                        filter: isDark
                          ? 'drop-shadow(0 18px 36px rgba(0,0,0,0.65))'
                          : 'drop-shadow(0 12px 28px rgba(43,43,43,0.22))',
                      }}
                    />
                  </motion.div>

                  {renderCard('Relationships', 0.24)}
                </div>

                {/* Row 2: Wildcards card centered below the fishbowl */}
                <div
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
                  style={{ marginBottom: '24px' }}
                >
                  {/* Empty cells on either side keep the centered card aligned
                      under the fishbowl on the 3-col grid. They collapse to
                      nothing on mobile because of `display: contents`-like
                      stacking via grid-cols-1. */}
                  <div className="hidden sm:block" />
                  {renderCard('Wildcards', 0.36)}
                  <div className="hidden sm:block" />
                </div>
              </>
            );
          })()}

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-sans text-center"
            style={{ color: textMuted, fontSize: '0.9rem', fontStyle: 'italic' }}
          >
            The truth is usually one question away.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          EPISODES — Listen In + Podbean player
      ═══════════════════════════════════════════ */}
      <section id="episodes" style={{
        background: bgAlt,
        borderTop: `1px solid ${border}`,
        padding: '52px 24px 56px',
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={{
              fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase',
              color: gold, fontFamily: 'var(--font-sans)', fontWeight: 700,
              marginBottom: '10px',
            }}>
              Episodes
            </div>
            <h2 className="font-serif font-bold" style={{
              fontSize: 'clamp(1.6rem, 3.6vw, 2.4rem)',
              color: text, lineHeight: 1.2, marginBottom: '10px',
            }}>
              Listen In
            </h2>
            <p className="font-sans" style={{
              fontSize: '1rem', color: textMuted,
              lineHeight: 1.6, marginBottom: '28px',
            }}>
              Real conversations, ready when you are.
            </p>
          </motion.div>

          {/* Choose Your Episode card — horizontal layout */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.05 }}
            style={{
              background: isDark ? 'rgba(196,154,108,0.06)' : '#fff',
              border: `1px solid ${border}`,
              borderRadius: '14px',
              padding: '22px 24px',
              boxShadow: isDark
                ? '0 4px 22px rgba(0,0,0,0.35)'
                : '0 4px 22px rgba(43,43,43,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              textAlign: 'left',
              flexWrap: 'wrap',
            }}
          >
            {/* Play-icon avatar */}
            <div style={{
              flexShrink: 0,
              width: '52px', height: '52px',
              borderRadius: '50%',
              border: `1.5px solid ${isDark ? 'rgba(196,154,108,0.45)' : 'rgba(43,43,43,0.18)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: textMuted,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
              </svg>
            </div>

            {/* Title + description */}
            <div style={{ flex: '1 1 240px', minWidth: 0 }}>
              <h3 className="font-serif font-bold" style={{
                fontSize: 'clamp(1.1rem, 2.2vw, 1.35rem)',
                color: text, marginBottom: '4px', lineHeight: 1.25,
              }}>
                Choose Your Episode
              </h3>
              <p className="font-sans" style={{
                fontSize: '0.9rem', color: textMuted,
                lineHeight: 1.55, margin: 0,
              }}>
                Open the list to browse every Fishbowl Roulette episode — pick any one to start listening right here.
              </p>
            </div>

            {/* Open Player button (right side) */}
            <button
              onClick={() => setPlayerOpen(o => !o)}
              aria-expanded={playerOpen}
              aria-controls="fbr-episode-list-panel"
              style={{
                flexShrink: 0,
                display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                padding: '11px 22px', borderRadius: '999px',
                background: isDark ? '#3a1a14' : '#2B2B2B',
                color: '#fff', border: 'none',
                fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.88rem',
                cursor: 'pointer', transition: 'background 0.2s, opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {playerOpen ? <>✕ Hide Episodes</> : <>▶ Browse Episodes</>}
            </button>
          </motion.div>

          {/* ── Custom episode list (expandable) ── */}
          {playerOpen && (
            <motion.div
              id="fbr-episode-list-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.4 }}
              style={{
                marginTop: '18px',
                overflow: 'hidden',
                background: isDark ? 'rgba(196,154,108,0.04)' : '#fff',
                border: `1px solid ${border}`,
                borderRadius: '14px',
                textAlign: 'left',
              }}
            >
              {/* Now Playing header bar */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 18px',
                borderBottom: `1px solid ${border}`,
              }}>
                <div className="font-sans" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  fontSize: '0.7rem', letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: textMuted, fontWeight: 700,
                }}>
                  <span style={{
                    width: '7px', height: '7px', borderRadius: '50%', background: accent,
                  }} />
                  Now Playing
                </div>
                <button
                  onClick={() => setPlayerOpen(false)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: textMuted, fontFamily: 'var(--font-sans)',
                    fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px',
                  }}
                  aria-label="Close player"
                >
                  ✕ Close
                </button>
              </div>

              {/* ── Episode list ── */}
              <div
                style={{
                  maxHeight: '560px',
                  overflowY: 'auto',
                  padding: '6px 6px 6px 6px',
                }}
              >
                {episodesLoading && (
                  <div className="font-sans" style={{
                    padding: '40px 20px', textAlign: 'center',
                    color: textMuted, fontSize: '0.92rem',
                  }}>
                    Loading episodes…
                  </div>
                )}

                {!episodesLoading && episodesError && episodes.length === 0 && (
                  <div className="font-sans" style={{
                    padding: '32px 20px', textAlign: 'center',
                    color: textMuted, fontSize: '0.92rem',
                  }}>
                    Couldn't load the episode list right now.{' '}
                    <a
                      href="https://fishbowlroulettepodcast.podbean.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: gold, textDecoration: 'underline' }}
                    >
                      Browse on Podbean
                    </a>
                  </div>
                )}

                {!episodesLoading && episodes.length > 0 && (
                  <ul style={{
                    listStyle: 'none', padding: 0, margin: 0,
                    display: 'flex', flexDirection: 'column', gap: '6px',
                  }}>
                    {episodes.map((ep) => {
                      const isActive = activeEpisodeGuid === ep.guid;
                      const dateStr = formatPubDate(ep.pubDateMs);
                      const durStr = formatDuration(ep.durationSeconds);
                      const meta = [dateStr, durStr].filter(Boolean).join(' • ');
                      const epLabel = ep.episodeNumber ? `Ep ${ep.episodeNumber}` : null;
                      return (
                        <li
                          key={ep.guid}
                          style={{
                            background: isActive
                              ? (isDark ? 'rgba(196,154,108,0.10)' : '#fbf6ee')
                              : 'transparent',
                            borderRadius: '10px',
                            border: `1px solid ${isActive ? (isDark ? 'rgba(196,154,108,0.35)' : '#e8d9bf') : 'transparent'}`,
                            transition: 'background 0.18s, border-color 0.18s',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => setActiveEpisodeGuid(isActive ? null : ep.guid)}
                            aria-expanded={isActive}
                            aria-label={`${isActive ? 'Hide' : 'Play'} episode: ${ep.title}`}
                            style={{
                              width: '100%', textAlign: 'left',
                              background: 'transparent', border: 'none', cursor: 'pointer',
                              padding: '14px 16px',
                              display: 'flex', alignItems: 'flex-start', gap: '14px',
                              fontFamily: 'inherit', color: 'inherit',
                            }}
                          >
                            {/* Play / pause circle */}
                            <span style={{
                              flexShrink: 0,
                              width: '40px', height: '40px',
                              borderRadius: '50%',
                              background: isActive ? accent : (isDark ? '#2a1810' : '#2B2B2B'),
                              color: '#fff',
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.92rem',
                              boxShadow: isActive
                                ? (isDark ? '0 4px 14px rgba(143,47,42,0.45)' : '0 4px 14px rgba(227,106,93,0.32)')
                                : 'none',
                              transition: 'background 0.18s',
                            }}>
                              {isActive ? '❚❚' : '▶'}
                            </span>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div className="font-sans" style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                flexWrap: 'wrap',
                                fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                                color: textMuted, fontWeight: 700,
                                marginBottom: '4px',
                              }}>
                                {epLabel && <span style={{ color: gold }}>{epLabel}</span>}
                                {meta && <span>{meta}</span>}
                              </div>
                              <h4 className="font-serif" style={{
                                fontSize: '1.02rem', fontWeight: 700,
                                color: text, margin: 0, lineHeight: 1.3,
                              }}>
                                {ep.title}
                              </h4>
                              {ep.description && (
                                <p className="font-sans" style={{
                                  fontSize: '0.86rem', color: textMuted,
                                  margin: '6px 0 0', lineHeight: 1.5,
                                  display: '-webkit-box',
                                  WebkitLineClamp: isActive ? 6 : 2,
                                  WebkitBoxOrient: 'vertical' as const,
                                  overflow: 'hidden',
                                }}>
                                  {ep.description}
                                </p>
                              )}
                            </div>
                          </button>

                          {isActive && ep.audioUrl && (
                            <div style={{ padding: '0 16px 14px 70px' }}>
                              <audio
                                key={ep.guid}
                                controls
                                autoPlay
                                preload="metadata"
                                src={ep.audioUrl}
                                style={{
                                  width: '100%',
                                  borderRadius: '8px',
                                  marginTop: '4px',
                                }}
                              >
                                Your browser doesn't support the audio element.{' '}
                                <a href={ep.audioUrl} style={{ color: gold }}>Download MP3</a>
                              </audio>
                              {ep.episodeUrl && (
                                <div style={{ marginTop: '6px', fontSize: '0.78rem' }}>
                                  <a
                                    href={ep.episodeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: gold, textDecoration: 'underline' }}
                                  >
                                    View episode page on Podbean ↗
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {episodes.length > 0 && (
                <p className="font-sans" style={{
                  fontSize: '0.78rem', color: textMuted,
                  padding: '10px 18px 14px', textAlign: 'center', margin: 0,
                  borderTop: `1px solid ${border}`,
                }}>
                  Showing {episodes.length} episode{episodes.length === 1 ? '' : 's'}.{' '}
                  <a
                    href="https://fishbowlroulettepodcast.podbean.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: gold, textDecoration: 'underline' }}
                  >
                    Browse all on Podbean ↗
                  </a>
                </p>
              )}
            </motion.div>
          )}

          {/* Subscribe row — pill-style podcast subscription links */}
          <div style={{ marginTop: '36px' }}>
            <p className="font-sans" style={{
              fontSize: '0.92rem', color: textMuted,
              marginBottom: '16px', lineHeight: 1.6,
            }}>
              Subscribe on your favourite platform to get every new episode automatically.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <SubscribePill
                name="Spotify"
                icon={<SpotifyIcon />}
                href="https://open.spotify.com/search/Fishbowl%20Roulette/shows"
                color="#1DB954"
                isDark={isDark}
                border={border}
                text={text}
              />
              <SubscribePill
                name="Apple Podcasts"
                icon={<AppleIcon />}
                href="https://podcasts.apple.com/us/podcast/fishbowl-roulette/id1885180650"
                color={isDark ? '#c49a6c' : '#7E57C2'}
                isDark={isDark}
                border={border}
                text={text}
              />
              <SubscribePill
                name="RSS Feed"
                icon={<RssIcon />}
                href="https://feed.podbean.com/fishbowlroulettepodcast/feed.xml"
                color={isDark ? '#d9c2ad' : '#E36A5D'}
                isDark={isDark}
                border={border}
                text={text}
              />
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════
          EMAIL CAPTURE
      ═══════════════════════════════════════════ */}
      <section id="join" style={{
        background: bgAlt,
        borderTop: `1px solid ${border}`,
        padding: '36px 24px 44px',
      }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif font-bold" style={{
              fontSize: 'clamp(1.1rem, 2.4vw, 1.55rem)',
              color: text, lineHeight: 1.3, marginBottom: '8px',
            }}>
              One question. Every Wednesday. In your inbox.
            </h2>
            <p className="font-sans" style={{
              fontSize: '0.85rem', color: textMuted,
              marginBottom: '22px', lineHeight: 1.6,
            }}>
              Get new episode drops, standout questions, and the occasional wildcard.
            </p>
          </motion.div>
          <form onSubmit={handleJoinList} className="flex flex-col sm:flex-row gap-3 items-stretch">
            <input
              type="email"
              required
              placeholder="Enter your email"
              style={{
                flex: 1,
                background: isDark ? 'rgba(196,154,108,0.08)' : '#fff',
                border: `1.5px solid ${isDark ? 'rgba(196,154,108,0.32)' : 'rgba(43,43,43,0.16)'}`,
                borderRadius: '8px', padding: '13px 18px',
                color: text, fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={emailSubmitted}
              style={{
                background: accent, color: '#fff', border: 'none',
                borderRadius: '8px', padding: '13px 24px',
                fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.875rem',
                whiteSpace: 'nowrap', cursor: emailSubmitted ? 'default' : 'pointer',
                opacity: emailSubmitted ? 0.75 : 1, transition: 'background 0.2s',
              }}
            >
              {emailSubmitted ? "You're on the list!" : 'Join the List'}
            </button>
          </form>

          {/* Follow on social — TikTok + Facebook */}
          <div style={{ marginTop: '28px' }}>
            <p className="font-sans" style={{
              fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase',
              color: textMuted, fontWeight: 600, marginBottom: '12px',
            }}>
              Follow Fishbowl Roulette
            </p>
            <div className="flex flex-wrap justify-center gap-5">
              <PlatformBtn
                name="TikTok"
                icon={<TikTokIcon />}
                href="https://www.tiktok.com/@fishbowl1560?_r=1&_t=ZT-961qb2BbDQ5"
                color={isDark ? '#d9c2ad' : '#2B2B2B'}
              />
              <PlatformBtn
                name="Facebook"
                icon={<FacebookIcon />}
                href="https://www.facebook.com/share/1G8o4HmC9M/?mibextid=wwXIfr"
                color="#1877F2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer style={{
        background: bgAlt2,
        borderTop: `1px solid ${border}`,
        padding: '44px 24px 36px',
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="font-serif font-bold" style={{
            fontSize: 'clamp(1.7rem, 4vw, 2.8rem)', color: text, lineHeight: 1.2,
          }}>
            Pull up a chair.
          </h2>
          <p className="font-serif" style={{
            fontSize: 'clamp(1rem, 2.2vw, 1.5rem)', color: textMuted, marginTop: '8px',
          }}>
            You never know what question is coming next.
          </p>
          <p className="font-sans" style={{
            fontSize: '0.8rem', color: gold,
            marginTop: '10px', letterSpacing: '0.04em',
          }}>
            New episodes every Wednesday.
          </p>
          <div style={{ marginTop: '22px', paddingTop: '16px', borderTop: `1px solid ${border}` }}>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2" style={{ marginBottom: '10px' }}>
              <a href="/privacy" className="font-sans" style={{
                fontSize: '0.7rem', color: textMuted, letterSpacing: '0.08em',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = gold)}
                onMouseLeave={e => (e.currentTarget.style.color = textMuted)}
              >
                Privacy Policy
              </a>
              <a href="mailto:hello@fishbowlroulette.com" className="font-sans" style={{
                fontSize: '0.7rem', color: textMuted, letterSpacing: '0.08em',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = gold)}
                onMouseLeave={e => (e.currentTarget.style.color = textMuted)}
              >
                Contact
              </a>
            </div>
            <p className="font-sans" style={{
              fontSize: '0.68rem', color: textSubtle,
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              © {new Date().getFullYear()} Fishbowl Roulette &mdash; fishbowlroulette.com
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

/* ─── Platform button ─── */
const PlatformBtn = ({ name, icon, href, color }: { name: string; icon: React.ReactNode; href: string; color: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="fr-platform-link" style={{ color }}>
    {icon}
    {name}
  </a>
);

/* ─── Subscribe pill (Spotify / Apple Podcasts / RSS) ─── */
const SubscribePill = ({
  name, icon, href, color, isDark, border, text,
}: {
  name: string; icon: React.ReactNode; href: string; color: string;
  isDark: boolean; border: string; text: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.55rem',
      padding: '10px 20px',
      borderRadius: '999px',
      border: `1px solid ${border}`,
      background: isDark ? 'rgba(196,154,108,0.05)' : '#fff',
      color: text,
      fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.88rem',
      textDecoration: 'none',
      transition: 'background 0.2s, transform 0.2s, border-color 0.2s',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = isDark ? 'rgba(196,154,108,0.1)' : '#fafafa';
      e.currentTarget.style.borderColor = color;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = isDark ? 'rgba(196,154,108,0.05)' : '#fff';
      e.currentTarget.style.borderColor = border;
    }}
  >
    <span style={{ color, display: 'inline-flex' }}>{icon}</span>
    {name}
  </a>
);

/* ─── RSS icon ─── */
const RssIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20A2.18 2.18 0 0 1 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
  </svg>
);

/* ─── Card Icons ─── */
const BrainIcon = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
    <circle cx="19" cy="19" r="17" fill="rgba(143,47,42,0.2)" stroke="rgba(143,47,42,0.4)" strokeWidth="1" />
    <path d="M19 10 C14 10 11 13 11 16.5 C11 18 12 19.5 13.5 20 C12 20.5 11 22 11 23.5 C11 26.5 13.5 28.5 17 28.5 L19 28.5" stroke="#8f2f2a" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M19 10 C24 10 27 13 27 16.5 C27 18 26 19.5 24.5 20 C26 20.5 27 22 27 23.5 C27 26.5 24.5 28.5 21 28.5 L19 28.5" stroke="#8f2f2a" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <line x1="19" y1="10" x2="19" y2="28.5" stroke="#8f2f2a" strokeWidth="1" strokeLinecap="round"/>
    <path d="M13.5 16 C15 15.5 17 16 18 17" stroke="#8f2f2a" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7"/>
    <path d="M24.5 16 C23 15.5 21 16 20 17" stroke="#8f2f2a" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7"/>
    <path d="M13 23 C14.5 22 16.5 22.5 18 23.5" stroke="#8f2f2a" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7"/>
    <path d="M25 23 C23.5 22 21.5 22.5 20 23.5" stroke="#8f2f2a" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
    <path d="M19 32s-12-8.5-12-16a6.5 6.5 0 0 1 12-3.3A6.5 6.5 0 0 1 31 16c0 7.5-12 16-12 16z"
      fill="#8f2f2a" stroke="#6b2220" strokeWidth="0.5" />
    <path d="M13 15.5a3.7 3.7 0 0 1 5.5-3.2" stroke="#d46060" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
  </svg>
);

const DiceIcon = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
    <rect x="6" y="6" width="26" height="26" rx="5" fill="#7a4828" />
    <rect x="6" y="6" width="26" height="26" rx="5" stroke="#c49a6c" strokeWidth="1.5" fill="none" />
    <circle cx="13" cy="13" r="2.2" fill="#f1e3d3" />
    <circle cx="25" cy="13" r="2.2" fill="#f1e3d3" />
    <circle cx="13" cy="25" r="2.2" fill="#f1e3d3" />
    <circle cx="25" cy="25" r="2.2" fill="#f1e3d3" />
    <circle cx="19" cy="19" r="2.2" fill="#f1e3d3" />
  </svg>
);

/* ─── Platform icons ─── */
const SpotifyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export default Home;
