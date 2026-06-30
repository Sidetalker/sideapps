'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { changelog, CHANGE_TYPE_META } from '@/data/changelog';

interface ChangelogAppProps {
  onClose: () => void;
}

const formatDate = (iso: string) => {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const ChangelogApp: React.FC<ChangelogAppProps> = ({ onClose }) => {
  // Close on Escape, mirroring native app dismissal.
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="absolute inset-0 z-50 flex flex-col bg-gradient-to-b from-gray-900 to-black rounded-[50px] overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Nav bar */}
      <div className="flex items-center justify-between px-5 pt-10 pb-3 border-b border-white/10">
        <button
          onClick={onClose}
          aria-label="Back to home screen"
          className="flex items-center gap-1 text-orange-400 text-[13px] font-medium active:opacity-60 transition-opacity"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Home
        </button>
        <span className="text-white text-[15px] font-semibold">Changelog</span>
        <span className="w-[52px]" aria-hidden="true" />
      </div>

      {/* Scrollable feed */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <p className="text-white/50 text-[11px] leading-relaxed px-1">
          A running history of updates shipped to this site.
        </p>

        {changelog.map((entry) => (
          <div
            key={entry.version}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-sm"
          >
            <div className="flex items-baseline justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded-md border border-orange-300/30 bg-orange-300/10 px-1.5 py-0.5 text-[10px] font-semibold text-orange-200">
                  v{entry.version}
                </span>
                {entry.title && (
                  <span className="text-white text-[12px] font-semibold">
                    {entry.title}
                  </span>
                )}
              </div>
              <span className="text-white/40 text-[10px] whitespace-nowrap">
                {formatDate(entry.date)}
              </span>
            </div>

            <ul className="mt-3 space-y-2.5">
              {entry.changes.map((change, index) => {
                const meta = CHANGE_TYPE_META[change.type];
                return (
                  <li key={index} className="flex gap-2.5">
                    <span
                      className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${meta.dotClass}`}
                      aria-hidden="true"
                    />
                    <div className="space-y-1">
                      <span
                        className={`inline-block rounded border px-1.5 py-px text-[9px] font-medium uppercase tracking-wide ${meta.badgeClass}`}
                      >
                        {meta.label}
                      </span>
                      <p className="text-white/80 text-[11px] leading-snug">
                        {change.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* Bottom padding so the home indicator never overlaps content */}
        <div className="h-6" aria-hidden="true" />
      </div>
    </motion.div>
  );
};

export default ChangelogApp;
