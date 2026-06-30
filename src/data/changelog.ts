/**
 * Changelog data source.
 *
 * This file is the single source of truth for the website changelog.
 * To publish an update, add a new `ChangelogEntry` to the TOP of the
 * `changelog` array (newest first). The `/changelog` page renders this
 * automatically — no other files need to change.
 *
 * Guidelines for maintainers:
 * - Keep `version` unique and use semantic-ish versioning (e.g. "1.4.0").
 * - Use ISO dates ("YYYY-MM-DD") for `date` so sorting/formatting stays consistent.
 * - Group changes by `type` so readers can scan quickly.
 * - Keep change descriptions short, action-oriented, and user-facing.
 */

export type ChangeType = 'added' | 'changed' | 'fixed' | 'removed';

export interface ChangelogChange {
  type: ChangeType;
  description: string;
}

export interface ChangelogEntry {
  /** Unique version/release identifier, e.g. "1.2.0". */
  version: string;
  /** Release date in ISO format: "YYYY-MM-DD". */
  date: string;
  /** Optional short headline summarizing the release. */
  title?: string;
  /** List of changes shipped in this release. */
  changes: ChangelogChange[];
}

/** Display metadata for each change type. */
export const CHANGE_TYPE_META: Record<
  ChangeType,
  { label: string; dotClass: string; badgeClass: string }
> = {
  added: {
    label: 'Added',
    dotClass: 'bg-emerald-400',
    badgeClass: 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200',
  },
  changed: {
    label: 'Changed',
    dotClass: 'bg-cyan-400',
    badgeClass: 'border-cyan-300/30 bg-cyan-300/10 text-cyan-200',
  },
  fixed: {
    label: 'Fixed',
    dotClass: 'bg-orange-400',
    badgeClass: 'border-orange-300/30 bg-orange-300/10 text-orange-200',
  },
  removed: {
    label: 'Removed',
    dotClass: 'bg-rose-400',
    badgeClass: 'border-rose-300/30 bg-rose-300/10 text-rose-200',
  },
};

/** Newest entries first. Add new releases at the top. */
export const changelog: ChangelogEntry[] = [
  {
    version: '1.3.0',
    date: '2026-06-29',
    title: 'Changelog app on the iPhone',
    changes: [
      {
        type: 'added',
        description:
          'Added a Changelog app that launches from the iPhone home screen, with an iOS-style nav bar and a scrollable timeline of releases.',
      },
      {
        type: 'changed',
        description:
          'Reworked the Flappy Bird exit so the morphing "Exit Flappy Bird" button stays visible and interactive while the game is open, instead of relying on a separate close button.',
      },
    ],
  },
  {
    version: '1.2.0',
    date: '2026-06-29',
    title: 'Flappy Bird refresh',
    changes: [
      {
        type: 'changed',
        description:
          'Modernized the hidden Flappy Bird mini-game with layered parallax skies, a redesigned bird, glossy pipes, and particle effects.',
      },
      {
        type: 'fixed',
        description:
          'Fixed the "Exit Flappy Bird" button so it stays visible and clickable while the game is running.',
      },
      {
        type: 'added',
        description: 'Published this changelog so visitors can track website updates.',
      },
    ],
  },
  {
    version: '1.1.0',
    date: '2026-05-20',
    title: 'Journey West toolkit',
    changes: [
      {
        type: 'added',
        description:
          'Launched the Journey West tools directory featuring the Email Signature Studio and Summit County Property Viewer.',
      },
      {
        type: 'added',
        description: 'Added the Kevin chatbot section for interactive Q&A on the homepage.',
      },
    ],
  },
  {
    version: '1.0.0',
    date: '2026-04-01',
    title: 'Portfolio launch',
    changes: [
      {
        type: 'added',
        description:
          'Initial release of the SideApps portfolio highlighting WashLoft, Capital One, Chewy, AAF, American Well, and SplatPal.',
      },
      {
        type: 'added',
        description: 'Added the contact section and animated hero experience.',
      },
    ],
  },
];
