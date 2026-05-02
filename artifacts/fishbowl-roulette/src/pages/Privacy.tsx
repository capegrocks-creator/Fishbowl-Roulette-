import React from 'react';
import { Link } from 'wouter';

const Privacy = () => {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#1a1008', color: '#d9c2ad' }}>

      {/* ─── Header ─── */}
      <div style={{
        background: 'rgba(18,10,5,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '18px 24px',
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/">
            <span className="font-serif font-bold" style={{ fontSize: '1.1rem', color: '#c49a6c', cursor: 'pointer' }}>
              Fishbowl <em>Roulette</em>
            </span>
          </Link>
          <Link href="/">
            <span className="font-sans" style={{
              fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(196,154,108,0.6)', cursor: 'pointer', textDecoration: 'none',
            }}>
              ← Back
            </span>
          </Link>
        </div>
      </div>

      {/* ─── Content ─── */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '52px 24px 72px' }}>

        <h1 className="font-serif font-bold" style={{
          fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
          color: '#f1e3d3', lineHeight: 1.2, marginBottom: '8px',
        }}>
          Privacy Policy
        </h1>
        <p className="font-sans" style={{ fontSize: '0.8rem', color: 'rgba(217,194,173,0.4)', marginBottom: '40px' }}>
          Fishbowl Roulette &mdash; fishbowlroulette.com
        </p>

        <Section title="Information We Collect">
          <p>
            This site may collect your email address if you choose to join the mailing list or submit a question.
            We only collect information you voluntarily provide. We do not collect any personal information automatically
            beyond basic, anonymous traffic analytics.
          </p>
        </Section>

        <Section title="Question Submissions">
          <p>
            Questions submitted through this site may be reviewed by the Fishbowl Roulette team and may be used in
            future podcast episodes, social media posts, or other promotional content. Submitting a name or email
            address alongside a question is entirely optional.
          </p>
        </Section>

        <Section title="Email Use">
          <p>
            If you join the mailing list, your email address may be used to send you new episode notifications,
            featured questions from the bowl, and other show-related announcements. We do not sell or share
            your email address with third parties. You can unsubscribe at any time.
          </p>
        </Section>

        <Section title="Analytics">
          <p>
            This site may use basic website analytics tools to understand traffic patterns and improve the
            site experience. Analytics data is anonymous and is not linked to personally identifiable information.
          </p>
        </Section>

        <Section title="Third-Party Links">
          <p>
            This site may include links to Spotify, Apple Podcasts, YouTube, TikTok, Facebook,
            and other platforms. These platforms have their own privacy policies and practices, which are
            independent of Fishbowl Roulette. We encourage you to review those policies when visiting
            third-party sites.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            If you have questions about this privacy policy, please email us at{' '}
            <a
              href="mailto:hello@fishbowlroulette.com"
              style={{ color: '#c49a6c', textDecoration: 'none' }}
            >
              hello@fishbowlroulette.com
            </a>
            .
          </p>
        </Section>

        {/* Footer note */}
        <div style={{
          marginTop: '52px', paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <p className="font-sans" style={{
            fontSize: '0.72rem', color: 'rgba(217,194,173,0.28)',
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            © {new Date().getFullYear()} Fishbowl Roulette
          </p>
        </div>

      </div>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: '32px' }}>
    <h2 className="font-serif font-semibold" style={{
      fontSize: '1.05rem', color: '#f1e3d3',
      marginBottom: '10px', lineHeight: 1.3,
    }}>
      {title}
    </h2>
    <div className="font-sans" style={{ fontSize: '0.9rem', color: 'rgba(217,194,173,0.72)', lineHeight: 1.7 }}>
      {children}
    </div>
  </div>
);

export default Privacy;
