import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BASE = import.meta.env.BASE_URL;
const sandraImg = `${BASE}images/sandra.jpg`;
const fishbowlImg = `${BASE}images/fishbowl.png`;
const wineImg = `${BASE}images/wine-glass.png`;
const textureBg = `${BASE}images/dark-texture.png`;

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [fishbowlErr, setFishbowlErr] = useState(false);
  const [wineErr, setWineErr] = useState(false);

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
    { label: 'About', href: '#cards' },
    { label: 'Episodes', href: '#listen' },
    { label: 'Follow', href: '#join' },
  ];

  return (
    <div className="min-h-screen text-light-bg-1 overflow-x-hidden" style={{ background: '#1a1008' }}>

      {/* ─── HEADER ─── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          isScrolled ? 'py-3' : 'py-5 bg-transparent'
        }`}
        style={isScrolled ? {
          background: 'rgba(18,10,5,0.95)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.5)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        } : {}}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="font-serif font-bold text-xl tracking-tight">
            <span style={{ color: '#c49a6c' }}>Fishbowl</span>
            <span style={{ color: '#c49a6c' }} className="italic"> Roulette</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <a key={l.label} href={l.href} className="fr-nav-link">
                {l.label}
              </a>
            ))}
          </nav>

          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {menuOpen && (
          <div
            className="md:hidden border-t border-white/5 px-6 py-6 flex flex-col gap-5"
            style={{ background: 'rgba(18,10,5,0.98)', backdropFilter: 'blur(8px)' }}
          >
            {navLinks.map(l => (
              <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
                className="font-sans text-base tracking-widest uppercase"
                style={{ color: '#f1e3d3' }}
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════
          HERO
          - Full dark warm bar atmosphere background
          - Sandra upper-right, masked to show face only
          - Fishbowl + wine glass at bottom-center-left on table
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: '100svh' }}>

        {/* ── Background: warm dark bar texture ── */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${textureBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />

        {/* ── Warm radial glow in center-right (bar bokeh / candlelight effect) ── */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 50% at 68% 42%, rgba(140,65,10,0.42) 0%, rgba(10,5,2,0.0) 70%)',
        }} />
        {/* Secondary warm spot upper-right for atmospheric depth */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 30% 25% at 78% 18%, rgba(180,100,20,0.22) 0%, transparent 70%)',
        }} />

        {/* ── Overall dark vignette ── */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 110% 100% at 50% 50%, transparent 30%, rgba(8,4,2,0.62) 100%)',
        }} />

        {/* ── Top shadow ── */}
        <div className="absolute inset-x-0 top-0" style={{
          height: '160px',
          background: 'linear-gradient(to bottom, rgba(8,4,2,0.75) 0%, transparent 100%)',
        }} />

        {/* ── Sandra photo — upper right, composited into the dark bar scene ── */}
        {/*    objectPosition shifts to show mainly face/shoulders.           */}
        {/*    Radial mask creates oval spotlight on face, hides bridge.       */}
        <div
          className="absolute"
          style={{
            top: '-4%',
            right: '-1%',
            width: 'clamp(300px, 52%, 680px)',
            height: '82%',
            zIndex: 2,
            overflow: 'hidden',
          }}
        >
          <img
            src={sandraImg}
            alt="Sandra, host of Fishbowl Roulette"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              /* Shift down so face/shoulders fill most of the display, hiding the bright bridge exit up top */
              objectPosition: '40% 32%',
              display: 'block',
              /* Oval reveal tight on face: center at 55% x / 52% y (lower-center) */
              WebkitMaskImage: 'radial-gradient(ellipse 68% 68% at 55% 50%, black 0%, black 20%, rgba(0,0,0,0.82) 36%, rgba(0,0,0,0.42) 52%, rgba(0,0,0,0.1) 65%, transparent 78%)',
              maskImage: 'radial-gradient(ellipse 68% 68% at 55% 50%, black 0%, black 20%, rgba(0,0,0,0.82) 36%, rgba(0,0,0,0.42) 52%, rgba(0,0,0,0.1) 65%, transparent 78%)',
            }}
          />
          {/* Warm dark grade — desaturates the bridge and adds bar atmosphere */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(18,8,2,0.42)',
            mixBlendMode: 'multiply',
            pointerEvents: 'none',
          }} />
          {/* Top cover — fully hides bright bridge tunnel exit. Solid dark block at very top, then gradient fade. */}
          <div style={{
            position: 'absolute', inset: '0 0 auto 0',
            height: '22%',
            background: 'rgba(8,4,2,1)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: '22%', left: 0, right: 0,
            height: '22%',
            background: 'linear-gradient(to bottom, rgba(8,4,2,1) 0%, rgba(8,4,2,0.7) 50%, transparent 100%)',
            pointerEvents: 'none',
          }} />
          {/* Bottom fade */}
          <div style={{
            position: 'absolute', inset: 'auto 0 0 0',
            height: '30%',
            background: 'linear-gradient(to top, rgba(10,5,2,0.88) 0%, transparent 100%)',
            pointerEvents: 'none',
          }} />
          {/* Left edge fade — blends into dark hero left side */}
          <div style={{
            position: 'absolute', inset: '0 auto 0 0',
            width: '30%',
            background: 'linear-gradient(to right, rgba(10,5,2,0.85) 0%, transparent 100%)',
            pointerEvents: 'none',
          }} />
          {/* Right edge fade */}
          <div style={{
            position: 'absolute', inset: '0 0 0 auto',
            width: '12%',
            background: 'linear-gradient(to left, rgba(10,5,2,0.7) 0%, transparent 100%)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* ── Left dark gradient to ensure text legibility ── */}
        <div className="absolute inset-y-0 left-0 hidden md:block" style={{
          width: '60%',
          background: 'linear-gradient(to right, rgba(8,4,2,0.72) 0%, rgba(8,4,2,0.55) 55%, transparent 100%)',
          zIndex: 3,
          pointerEvents: 'none',
        }} />

        {/* ── Headline + CTAs ── */}
        <div
          className="relative flex flex-col justify-start px-6 sm:px-10 md:px-14 lg:px-16"
          style={{ paddingTop: 'clamp(90px, 14vh, 130px)', zIndex: 10, maxWidth: '560px' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut', delay: 0.12 }}
            className="space-y-4"
          >
            <h1
              className="font-serif font-bold"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#f1e3d3', lineHeight: 1.12 }}
            >
              You don't get<br />to prepare for this.
            </h1>

            <div
              className="font-sans leading-relaxed space-y-1"
              style={{ fontSize: 'clamp(0.88rem, 1.3vw, 1rem)', color: '#d9c2ad' }}
            >
              <p>We reach into the bowl...<br />and whatever comes out—comes out of us too.</p>
              <p style={{ marginTop: '4px' }}>No script. No warning. No hiding.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <a href="#listen" className="fr-cta-primary">
                🎧 Drop into the conversation
              </a>
              <a href="#join" className="fr-cta-secondary">
                🔔 Don't miss the next question
              </a>
            </div>
          </motion.div>
        </div>

        {/* ── Table surface: dark mahogany English estate library ── */}
        <div className="absolute inset-x-0 bottom-0" style={{
          height: 'clamp(55px, 8vw, 100px)',
          zIndex: 5,
          background: 'linear-gradient(to bottom, #1e0f07 0%, #2a1208 18%, #261007 55%, #1a0b05 100%)',
          boxShadow: 'inset 0 10px 32px rgba(0,0,0,0.8)',
        }}>
          {/* Polished top edge — mahogany highlight */}
          <div style={{
            position: 'absolute', inset: 0, top: 0, height: '2px',
            background: 'linear-gradient(to right, transparent 0%, rgba(160,80,30,0.6) 20%, rgba(200,120,60,0.75) 50%, rgba(160,80,30,0.6) 80%, transparent 100%)',
          }} />
          {/* Inlay band — decorative gilt/brass-toned stripe below top edge */}
          <div style={{
            position: 'absolute', left: 0, right: 0, top: '5px', height: '1px',
            background: 'linear-gradient(to right, transparent 0%, rgba(196,154,108,0.3) 15%, rgba(196,154,108,0.5) 50%, rgba(196,154,108,0.3) 85%, transparent 100%)',
          }} />
          {/* Deep mahogany grain lines */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `repeating-linear-gradient(90deg,
              transparent 0px, transparent 80px,
              rgba(80,20,5,0.18) 80px, rgba(80,20,5,0.18) 82px,
              transparent 82px, transparent 180px
            )`,
          }} />
          {/* Warm gloss sheen */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(180,80,20,0.06) 0%, transparent 50%)',
          }} />
        </div>

        {/* ── Fishbowl — bottom-left of hero, sitting on table ── */}
        <div
          className="absolute"
          style={{
            bottom: 'clamp(40px, 5.5vw, 80px)',
            left: 'clamp(16px, 3.5vw, 52px)',
            width: 'clamp(180px, 25vw, 360px)',
            zIndex: 10,
            filter: 'drop-shadow(0 18px 36px rgba(0,0,0,0.75))',
          }}
        >
          {fishbowlErr ? (
            <FishbowlSVG />
          ) : (
            <img
              src={fishbowlImg}
              alt="Glass fishbowl with paper question slips"
              style={{ width: '100%', display: 'block' }}
              onError={() => setFishbowlErr(true)}
            />
          )}
        </div>

        {/* ── Wine glass — bottom, right of fishbowl ── */}
        <div
          className="absolute"
          style={{
            bottom: 'clamp(40px, 5.5vw, 80px)',
            left: 'clamp(200px, 28vw, 410px)',
            width: 'clamp(70px, 8.5vw, 120px)',
            zIndex: 10,
            filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.7))',
          }}
        >
          {wineErr ? (
            <WineGlassSVG />
          ) : (
            <img
              src={wineImg}
              alt="White wine glass"
              style={{ width: '100%', display: 'block' }}
              onError={() => setWineErr(true)}
            />
          )}
        </div>

        {/* Warm glow reflection under glasses */}
        <div className="absolute" style={{
          bottom: 'clamp(38px, 5.2vw, 76px)',
          left: 'clamp(10px, 2vw, 30px)',
          width: 'clamp(280px, 34vw, 500px)',
          height: '22px',
          background: 'radial-gradient(ellipse 80% 100% at 35% 0%, rgba(196,154,108,0.18) 0%, transparent 70%)',
          zIndex: 9,
          pointerEvents: 'none',
        }} />

      </section>

      {/* ═══════════════════════════════════════════
          CARDS SECTION
      ═══════════════════════════════════════════ */}
      <section id="cards" style={{ background: '#231410', padding: '52px 0 44px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-serif font-semibold text-center"
            style={{
              fontSize: 'clamp(1.3rem, 3.2vw, 2.1rem)',
              color: '#f1e3d3',
              marginBottom: '32px',
              lineHeight: 1.3,
            }}
          >
            We pulled the first question...{' '}
            <span style={{ color: '#c49a6c', fontStyle: 'italic' }}>and it went there.</span>
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ marginBottom: '24px' }}>
            {[
              { title: 'Beliefs', icon: <BrainIcon />, text: "What do you believe when no one's listening?" },
              { title: 'Relationships', icon: <HeartIcon />, text: "The stuff we think... but don't always say out loud." },
              { title: 'Wildcards', icon: <DiceIcon />, text: 'No rules. No warning.' },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="fr-parchment-card"
              >
                {/* Subtle parchment highlight */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(145deg, rgba(255,235,200,0.18) 0%, transparent 60%)',
                  pointerEvents: 'none',
                }} />
                <div style={{ position: 'relative' }}>
                  <div style={{ marginBottom: '10px' }}>{card.icon}</div>
                  <h3 className="font-serif font-bold" style={{ fontSize: '1.2rem', color: '#2a1208', marginBottom: '7px' }}>
                    {card.title}
                  </h3>
                  <p className="font-sans" style={{ fontSize: '0.83rem', color: 'rgba(38,15,6,0.75)', lineHeight: 1.55 }}>
                    {card.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-sans text-center"
            style={{ color: 'rgba(217,194,173,0.6)', fontSize: '0.9rem', fontStyle: 'italic' }}
          >
            The truth is usually one question away.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PLATFORM LINKS
      ═══════════════════════════════════════════ */}
      <section id="listen" style={{
        background: '#1e1009',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '28px 24px',
      }}>
        <div style={{ maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>
          <div className="flex flex-wrap justify-center gap-5 md:gap-7">
            <PlatformBtn name="Spotify"        icon={<SpotifyIcon />}  href="#" color="#1DB954" />
            <PlatformBtn name="Apple Podcasts" icon={<AppleIcon />}    href="#" color="#c49a6c" />
            <PlatformBtn name="YouTube"        icon={<YoutubeIcon />}  href="#" color="#FF4444" />
            <PlatformBtn name="TikTok"         icon={<TikTokIcon />}   href="#" color="#d9c2ad" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          EMAIL CAPTURE
      ═══════════════════════════════════════════ */}
      <section id="join" style={{
        background: '#1e1009',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '32px 24px 36px',
      }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <form onSubmit={handleJoinList} className="flex flex-col sm:flex-row gap-3 items-stretch">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="fr-email-input"
            />
            <button
              type="submit"
              disabled={emailSubmitted}
              className="fr-submit-btn"
            >
              {emailSubmitted ? "You're on the list!" : 'Join the List'}
            </button>
          </form>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer style={{
        background: '#1a1008',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '44px 24px 32px',
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="font-serif font-bold" style={{ fontSize: 'clamp(1.7rem, 4vw, 2.8rem)', color: '#f1e3d3', lineHeight: 1.2 }}>
            Pull up a chair.
          </h2>
          <p className="font-serif" style={{ fontSize: 'clamp(1rem, 2.2vw, 1.5rem)', color: '#d9c2ad', marginTop: '8px' }}>
            You never know what question is coming next.
          </p>
          <div style={{ marginTop: '26px', paddingTop: '18px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="font-sans" style={{
              fontSize: '0.7rem', color: 'rgba(217,194,173,0.28)',
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

/* ─── Card Icons ─── */
const BrainIcon = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
    <circle cx="19" cy="19" r="17" fill="rgba(143,47,42,0.2)" stroke="rgba(143,47,42,0.4)" strokeWidth="1" />
    {/* Stylized brain - two hemispheres with folds */}
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

/* ─── Fallback SVG fishbowl (if AI image fails) ─── */
const FishbowlSVG = () => (
  <svg viewBox="0 0 260 280" fill="none" style={{ width: '100%', display: 'block' }}>
    <defs>
      <radialGradient id="bf" cx="38%" cy="32%" r="65%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.28" />
        <stop offset="55%" stopColor="#c4a87e" stopOpacity="0.05" />
        <stop offset="100%" stopColor="#100a06" stopOpacity="0.5" />
      </radialGradient>
      <linearGradient id="bs" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#eedcc8" />
        <stop offset="100%" stopColor="#d9b898" />
      </linearGradient>
    </defs>
    <ellipse cx="130" cy="58" rx="105" ry="20" fill="none" stroke="#c9a87e" strokeWidth="2" strokeOpacity="0.5" />
    <path d="M 30,58 Q 12,110 18,175 Q 26,235 80,260 Q 130,278 180,260 Q 234,235 242,175 Q 248,110 230,58 Z"
      fill="url(#bf)" stroke="#c9a87e" strokeWidth="2.5" strokeOpacity="0.4" />
    <path d="M 32,60 Q 22,115 24,175 Q 27,218 40,250" stroke="#fff" strokeWidth="9" strokeOpacity="0.16" strokeLinecap="round" fill="none" />
    <path d="M 30,58 Q 75,44 130,40 Q 185,44 230,58" stroke="#e8d5c0" strokeWidth="2.5" strokeOpacity="0.75" fill="none" />
    <g transform="translate(70, 115) rotate(-14)">
      <rect x="0" y="0" width="90" height="28" rx="2" fill="url(#bs)" />
      <text x="45" y="19" fontFamily="Georgia,serif" fontSize="11" fill="#3d2010" textAnchor="middle" fontWeight="bold">Beliefs</text>
    </g>
    <g transform="translate(88, 158) rotate(9)">
      <rect x="0" y="0" width="108" height="28" rx="2" fill="url(#bs)" />
      <text x="54" y="19" fontFamily="Georgia,serif" fontSize="11" fill="#3d2010" textAnchor="middle" fontWeight="bold">Relationships</text>
    </g>
    <g transform="translate(52, 200) rotate(-5)">
      <rect x="0" y="0" width="95" height="28" rx="2" fill="url(#bs)" />
      <text x="47" y="19" fontFamily="Georgia,serif" fontSize="11" fill="#3d2010" textAnchor="middle" fontWeight="bold">Wildcards</text>
    </g>
    <ellipse cx="130" cy="256" rx="95" ry="14" fill="#0e0906" opacity="0.5" />
  </svg>
);

/* ─── Fallback SVG wine glass (if AI image fails) ─── */
const WineGlassSVG = () => (
  <svg viewBox="0 0 80 200" fill="none" style={{ width: '100%', display: 'block' }}>
    <defs>
      <linearGradient id="wine" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e8d88a" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#c8b850" stopOpacity="0.75" />
      </linearGradient>
      <linearGradient id="wglass" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.22" />
        <stop offset="40%" stopColor="#fff" stopOpacity="0.06" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0.12" />
      </linearGradient>
    </defs>
    {/* Bowl */}
    <path d="M 14,14 Q 8,55 8,75 Q 8,110 40,118 Q 72,110 72,75 Q 72,55 66,14 Z"
      fill="url(#wglass)" stroke="#d4c8a0" strokeWidth="1.5" strokeOpacity="0.55" />
    {/* Wine fill */}
    <path d="M 13,72 Q 11,105 40,114 Q 69,105 67,72 Z" fill="url(#wine)" opacity="0.9" />
    {/* Wine surface shimmer */}
    <ellipse cx="40" cy="72" rx="27" ry="5.5" fill="#e8d88a" opacity="0.55" />
    {/* Rim highlight */}
    <ellipse cx="40" cy="14" rx="26" ry="5" fill="none" stroke="#e0d4b0" strokeWidth="1.5" strokeOpacity="0.6" />
    {/* Glass highlight */}
    <path d="M 18,20 Q 14,60 14,80" stroke="#fff" strokeWidth="4" strokeOpacity="0.18" strokeLinecap="round" fill="none" />
    {/* Stem */}
    <line x1="40" y1="118" x2="40" y2="178" stroke="#c9b898" strokeWidth="2.5" strokeOpacity="0.7" />
    {/* Base */}
    <ellipse cx="40" cy="180" rx="28" ry="6" fill="none" stroke="#c9b898" strokeWidth="2" strokeOpacity="0.6" />
    <ellipse cx="40" cy="180" rx="28" ry="4" fill="rgba(196,154,108,0.1)" />
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

export default Home;
