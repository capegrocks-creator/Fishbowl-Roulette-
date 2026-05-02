import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RouletteWheel } from '../components/RouletteWheel';

const BASE = import.meta.env.BASE_URL;
const sandraImg = `${BASE}images/sandra.jpg`;
const fishbowlQuestionsImg = `${BASE}images/fishbowl-questions.png`;
const tavernBg = `${BASE}images/tavern-bg.png`;

/* ─── Question pool for the "Try Your Luck" section ───
   Five bowls, each with a small set of conversation-starter questions.
   Clicking the fishbowl (or the Pull-a-Question CTA) randomly picks one
   bowl, then one question from that bowl. */
type Bowl = {
  name: string;
  /** Tailwind/CSS hex used for the badge background fill */
  color: string;
  /** Color for the badge text */
  textColor: string;
  questions: string[];
};
const QUESTION_BOWLS: Bowl[] = [
  {
    name: 'Beliefs', color: '#7c3aed', textColor: '#f5ead8',
    questions: [
      "What do you believe when no one's listening?",
      'Have you ever defended a belief you no longer hold?',
      'What did you stop believing the moment you became an adult?',
      'What do you believe that almost no one around you does?',
      "Is there something you pretend to believe so you don't have to defend it?",
    ],
  },
  {
    name: 'Hot Topics', color: '#c54a2c', textColor: '#fff5e6',
    questions: [
      'What conversation are people too afraid to have right now?',
      'What opinion of yours would surprise the people closest to you?',
      'Where do you think the line between honesty and cruelty actually sits?',
      'What is everyone getting wrong about your generation?',
      "What's a topic you've changed your mind about in the last year?",
    ],
  },
  {
    name: 'Relationships', color: '#b45366', textColor: '#fff0ec',
    questions: [
      "The stuff you think... but don't always say out loud — what's the loudest one?",
      'Who in your life have you never properly thanked, and why?',
      'What do you wish your parents had asked you that they never did?',
      "What's a friendship that ended that you still think about?",
      'When did you last tell someone the full truth?',
    ],
  },
  {
    name: 'Wildcards', color: '#2f8c7c', textColor: '#eafff8',
    questions: [
      'No rules. No warning. What would you confess right now if it cost you nothing?',
      'If your future self could send you one sentence, what do you hope it says?',
      "What's the smallest decision that ended up changing your life?",
      'What do you do that you would be embarrassed to admit?',
      "What's a question you've been avoiding asking yourself?",
    ],
  },
  {
    name: 'Personal', color: '#c49a6c', textColor: '#2a1208',
    questions: [
      "What's the one thing you've never told anyone?",
      'What part of yourself do you hide the most?',
      'What would you do if you were certain no one would ever find out?',
      "What's the biggest thing you're still carrying from childhood?",
      'When did you last surprise yourself?',
    ],
  },
];

type PulledQuestion = { bowl: string; color: string; textColor: string; text: string };
const pickRandomQuestion = (previousText?: string): PulledQuestion => {
  /* Pick any (bowl, question) pair, retrying briefly if we land on the
     same question that's already showing. Keeps "Pull another" feeling
     fresh without needing per-bowl history. */
  let attempts = 0;
  while (attempts < 8) {
    const bowl = QUESTION_BOWLS[Math.floor(Math.random() * QUESTION_BOWLS.length)];
    const text = bowl.questions[Math.floor(Math.random() * bowl.questions.length)];
    if (text !== previousText) {
      return { bowl: bowl.name, color: bowl.color, textColor: bowl.textColor, text };
    }
    attempts++;
  }
  const bowl = QUESTION_BOWLS[0];
  return { bowl: bowl.name, color: bowl.color, textColor: bowl.textColor, text: bowl.questions[0] };
};

/* ─── Episode category inference (client-side, visual flavor only) ───
   The Podbean RSS feed doesn't ship a taxonomy, so we infer one of three
   buckets from each episode's title + description so cards can show a
   color-coded badge that matches the fishbowl ("Personal" / "Beliefs" /
   "Wildcard"). When nothing matches, default to "Wildcard". */
type EpisodeCategory = 'personal' | 'beliefs' | 'wildcard';
const CATEGORY_META: Record<EpisodeCategory, { label: string; color: string; textColor: string }> = {
  personal: { label: 'Personal', color: '#c8922a', textColor: '#2b1a08' },
  beliefs:  { label: 'Beliefs',  color: '#7a4fb5', textColor: '#f5ead8' },
  wildcard: { label: 'Wildcard', color: '#2a8a6e', textColor: '#f5ead8' },
};
const inferCategory = (ep: { title: string; description: string }): EpisodeCategory => {
  const t = `${ep.title ?? ''} ${ep.description ?? ''}`.toLowerCase();
  if (/\b(belief|beliefs|believe|believes|believed|believing|faith|religion|religious|god|spiritual|spirituality|moral|morals|morality|values|principles|conviction|convictions|right and wrong)\b/.test(t)) {
    return 'beliefs';
  }
  if (/\b(relationship|relationships|friend|friends|friendship|family|love|dating|marriage|partner|secret|secrets|memory|childhood|regret|regrets|younger self|forgive|forgiveness|never told|told anyone|crossed a line)\b/.test(t)) {
    return 'personal';
  }
  return 'wildcard';
};

/* ─── Triangular play arrow ─── */
const PlayIcon = () => (
  <svg width="11" height="13" viewBox="0 0 10 12" aria-hidden="true">
    <path d="M0 0 L10 6 L0 12 Z" fill="currentColor" />
  </svg>
);

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
  /* Set of guids whose cards are currently expanded. Cards collapse to a
     compact header by default; expanding reveals the description + the
     <audio> player. Clicking the top "Listen Now" CTA expands every card
     at once but does NOT start playback — listeners use the native HTML5
     play button on whichever episode they choose. */
  const [expandedGuids, setExpandedGuids] = useState<Set<string>>(() => new Set());

  /* Whether the entire episode list is currently revealed. The list now
     lives "inside" the big LISTEN TO ALL EPISODES button — clicking
     that button toggles this flag. Hiding everything by default keeps
     the section visually calm and gives the CTA a clear job. */
  const [listRevealed, setListRevealed] = useState<boolean>(false);

  /* "Try Your Luck" — currently revealed question (or null when the
     reveal panel is closed). Clicking the fishbowl or the Pull-a-Question
     CTA sets this to a random pick. */
  const [pulledQuestion, setPulledQuestion] = useState<PulledQuestion | null>(null);
  const handlePullQuestion = () => {
    const next = pickRandomQuestion(pulledQuestion?.text);
    setPulledQuestion(next);
    /* Smooth-scroll the reveal into view if the user pulled while the
       fishbowl was off-screen (e.g. tapped the in-section button on
       mobile). Use requestAnimationFrame so the panel exists in the DOM
       before we try to scroll to it. */
    requestAnimationFrame(() => {
      document.getElementById('try-your-luck-reveal')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    const next: 'light' | 'dark' = isDark ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('fr-theme', next);
  };

  /* Derived: are all episode cards currently expanded? Used to drive the
     top "Listen Now / Collapse All" toggle. */
  const allExpanded = episodes.length > 0 && expandedGuids.size === episodes.length;

  /** Toggle a single episode card's expanded state. */
  const toggleExpanded = (guid: string) => {
    setExpandedGuids(prev => {
      const next = new Set(prev);
      if (next.has(guid)) next.delete(guid); else next.add(guid);
      return next;
    });
  };

  /** Expand every loaded episode card (or collapse them all). Does NOT
   *  trigger playback — listeners click the native <audio> control. */
  const setAllExpanded = (expand: boolean) => {
    setExpandedGuids(expand ? new Set(episodes.map(e => e.guid)) : new Set());
  };

  /** Smooth-scroll to the Episodes section AND reveal the full episode
   *  list. Cards remain individually collapsed so listeners can pick
   *  one — that matches the in-section LISTEN TO ALL EPISODES button. */
  const openPlayerAndScroll = () => {
    setListRevealed(true);
    setExpandedGuids(new Set());
    document.getElementById('episodes')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  /* Try to figure out the guest's name for an episode by, in order:
       1. matching "...with [Title?] First Last" at the end of the title,
       2. scanning the first ~3 sentences of the description for common
          intros ("Sandra sits down with X", "X joins the mic"),
       3. parsing the trailing "_-_GuestName" chunk out of the audio
          filename (Sandra's Podbean uploads use this pattern reliably).
     Returns null if no confident match was found, in which case the
     card simply omits the "with X" line. */
  const extractGuestName = (ep: FbrEpisode): string | null => {
    const namePart = '[A-Z][a-z]+(?:\\s+[A-Z][a-z]+){0,2}';
    const titlePat = new RegExp(`\\bwith\\s+((?:Dr\\.?|Mr\\.?|Mrs\\.?|Ms\\.?)\\s+)?(${namePart})\\s*$`, 'i');
    const tm = ep.title.match(titlePat);
    if (tm) return `${tm[1] ?? ''}${tm[2]}`.trim();

    const head = ep.description.split(/(?<=[.!?])\s+/).slice(0, 3).join(' ');
    const descPatterns = [
      new RegExp(`(?:sits down with|sat down with|is joined by|joined by)\\s+((?:Dr\\.?|Mr\\.?|Mrs\\.?|Ms\\.?)\\s+)?(${namePart})`),
      new RegExp(`(${namePart})\\s+joins\\s+(?:the mic|us|Sandra)`),
    ];
    for (const re of descPatterns) {
      const m = head.match(re);
      if (m) {
        const name = (m[1] && m[2]) ? `${m[1]}${m[2]}` : (m[2] ?? m[1] ?? '');
        const trimmed = name.trim();
        if (trimmed.length >= 3) return trimmed;
      }
    }

    const filename = ep.audioUrl.split('/').pop() ?? '';
    const segments = filename.split(/_-_/);
    if (segments.length >= 2) {
      const last = segments[segments.length - 1].replace(/\.mp3$/i, '');
      const fm = last.match(/^([A-Z][A-Za-z]+(?:_[A-Z][A-Za-z]+)*)/);
      if (fm && fm[1].length >= 4) return fm[1].replace(/_/g, ' ');
    }
    return null;
  };

  /* Helpers for the episode list */
  const formatPubDate = (ms: number): string => {
    if (!ms) return '';
    try {
      return new Date(ms).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric',
      });
    } catch {
      return '';
    }
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

  /* The show doesn't have a third-party email-list backend (Mailchimp,
     ConvertKit, etc.) yet — Sandra runs everything off her Gmail
     Workspace inbox at hello@fishbowlroulette.com. So instead of
     silently faking a signup, we open the visitor's email client
     pre-filled with their address in the body and a clear subject.
     Sandra can then add them to her list manually. */
  const handleJoinList = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement | null;
    const enteredEmail = emailInput?.value?.trim() ?? '';
    if (!enteredEmail) return;
    const subject = encodeURIComponent('Add me to the Fishbowl Roulette list');
    const body = encodeURIComponent(
      `Hi Sandra,\n\nPlease add me to the Fishbowl Roulette mailing list.\n\nMy email: ${enteredEmail}\n\nThanks!\n`,
    );
    window.location.href = `mailto:hello@fishbowlroulette.com?subject=${subject}&body=${body}`;
    setEmailSubmitted(true);
    setTimeout(() => setEmailSubmitted(false), 4000);
    form.reset();
  };

  const navLinks = [
    { label: 'Listen to All Episodes', href: '#episodes' },
    { label: 'About', href: '#about' },
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

          {/* Desktop nav.
              Color logic: while the header is unscrolled (transparent),
              it sits over the always-dark tavern hero — so the link text
              must be cream-on-dark in BOTH themes. Once scrolled, the
              header has a themed background, so we revert to the normal
              theme-aware text colors. */}
          {(() => {
            const navIdle    = isScrolled ? (isDark ? '#d9c2ad' : '#3a2a1e') : '#f1e3d3';
            const toggleText = isScrolled ? (isDark ? '#c49a6c' : '#3a2a1e') : '#f1e3d3';
            const toggleBorder = isScrolled
              ? (isDark ? 'rgba(196,154,108,0.35)' : 'rgba(43,43,43,0.22)')
              : 'rgba(241,227,211,0.45)';
            return (
              <nav className="hidden md:flex items-center gap-7">
                {navLinks.map(l => (
                  <a key={l.label} href={l.href}
                    onClick={l.label === 'Listen to All Episodes' ? (e) => { e.preventDefault(); openPlayerAndScroll(); } : undefined}
                    className="font-sans text-sm tracking-widest uppercase transition-colors duration-200"
                    style={{
                      color: navIdle,
                      textDecoration: 'none',
                      textShadow: isScrolled ? 'none' : '0 1px 6px rgba(0,0,0,0.5)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = gold)}
                    onMouseLeave={e => (e.currentTarget.style.color = navIdle)}
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
                    border: `1.5px solid ${toggleBorder}`,
                    borderRadius: '20px', padding: '5px 13px',
                    cursor: 'pointer', color: toggleText,
                    fontSize: '0.75rem', letterSpacing: '0.06em',
                    display: 'flex', alignItems: 'center', gap: '5px',
                    transition: 'all 0.2s',
                    textShadow: isScrolled ? 'none' : '0 1px 6px rgba(0,0,0,0.5)',
                  }}
                >
                  {isDark ? '☀ Light' : '☾ Dark'}
                </button>
              </nav>
            );
          })()}

          {/* Mobile controls — same cream-on-dark rule as desktop nav
              while the header is unscrolled and floating over the dark
              tavern hero. */}
          {(() => {
            const mobileIcon = isScrolled ? text : '#f1e3d3';
            return (
              <div className="md:hidden flex items-center gap-3">
                <button onClick={toggleTheme} aria-label="Toggle theme"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', color: mobileIcon }}
                >
                  {isDark ? '☀' : '☾'}
                </button>
                <button className="flex flex-col gap-1.5 p-1"
                  onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu"
                >
                  <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} style={{ background: mobileIcon }} />
                  <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} style={{ background: mobileIcon }} />
                  <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} style={{ background: mobileIcon }} />
                </button>
              </div>
            );
          })()}
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t px-6 py-6 flex flex-col gap-5"
            style={{ background: isDark ? 'rgba(18,10,5,0.98)' : 'rgba(247,245,242,0.98)', backdropFilter: 'blur(10px)', borderColor: border }}
          >
            {navLinks.map(l => (
              <a key={l.label} href={l.href}
                onClick={(e) => {
                  setMenuOpen(false);
                  if (l.label === 'Listen to All Episodes') { e.preventDefault(); openPlayerAndScroll(); }
                }}
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
          HERO — tavern bokeh, text left + fishbowl right
      ═══════════════════════════════════════════════════ */}
      <section
        style={{
          /* Cinematic tavern hero — same dark, warm, bokeh-lit photo
             in both themes so the brand mood reads consistently. */
          background: `linear-gradient(180deg, rgba(12,7,4,0.55) 0%, rgba(12,7,4,0.35) 45%, rgba(12,7,4,0.65) 100%),
                       url(${tavernBg}) center/cover no-repeat,
                       #16100a`,
          minHeight: '100svh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '72px',
          color: '#f1e3d3',
        }}
      >
        <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 md:px-14 py-10 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-10 md:gap-14 items-center">

            {/* ── LEFT: text content + CTAs ── */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: 'easeOut', delay: 0.05 }}
              className="flex flex-col gap-5"
            >
              {/* Wednesday badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                color: gold, fontFamily: 'var(--font-sans)', fontWeight: 700,
              }}>
                <span style={{ fontSize: '0.55rem' }}>●</span>
                New episode every Wednesday
              </div>

              <h1 className="font-serif font-bold" style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.7rem)',
                color: '#f5ead8', lineHeight: 1.08,
                letterSpacing: '-0.01em',
                textShadow: '0 2px 18px rgba(0,0,0,0.55)',
              }}>
                You never know<br />
                what question is<br />
                coming <span style={{ fontStyle: 'italic', color: '#f17a6f' }}>next.</span>
              </h1>

              <div className="font-sans" style={{
                fontSize: 'clamp(0.95rem, 1.35vw, 1.08rem)',
                color: 'rgba(241,227,211,0.82)', lineHeight: 1.7, maxWidth: '38ch',
                textShadow: '0 1px 12px rgba(0,0,0,0.5)',
              }}>
                <p>
                  Real conversations.{' '}
                  <strong style={{ color: '#f5ead8', fontWeight: 700 }}>
                    No script. No warning.
                  </strong>
                </p>
                <p style={{ marginTop: '8px' }}>
                  Fishbowl Roulette is where honest people pull random questions—and go wherever the conversation takes them.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {/* Red "Listen to All Episodes" — scrolls to #episodes
                    AND expands every card so the user lands on a fully
                    open list ready to skim and play. */}
                <a
                  href="#episodes"
                  onClick={(e) => { e.preventDefault(); openPlayerAndScroll(); }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    gap: '0.5rem', padding: '14px 26px', borderRadius: '6px',
                    background: '#9b2020', color: '#f5ead8',
                    fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.92rem',
                    letterSpacing: '0.04em', textDecoration: 'none', cursor: 'pointer',
                    boxShadow: isDark
                      ? '0 6px 22px rgba(155,32,32,0.45)'
                      : '0 6px 22px rgba(155,32,32,0.28)',
                    transition: 'background 0.2s, transform 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#b52a2a';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#9b2020';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <PlayIcon /> Listen to All Episodes
                </a>
                {/* Cream Follow the Show — jumps to email + social section */}
                <a
                  href="#join"
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    gap: '0.45rem', padding: '14px 26px', borderRadius: '6px',
                    background: '#f5ead8', color: '#3d2510',
                    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.92rem',
                    letterSpacing: '0.04em',
                    border: `1.5px solid ${isDark ? 'rgba(245,234,216,0.55)' : 'rgba(184,133,74,0.35)'}`,
                    textDecoration: 'none', transition: 'background 0.2s, transform 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#fff7e6';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#f5ead8';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Follow the Show
                </a>
              </div>
            </motion.div>

            {/* ── RIGHT: animated roulette wheel ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.95, ease: 'easeOut', delay: 0.18 }}
              className="flex justify-center md:justify-end"
            >
              <RouletteWheel
                size="min(440px, 82vw)"
                isDark={isDark}
                spinSeconds={18}
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          EPISODES — Tavern-style featured + grid
      ═══════════════════════════════════════════ */}
      {(() => {
        /* Section-local theme tokens — mirrors the hero "tavern" mood
           in dark mode (warm wood + gold) and softens to a parchment
           cream in light mode so cards stay readable. */
        const epHeading    = isDark ? '#f5ead8' : '#3d2510';
        const epMuted      = isDark ? '#a08060' : 'rgba(61,37,16,0.62)';
        const epGold       = isDark ? '#c8922a' : '#b8854a';
        const epGoldLight  = isDark ? '#e8b84b' : '#c49a3a';
        const epRed        = '#9b2020';
        const epRedHover   = '#b52a2a';
        const epCardBg     = isDark ? 'rgba(44,26,8,0.85)' : 'rgba(255,253,247,0.96)';
        const epCardBorder = isDark ? 'rgba(200,146,42,0.20)' : 'rgba(184,133,74,0.25)';
        const epCardHoverB = isDark ? 'rgba(200,146,42,0.55)' : 'rgba(184,133,74,0.6)';
        const epDivider    = isDark ? 'rgba(200,146,42,0.12)' : 'rgba(184,133,74,0.18)';
        const sectionBg    = isDark
          ? `repeating-linear-gradient(88deg, transparent, transparent 2px, rgba(255,200,100,0.014) 2px, rgba(255,200,100,0.014) 4px),
             repeating-linear-gradient(92deg, transparent, transparent 60px, rgba(0,0,0,0.06) 60px, rgba(0,0,0,0.06) 62px),
             linear-gradient(180deg, #2c1a08 0%, #3d2510 40%, #2c1a08 100%)`
          : `radial-gradient(ellipse at 50% 0%, rgba(184,133,74,0.10) 0%, transparent 60%),
             linear-gradient(180deg, #f5ead8 0%, #ede0c5 100%)`;
        const sectionEdge  = isDark ? 'rgba(255,200,100,0.08)' : 'rgba(184,133,74,0.18)';

        return (
      <section id="episodes" style={{
        position: 'relative',
        background: isDark ? '#1a1108' : '#f5ead8',
        backgroundImage: sectionBg,
        borderTop: `1px solid ${sectionEdge}`,
        borderBottom: `1px solid ${sectionEdge}`,
        padding: '78px 24px 92px',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* ── Header ── */}
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="font-sans"
            style={{
              textAlign: 'center', fontStyle: 'italic',
              fontSize: '0.95rem', color: epGold, letterSpacing: '0.12em',
              textTransform: 'uppercase', marginBottom: '14px',
            }}
          >
            Pull a question. Start talking.
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.08 }}
            className="font-serif font-bold"
            style={{
              textAlign: 'center',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: epHeading, lineHeight: 1.15, marginBottom: '14px',
              letterSpacing: '0.02em',
            }}
          >
            CHOOSE YOUR EPISODE
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.16 }}
            className="font-sans"
            style={{
              textAlign: 'center', fontSize: '1rem', color: epMuted,
              maxWidth: '520px', margin: '0 auto 40px', lineHeight: 1.7,
              fontStyle: 'italic',
            }}
          >
            Every episode is unrehearsed. Someone reaches into the bowl — and wherever it goes, it goes.
          </motion.p>

          {/* ── Triple-diamond divider ── */}
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.22 }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '14px', marginBottom: '52px',
            }}
            aria-hidden="true"
          >
            <span style={{
              flex: 1, height: '1px', maxWidth: '180px',
              background: `linear-gradient(90deg, transparent, ${epGold}, transparent)`,
            }} />
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: '8px', height: '8px', background: epGold, transform: 'rotate(45deg)',
              }} />
            ))}
            <span style={{
              flex: 1, height: '1px', maxWidth: '180px',
              background: `linear-gradient(90deg, transparent, ${epGold}, transparent)`,
            }} />
          </motion.div>

          {/* ── Loading / error / empty ── */}
          {episodesLoading && (
            <div className="font-sans" style={{
              padding: '40px 20px', textAlign: 'center', color: epMuted, fontSize: '0.95rem',
            }}>
              Loading episodes…
            </div>
          )}

          {!episodesLoading && episodesError && episodes.length === 0 && (
            <div className="font-sans" style={{
              padding: '32px 20px', textAlign: 'center', color: epMuted, fontSize: '0.95rem',
            }}>
              Couldn't load the episode list right now.{' '}
              <a
                href="https://fishbowlroulettepodcast.podbean.com/"
                target="_blank" rel="noopener noreferrer"
                style={{ color: epGold, textDecoration: 'underline' }}
              >
                Browse on Podbean
              </a>
            </div>
          )}

          {/* Top "LISTEN TO ALL EPISODES" toggle — reveals or hides the
              entire list. Listeners then pick a card and use that
              card's chevron to expand the description + audio player.
              Animated chevron + cue copy below the button make the
              "click me to see episodes" affordance unmistakable. */}
          {!episodesLoading && episodes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.26 }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '10px', marginBottom: listRevealed ? '32px' : '8px',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setListRevealed(v => !v);
                  setExpandedGuids(new Set());
                }}
                aria-expanded={listRevealed}
                aria-controls="fbr-episode-list"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  background: epRed, color: '#f5ead8', border: 'none',
                  borderRadius: '6px', padding: '16px 34px',
                  fontFamily: 'var(--font-sans)', fontWeight: 700,
                  fontSize: '1rem', letterSpacing: '0.05em',
                  cursor: 'pointer',
                  boxShadow: isDark
                    ? '0 8px 26px rgba(155,32,32,0.5)'
                    : '0 8px 26px rgba(155,32,32,0.32)',
                  transition: 'background 0.2s, transform 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = epRedHover;
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = epRed;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <PlayIcon /> {listRevealed ? 'Hide All Episodes' : 'Listen to All Episodes'}
                <motion.span
                  aria-hidden="true"
                  animate={{ rotate: listRevealed ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'inline-flex', fontSize: '0.85rem', marginLeft: '2px' }}
                >
                  ▾
                </motion.span>
              </button>
              {!listRevealed ? (
                <motion.p
                  className="font-sans"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    fontSize: '0.92rem', color: epGold, fontWeight: 600,
                    letterSpacing: '0.04em', margin: 0, textAlign: 'center',
                  }}
                >
                  ☝ Click to see every episode and pick one to listen to
                </motion.p>
              ) : (
                <p className="font-sans" style={{
                  fontSize: '0.78rem', color: epMuted, fontStyle: 'italic',
                  margin: 0, textAlign: 'center',
                }}>
                  Tap any episode below to expand the description and play it.
                </p>
              )}
            </motion.div>
          )}

          {/* ── Collapsible episode list (gated behind listRevealed) ── */}
          {!episodesLoading && episodes.length > 0 && listRevealed && (
            <div
              id="fbr-episode-list"
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {episodes.map((ep, i) => {
                const cat = inferCategory(ep);
                const meta = CATEGORY_META[cat];
                const isExpanded = expandedGuids.has(ep.guid);
                const numLabel = ep.episodeNumber
                  ? `EP. ${String(ep.episodeNumber).padStart(2, '0')}`
                  : (i === 0 ? 'LATEST' : '—');
                const dateStr = formatPubDate(ep.pubDateMs);
                const durStr = formatDuration(ep.durationSeconds);
                const guestName = extractGuestName(ep);
                const isLatest = i === 0;

                return (
                  <motion.article
                    key={ep.guid}
                    initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.45, delay: Math.min(i * 0.035, 0.4) }}
                    style={{
                      position: 'relative',
                      background: epCardBg,
                      border: `1px solid ${isExpanded ? epCardHoverB : epCardBorder}`,
                      borderRadius: '6px',
                      overflow: 'hidden',
                      boxShadow: isDark
                        ? '0 6px 18px rgba(0,0,0,0.32)'
                        : '0 4px 14px rgba(120,80,30,0.07)',
                      transition: 'border-color 0.25s, box-shadow 0.25s',
                    }}
                  >
                    {/* Header row — entire row is the click target */}
                    <button
                      type="button"
                      onClick={() => toggleExpanded(ep.guid)}
                      aria-expanded={isExpanded}
                      aria-controls={`fbr-ep-body-${ep.guid}`}
                      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} episode: ${ep.title}`}
                      style={{
                        display: 'flex', alignItems: 'stretch',
                        width: '100%', padding: 0,
                        background: 'transparent', border: 'none',
                        textAlign: 'left', cursor: 'pointer',
                        color: 'inherit',
                      }}
                    >
                      {/* Left category accent bar */}
                      <span
                        aria-hidden="true"
                        style={{
                          width: '4px', flexShrink: 0,
                          background: isLatest ? epGoldLight : meta.color,
                        }}
                      />
                      <div style={{
                        flex: 1, minWidth: 0,
                        padding: '16px 18px',
                        display: 'flex', alignItems: 'center', gap: '14px',
                      }}>
                        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {/* Meta row */}
                          <div style={{
                            display: 'flex', alignItems: 'center',
                            gap: '8px', flexWrap: 'wrap',
                          }}>
                            <span className="font-serif" style={{
                              fontSize: '0.7rem', color: epMuted, letterSpacing: '0.1em',
                              fontWeight: 600,
                            }}>
                              {numLabel}
                            </span>
                            <span className="font-sans" style={{
                              fontSize: '0.6rem', fontStyle: 'italic',
                              textTransform: 'uppercase', letterSpacing: '0.1em',
                              padding: '2px 8px', borderRadius: '2px',
                              color: meta.textColor, background: meta.color,
                            }}>
                              {meta.label}
                            </span>
                            {isLatest && (
                              <span className="font-serif" style={{
                                fontSize: '0.68rem', fontStyle: 'italic',
                                color: epGoldLight, letterSpacing: '0.06em',
                              }}>
                                ✦ Latest
                              </span>
                            )}
                            {dateStr && (
                              <span className="font-sans" style={{
                                fontSize: '0.7rem', color: epMuted,
                              }}>
                                {dateStr}
                              </span>
                            )}
                            {guestName && (
                              <span className="font-sans" style={{
                                fontSize: '0.7rem', color: epMuted,
                              }}>
                                · with <span style={{ color: epGold, fontWeight: 600 }}>{guestName}</span>
                              </span>
                            )}
                            {durStr && (
                              <span className="font-sans" style={{
                                fontSize: '0.7rem', color: epMuted,
                              }}>
                                · {durStr}
                              </span>
                            )}
                          </div>
                          {/* Title */}
                          <span className="font-serif font-bold" style={{
                            display: 'block',
                            fontSize: 'clamp(0.98rem, 1.6vw, 1.12rem)',
                            color: epHeading, lineHeight: 1.35,
                          }}>
                            {ep.title}
                          </span>
                        </div>
                        {/* Chevron */}
                        <span
                          aria-hidden="true"
                          style={{
                            flexShrink: 0,
                            display: 'inline-flex',
                            alignItems: 'center', justifyContent: 'center',
                            width: '32px', height: '32px',
                            borderRadius: '50%',
                            background: isExpanded
                              ? (isDark ? 'rgba(200,146,42,0.18)' : 'rgba(184,133,74,0.16)')
                              : 'transparent',
                            color: epGold,
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.25s, background 0.2s',
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                            <path
                              d="M2 5 L7 10 L12 5"
                              stroke="currentColor" strokeWidth="2"
                              fill="none" strokeLinecap="round" strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </div>
                    </button>

                    {/* Expanded body — description + native HTML5 audio */}
                    {isExpanded && (
                      <div
                        id={`fbr-ep-body-${ep.guid}`}
                        style={{
                          padding: '4px 22px 20px',
                          borderTop: `1px solid ${epDivider}`,
                          display: 'flex', flexDirection: 'column', gap: '14px',
                        }}
                      >
                        {ep.description && (
                          <p className="font-sans" style={{
                            fontSize: '0.92rem', color: epMuted, lineHeight: 1.65,
                            margin: '14px 0 0', whiteSpace: 'pre-wrap',
                          }}>
                            {ep.description}
                          </p>
                        )}
                        {ep.audioUrl ? (
                          <audio
                            key={ep.guid}
                            controls
                            preload="metadata"
                            src={ep.audioUrl}
                            style={{ width: '100%', borderRadius: '6px' }}
                          >
                            Your browser doesn't support the audio element.{' '}
                            <a href={ep.audioUrl} style={{ color: epGold }}>Download MP3</a>
                          </audio>
                        ) : (
                          <p className="font-sans" style={{
                            fontSize: '0.85rem', color: epMuted, fontStyle: 'italic', margin: 0,
                          }}>
                            Audio file not available — try the Podbean link below.
                          </p>
                        )}
                        {ep.episodeUrl && (
                          <div style={{ fontSize: '0.78rem' }}>
                            <a
                              href={ep.episodeUrl} target="_blank" rel="noopener noreferrer"
                              style={{ color: epGold, textDecoration: 'underline' }}
                            >
                              View episode page on Podbean ↗
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.article>
                );
              })}

              {/* ─── Browse all button ─── */}
              <div style={{ textAlign: 'center', marginTop: '28px' }}>
                <a
                  href="https://fishbowlroulettepodcast.podbean.com/"
                  target="_blank" rel="noopener noreferrer"
                  className="font-sans"
                  style={{
                    display: 'inline-block', background: 'transparent',
                    border: `1px solid ${epGold}`, color: epGold,
                    fontStyle: 'italic', fontSize: '0.95rem', letterSpacing: '0.08em',
                    padding: '14px 42px', borderRadius: '4px', textDecoration: 'none',
                    transition: 'background 0.25s, color 0.25s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = epGold;
                    e.currentTarget.style.color = isDark ? '#1a1108' : '#fffaf0';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = epGold;
                  }}
                >
                  Browse All Episodes ↗
                </a>
              </div>
            </div>
          )}

          {/* ── Subscribe row — preserved ── */}
          <div style={{ marginTop: '52px', textAlign: 'center' }}>
            <p className="font-sans" style={{
              fontSize: '0.92rem', color: epMuted,
              marginBottom: '16px', lineHeight: 1.6,
            }}>
              Subscribe on your favourite platform to get every new episode automatically.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <SubscribePill
                name="Spotify"
                icon={<SpotifyIcon />}
                href="https://open.spotify.com/show/2j2HgUMfENC9HlazFpK2jH"
                color="#1DB954"
                isDark={isDark}
                border={epCardBorder}
                text={epHeading}
              />
              <SubscribePill
                name="Apple Podcasts"
                icon={<AppleIcon />}
                href="https://podcasts.apple.com/us/podcast/fishbowl-roulette/id1885180650"
                color={isDark ? '#c49a6c' : '#7E57C2'}
                isDark={isDark}
                border={epCardBorder}
                text={epHeading}
              />
              <SubscribePill
                name="Podbean"
                icon={<RssIcon />}
                href="https://fishbowlroulettepodcast.podbean.com/"
                color={isDark ? '#d9c2ad' : '#E36A5D'}
                isDark={isDark}
                border={epCardBorder}
                text={epHeading}
              />
            </div>
          </div>

        </div>
      </section>
        );
      })()}

      {/* ═══════════════════════════════════════════
          TRY YOUR LUCK — pull a random question from the fishbowl,
          plus the three-step "How It Works" explainer.
      ═══════════════════════════════════════════ */}
      <section id="cards" style={{
        background: `linear-gradient(180deg, rgba(12,7,4,0.62) 0%, rgba(12,7,4,0.45) 50%, rgba(12,7,4,0.7) 100%),
                     url(${tavernBg}) center/cover no-repeat,
                     #16100a`,
        borderTop: `1px solid ${border}`,
        padding: '64px 0 56px',
        color: '#f1e3d3',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>

          {/* ── Header: eyebrow + title + subhead + two CTAs ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ textAlign: 'center', marginBottom: '32px' }}
          >
            <div className="font-sans" style={{
              fontSize: '0.7rem', letterSpacing: '0.28em',
              color: gold, fontWeight: 700, marginBottom: '14px',
            }}>
              TRY YOUR LUCK
            </div>
            <h2 className="font-serif font-bold" style={{
              fontSize: 'clamp(1.9rem, 4.4vw, 3rem)',
              color: '#f5ead8', lineHeight: 1.1,
              letterSpacing: '-0.01em',
              textShadow: '0 2px 14px rgba(0,0,0,0.5)',
              marginBottom: '14px',
            }}>
              Try Your Luck
            </h2>
            <p className="font-sans" style={{
              fontSize: 'clamp(0.95rem, 1.3vw, 1.05rem)',
              color: 'rgba(241,227,211,0.82)', lineHeight: 1.65,
              maxWidth: '46ch', margin: '0 auto',
            }}>
              Pull a real question from the fishbowl — or send one in for a future episode.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center" style={{ marginBottom: '24px' }}>
            <button
              type="button"
              onClick={handlePullQuestion}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.55rem', padding: '14px 28px', borderRadius: '999px',
                background: '#9b2020', color: '#f5ead8', border: 'none',
                fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.95rem',
                letterSpacing: '0.03em', cursor: 'pointer',
                boxShadow: '0 6px 22px rgba(155,32,32,0.42)',
                transition: 'background 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#b52a2a';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#9b2020';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span aria-hidden="true">🐠</span> Pull a Question
            </button>
            <a
              href={`mailto:hello@fishbowlroulette.com?subject=${encodeURIComponent('A question for the fishbowl')}&body=${encodeURIComponent("Hi Sandra,\n\nHere's a question I'd love to hear pulled from the bowl:\n\n[your question here]\n\n—\n")}`}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.55rem', padding: '14px 28px', borderRadius: '999px',
                background: 'transparent', color: '#f5ead8',
                fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.95rem',
                letterSpacing: '0.03em', textDecoration: 'none',
                border: '1.5px solid rgba(245,234,216,0.55)',
                transition: 'background 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(245,234,216,0.12)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span aria-hidden="true">✍️</span> Submit a Question
            </a>
          </div>

          {/* ── Pulled-question reveal panel (animated in/out) ── */}
          <AnimatePresence mode="wait">
            {pulledQuestion && (
              <motion.div
                key={pulledQuestion.text}
                id="try-your-luck-reveal"
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                role="status"
                aria-live="polite"
                style={{
                  maxWidth: '640px', margin: '0 auto 32px',
                  background: 'rgba(245,234,216,0.96)',
                  color: '#2a1208',
                  borderRadius: '14px',
                  padding: '22px 24px 18px',
                  boxShadow: '0 18px 44px rgba(0,0,0,0.45)',
                  border: '1px solid rgba(196,154,108,0.35)',
                }}
              >
                <div style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: pulledQuestion.color, color: pulledQuestion.textColor,
                  fontFamily: 'var(--font-sans)', fontWeight: 700,
                  fontSize: '0.7rem', letterSpacing: '0.16em',
                  padding: '4px 12px', borderRadius: '999px',
                  marginBottom: '12px', textTransform: 'uppercase',
                }}>
                  {pulledQuestion.bowl}
                </div>
                <p className="font-serif" style={{
                  fontSize: 'clamp(1.1rem, 2.4vw, 1.5rem)',
                  lineHeight: 1.35, fontWeight: 600, margin: 0,
                }}>
                  &ldquo;{pulledQuestion.text}&rdquo;
                </p>
                <div style={{
                  display: 'flex', flexWrap: 'wrap', gap: '10px',
                  marginTop: '18px',
                }}>
                  <button
                    type="button"
                    onClick={handlePullQuestion}
                    style={{
                      padding: '9px 18px', borderRadius: '999px', border: 'none',
                      background: '#9b2020', color: '#f5ead8',
                      fontFamily: 'var(--font-sans)', fontWeight: 700,
                      fontSize: '0.82rem', letterSpacing: '0.04em', cursor: 'pointer',
                    }}
                  >
                    Pull another
                  </button>
                  <button
                    type="button"
                    onClick={() => setPulledQuestion(null)}
                    style={{
                      padding: '9px 18px', borderRadius: '999px',
                      background: 'transparent', color: '#5a3520',
                      border: '1.5px solid rgba(90,53,32,0.4)',
                      fontFamily: 'var(--font-sans)', fontWeight: 600,
                      fontSize: '0.82rem', letterSpacing: '0.04em', cursor: 'pointer',
                    }}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Fishbowl + three parchment category cards ──
                Row 1: [Beliefs] [Fishbowl (clickable)] [Relationships]
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

                  {/* Fishbowl click target. The wrapping div is relative so
                      we can float a gently-bouncing "Tap to pull!" badge
                      above the bowl as an obvious affordance.
                      Centering note: the badge wrapper uses a full-width
                      flex row instead of `left:50%; translateX(-50%)`
                      because Framer Motion's animated `y`/scale on the
                      inner motion.div would otherwise clobber the inline
                      transform and shift the badge to the right. */}
                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        top: '-14px',
                        left: 0,
                        right: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        zIndex: 2,
                        pointerEvents: 'none',
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          opacity: { duration: 0.5, delay: 0.4 },
                          scale: { duration: 0.5, delay: 0.4 },
                          y: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
                        }}
                        style={{
                          background: '#9b2020',
                          color: '#f5ead8',
                          fontFamily: 'var(--font-sans)',
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          letterSpacing: '0.14em',
                          padding: '6px 14px 6px 12px',
                          borderRadius: '999px',
                          textTransform: 'uppercase',
                          whiteSpace: 'nowrap',
                          boxShadow: '0 6px 18px rgba(155,32,32,0.55), 0 0 0 3px rgba(155,32,32,0.18)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span aria-hidden="true">👇</span> Tap to pull!
                      </motion.div>
                    </div>

                    <motion.button
                      type="button"
                      onClick={handlePullQuestion}
                      aria-label="Pull a random question from the fishbowl"
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.12 }}
                      title="Click to pull a random question"
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '4px 0',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                      }}
                    >
                      {/* Continuous "breathing" wobble draws the eye and
                          signals that the bowl is alive/interactive. */}
                      <motion.img
                        src={fishbowlQuestionsImg}
                        alt="A glass fishbowl filled with rolled-up question slips. Click to pull a random question."
                        animate={{ y: [0, -3, 0, 3, 0], rotate: [0, -1.2, 0, 1.2, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                          width: '100%',
                          maxWidth: '260px',
                          height: 'auto',
                          display: 'block',
                          filter: 'drop-shadow(0 18px 36px rgba(0,0,0,0.65)) drop-shadow(0 0 22px rgba(196,154,108,0.18))',
                          pointerEvents: 'none',
                        }}
                      />
                    </motion.button>
                  </div>

                  {renderCard('Relationships', 0.24)}
                </div>

                {/* Row 2: Wildcards card centered below the fishbowl */}
                <div
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
                  style={{ marginBottom: '8px' }}
                >
                  {/* Empty cells on either side keep the centered card aligned
                      under the fishbowl on the 3-col grid. They collapse to
                      nothing on mobile because of `display: contents`-like
                      stacking via grid-cols-1. */}
                  <div className="hidden sm:block" />
                  {renderCard('Wildcards', 0.36)}
                  <div className="hidden sm:block" />
                </div>

                <p className="font-sans text-center" style={{
                  fontSize: '0.95rem', color: gold,
                  fontWeight: 600, letterSpacing: '0.04em',
                  marginTop: '18px',
                }}>
                  ☝ Click the fishbowl to pull a random question
                </p>
              </>
            );
          })()}

          {/* ── HOW IT WORKS — three numbered process cards ── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            margin: '40px 0 22px',
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(245,234,216,0.18)' }} />
            <div className="font-sans" style={{
              fontSize: '0.7rem', letterSpacing: '0.28em',
              color: gold, fontWeight: 700,
            }}>
              HOW IT WORKS
            </div>
            <div style={{ flex: 1, height: 1, background: 'rgba(245,234,216,0.18)' }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { n: '01', title: 'We sit down',         body: 'Two people. A conversation that could go anywhere.' },
              { n: '02', title: 'We pull a question',  body: 'From one of five bowls — Beliefs, Hot Topics, Wildcards, and more.' },
              { n: '03', title: 'We answer it',        body: 'Honestly. No editing. No warning.' },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.06 * i }}
                style={{
                  background: 'rgba(245,234,216,0.06)',
                  border: '1px solid rgba(245,234,216,0.18)',
                  borderRadius: '12px',
                  padding: '20px 18px',
                  backdropFilter: 'blur(6px)',
                }}
              >
                <div className="font-sans" style={{
                  fontSize: '0.72rem', letterSpacing: '0.18em',
                  color: gold, fontWeight: 600, marginBottom: '10px',
                }}>
                  {step.n}
                </div>
                <h3 className="font-serif font-bold" style={{
                  fontSize: '1.1rem', color: '#f5ead8',
                  marginBottom: '6px', lineHeight: 1.3,
                }}>
                  {step.title}
                </h3>
                <p className="font-sans" style={{
                  fontSize: '0.88rem', color: 'rgba(241,227,211,0.75)',
                  lineHeight: 1.55, margin: 0,
                }}>
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MEET SANDRA — host bio with photo
      ═══════════════════════════════════════════ */}
      <section id="about" style={{
        position: 'relative',
        background: isDark ? '#1a1108' : '#f5ead8',
        backgroundImage: isDark
          ? `repeating-linear-gradient(88deg, transparent, transparent 2px, rgba(255,200,100,0.014) 2px, rgba(255,200,100,0.014) 4px),
             repeating-linear-gradient(92deg, transparent, transparent 60px, rgba(0,0,0,0.06) 60px, rgba(0,0,0,0.06) 62px),
             linear-gradient(180deg, #2c1a08 0%, #3d2510 40%, #2c1a08 100%)`
          : `radial-gradient(ellipse at 50% 0%, rgba(184,133,74,0.10) 0%, transparent 60%),
             linear-gradient(180deg, #f5ead8 0%, #ede0c5 100%)`,
        borderTop: `1px solid ${isDark ? 'rgba(255,200,100,0.08)' : 'rgba(184,133,74,0.18)'}`,
        borderBottom: `1px solid ${isDark ? 'rgba(255,200,100,0.08)' : 'rgba(184,133,74,0.18)'}`,
        padding: '64px 24px 72px',
      }}>
        <div className="w-full max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

            {/* Sandra photo */}
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
          EMAIL CAPTURE
      ═══════════════════════════════════════════ */}
      <section id="join" style={{
        position: 'relative',
        background: isDark ? '#1a1108' : '#f5ead8',
        backgroundImage: isDark
          ? `repeating-linear-gradient(88deg, transparent, transparent 2px, rgba(255,200,100,0.014) 2px, rgba(255,200,100,0.014) 4px),
             repeating-linear-gradient(92deg, transparent, transparent 60px, rgba(0,0,0,0.06) 60px, rgba(0,0,0,0.06) 62px),
             linear-gradient(180deg, #2c1a08 0%, #3d2510 40%, #2c1a08 100%)`
          : `radial-gradient(ellipse at 50% 0%, rgba(184,133,74,0.10) 0%, transparent 60%),
             linear-gradient(180deg, #f5ead8 0%, #ede0c5 100%)`,
        borderTop: `1px solid ${isDark ? 'rgba(255,200,100,0.08)' : 'rgba(184,133,74,0.18)'}`,
        borderBottom: `1px solid ${isDark ? 'rgba(255,200,100,0.08)' : 'rgba(184,133,74,0.18)'}`,
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
        position: 'relative',
        background: isDark ? '#1a1108' : '#f5ead8',
        backgroundImage: isDark
          ? `repeating-linear-gradient(88deg, transparent, transparent 2px, rgba(255,200,100,0.014) 2px, rgba(255,200,100,0.014) 4px),
             repeating-linear-gradient(92deg, transparent, transparent 60px, rgba(0,0,0,0.06) 60px, rgba(0,0,0,0.06) 62px),
             linear-gradient(180deg, #2c1a08 0%, #3d2510 40%, #2c1a08 100%)`
          : `radial-gradient(ellipse at 50% 0%, rgba(184,133,74,0.10) 0%, transparent 60%),
             linear-gradient(180deg, #f5ead8 0%, #ede0c5 100%)`,
        borderTop: `1px solid ${isDark ? 'rgba(255,200,100,0.08)' : 'rgba(184,133,74,0.18)'}`,
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
