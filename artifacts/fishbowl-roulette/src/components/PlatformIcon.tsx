import React from 'react';

type PlatformIconProps = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

export const PlatformIcon: React.FC<PlatformIconProps> = ({ name, href, icon }) => {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 px-6 py-4 rounded-xl bg-dark-bg-3 border border-white/5 hover:border-accent/40 hover:bg-black/40 transition-all duration-300 shadow-lg hover:shadow-accent/5 hover:-translate-y-1"
    >
      <div className="text-light-bg-3 group-hover:text-accent transition-colors duration-300">
        {icon}
      </div>
      <span className="font-sans font-medium text-light-bg-1 tracking-wide">{name}</span>
    </a>
  );
};
