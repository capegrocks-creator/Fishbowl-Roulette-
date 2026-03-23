import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FishbowlAndWine } from '@/components/Illustrations';
import { PlatformIcon } from '@/components/PlatformIcon';
import { Headphones, Youtube, Instagram, Smartphone, Mail, ArrowRight } from 'lucide-react';

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 50]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleJoinList = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission visually
    const form = e.target as HTMLFormElement;
    const btn = form.querySelector('button');
    if (btn) {
      const originalText = btn.innerText;
      btn.innerText = "Added to the list.";
      btn.disabled = true;
      btn.classList.add('opacity-70');
      setTimeout(() => {
        btn.innerText = originalText;
        btn.disabled = false;
        btn.classList.remove('opacity-70');
        form.reset();
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg-1 text-light-bg-1 overflow-hidden">
      
      {/* Navigation / Header */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-dark-bg-1/90 backdrop-blur-md py-4 shadow-2xl shadow-black/50 border-b border-white/5' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="font-serif font-bold text-2xl tracking-tighter flex items-center gap-2">
            <span className="text-primary">Fishbowl</span>
            <span className="text-accent italic">Roulette</span>
          </div>
          <a href="#listen" className="text-sm font-sans tracking-widest uppercase text-light-bg-3 hover:text-accent transition-colors">
            Listen Now
          </a>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[100svh] flex items-center pt-24 pb-12 texture-overlay-dark">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center z-10">
          
          <motion.div 
            style={{ opacity: heroOpacity, y: heroY }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col gap-8 max-w-xl"
          >
            <div className="space-y-4">
              <p className="font-sans text-accent tracking-[0.2em] uppercase text-xs font-semibold">The New Podcast</p>
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.1]">
                You don't get to <span className="italic text-light-bg-2">prepare</span> for this.
              </h1>
            </div>
            
            <p className="font-sans text-lg md:text-xl text-light-bg-3 leading-relaxed font-light">
              We reach into the bowl... and whatever comes out—comes out of us too.
              <br/><br/>
              <span className="font-serif italic text-light-bg-1 text-2xl">No script. No warning. No hiding.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="#listen" className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full bg-primary hover:bg-primary-hover text-white font-sans font-semibold tracking-wide transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5">
                Drop into the conversation
              </a>
              <a href="#join" className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full bg-transparent border border-light-bg-3/30 hover:border-accent hover:text-accent text-light-bg-1 font-sans font-medium tracking-wide transition-all duration-300">
                Don't miss the next question
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
            className="relative flex items-center justify-center"
          >
            <FishbowlAndWine className="z-10" />
            
            {/* Host Photo Placeholder Card */}
            <div className="absolute -bottom-8 -right-4 sm:-right-8 w-48 sm:w-56 aspect-[3/4] rounded-2xl overflow-hidden glass-dark border border-accent/20 shadow-2xl rotate-6 z-20 group">
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg-1 via-transparent to-transparent z-10" />
              
              {/* Fallback generated image from requirements or placeholder gradient */}
              <img 
                src={`${import.meta.env.BASE_URL}images/sandra-portrait.png`} 
                alt="Sandra - Podcast Host" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 mix-blend-luminosity"
                onError={(e) => {
                  // Fallback if image not generated yet
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-dark-bg-1/80 -z-10" />

              <div className="absolute bottom-4 left-4 z-20">
                <p className="font-sans text-[10px] tracking-widest text-accent uppercase mb-1">Host</p>
                <p className="font-serif text-2xl text-light-bg-1 font-medium italic">Sandra</p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. MID-CONTENT SECTION */}
      <section className="py-32 bg-light-bg-1 text-text-dark texture-overlay-light relative z-20 rounded-t-[3rem] -mt-8 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              This gets <span className="text-primary italic">real...</span> fast.
            </h2>
            <ul className="space-y-4 font-sans text-lg text-text-dark/80 font-medium">
              <li className="flex items-center gap-4">
                <span className="w-8 h-[1px] bg-accent"></span>
                We don't overthink it.
              </li>
              <li className="flex items-center gap-4">
                <span className="w-8 h-[1px] bg-accent"></span>
                We don't clean it up.
              </li>
              <li className="flex items-center gap-4">
                <span className="w-8 h-[1px] bg-primary"></span>
                <span className="font-bold text-primary">We just answer.</span>
              </li>
            </ul>
            <p className="font-sans text-lg text-text-dark/70 leading-relaxed">
              Sometimes it's funny. Sometimes it's uncomfortable. Sometimes it hits something you didn't expect. Good. That's the point.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8 bg-card p-10 rounded-3xl shadow-xl shadow-black/5 border border-black/5"
          >
            <div className="flex items-center gap-6 mb-2">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-dark-bg-2 border-2 border-accent relative">
                 <img 
                  src={`${import.meta.env.BASE_URL}images/sandra-portrait.png`} 
                  alt="Sandra" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-4xl font-serif font-bold italic">I'm Sandra.</h2>
            </div>
            
            <p className="font-sans text-lg text-text-dark/80 leading-relaxed font-light">
              I like real conversations—the kind that don't stay on the surface for long. Somewhere along the way, I realized the right question can change everything. So I built this.
            </p>
            <p className="font-sans text-lg text-text-dark/80 leading-relaxed font-light">
              A space where people stop performing, start telling the truth, and sometimes surprise themselves in the process. I'll be right there with them. No script. No pretending. Just seeing what comes up.
            </p>
            
            <div className="pt-4">
              <a href="#listen" className="group inline-flex items-center gap-3 text-primary font-sans font-bold tracking-wide uppercase text-sm hover:text-primary-hover transition-colors">
                Listen to my first episode
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 3. DARK LOWER SECTION (Feature Cards) */}
      <section className="py-32 bg-dark-bg-2 texture-overlay-dark border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-medium leading-tight">
              We pulled the first question... <br className="hidden sm:block"/>
              <span className="italic text-accent">and it went there.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Beliefs", emoji: "🧠", text: "What do you believe when no one's listening?" },
              { title: "Relationships", emoji: "❤️", text: "The stuff we think... but don't always say out loud." },
              { title: "Wildcards", emoji: "🎲", text: "No rules. No warning. Total honesty." }
            ].map((card, i) => (
              <motion.div 
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="bg-card text-card-foreground p-10 rounded-2xl shadow-xl shadow-black/40 hover:-translate-y-2 transition-transform duration-500 texture-overlay-light"
              >
                <div className="text-4xl mb-6">{card.emoji}</div>
                <h3 className="text-2xl font-serif font-bold mb-4">{card.title}</h3>
                <p className="font-sans text-text-dark/80 leading-relaxed">
                  {card.text}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-24 text-center"
          >
            <p className="font-serif text-2xl md:text-3xl text-light-bg-3 italic font-light">
              "The truth is usually one question away."
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4. LISTEN / PLATFORMS SECTION */}
      <section id="listen" className="py-24 bg-dark-bg-3 relative overflow-hidden">
        {/* Subtle geometric lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-sm font-sans tracking-[0.3em] uppercase text-accent font-semibold mb-12">
            Listen wherever you podcast
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            <PlatformIcon name="Spotify" href="#" icon={<Headphones className="w-5 h-5" />} />
            <PlatformIcon name="Apple Podcasts" href="#" icon={<Smartphone className="w-5 h-5" />} />
            <PlatformIcon name="YouTube" href="#" icon={<Youtube className="w-5 h-5" />} />
            <PlatformIcon name="Instagram" href="#" icon={<Instagram className="w-5 h-5" />} />
            <PlatformIcon name="TikTok" href="#" icon={<Smartphone className="w-5 h-5" />} />
          </div>
        </div>
      </section>

      {/* 5. EMAIL CAPTURE */}
      <section id="join" className="py-32 bg-light-bg-2 text-text-dark texture-overlay-light rounded-t-[3rem] -mt-8 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 mx-auto bg-dark-bg-1 rounded-full flex items-center justify-center mb-8 shadow-lg">
              <Mail className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
              Get the next question <br className="hidden sm:block"/>
              <span className="italic text-primary">before anyone else.</span>
            </h2>
            <p className="font-sans text-lg text-text-dark/70 mb-10 max-w-xl mx-auto">
              Join the inner circle. We'll send you the newest episodes, behind-the-scenes thoughts, and questions to ask your own friends.
            </p>

            <form onSubmit={handleJoinList} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required
                className="flex-1 bg-white/50 border border-text-dark/10 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-full px-6 py-4 outline-none font-sans text-text-dark placeholder:text-text-dark/40 transition-all"
              />
              <button 
                type="submit"
                className="bg-dark-bg-1 hover:bg-primary text-light-bg-1 rounded-full px-8 py-4 font-sans font-semibold tracking-wide transition-colors duration-300 whitespace-nowrap"
              >
                Join the List
              </button>
            </form>
            <p className="text-xs font-sans text-text-dark/40 mt-4">No spam. Just real conversations.</p>
          </motion.div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-dark-bg-1 pt-32 pb-12 texture-overlay-dark border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <h2 className="text-5xl md:text-7xl font-serif font-bold italic mb-6">
            Pull up a chair.
          </h2>
          <p className="font-sans text-xl text-light-bg-3 font-light mb-16">
            You never know what question is coming next.
          </p>
          
          <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />
          
          <p className="font-serif italic text-accent text-lg mb-8">
            Careful... you might get asked next.
          </p>
          
          <p className="font-sans text-sm text-light-bg-3/40 tracking-widest uppercase">
            © {new Date().getFullYear()} Fishbowl Roulette
          </p>
        </div>
      </footer>
      
    </div>
  );
};

export default Home;
