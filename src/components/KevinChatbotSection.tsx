'use client';

import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react';

interface ChatMessage {
  id: number;
  isKevin: boolean;
  text: string;
}

interface KeywordEntry {
  keys: string[];
  cat: string;
}

const responses: Record<string, string[]> = {
  career: [
    "I have spent more than a decade building iOS apps across laundry logistics, fintech, telehealth, and ecommerce products.",
    "My career path includes solo contributor, tech lead, and engineering manager roles, with a focus on shipping reliable mobile products."
  ],
  washloft: [
    "WashLoft is an on-demand laundry app. I built the iOS app with Swift, Firebase, and Stripe, plus companion apps for drivers and washers.",
    "Working on WashLoft taught me how to keep multi-app codebases maintainable with shared packages and consistent architecture."
  ],
  capitalOne: [
    "At Capital One I led the Small Business Banking iOS effort and helped drive major feature parity and quality improvements.",
    "Capital One was a great environment for balancing technical quality with business priorities at scale."
  ],
  chewy: [
    "At Chewy I was the lead mobile engineer for PracticeHub, building the app and helping stand up the mobile team.",
    "PracticeHub focused on helping veterinarians manage approvals and workflows with much less customer-service friction."
  ],
  aaf: [
    "At AAF I worked on the flagship app with live streaming, real-time graphics, and fast-paced launch timelines.",
    "AAF was one of the most technically intense projects I have worked on because everything moved quickly and publicly."
  ],
  amwell: [
    "At Amwell I led clinician-facing iOS development, including modernization work, video features, and scheduling experiences."
  ],
  apps: [
    "I have built products for WashLoft, Capital One, Chewy, AAF, and Amwell, plus personal projects like SplatPal and other iOS utilities.",
    "A lot of my portfolio work centers on simplifying complex workflows so the app feels obvious for the end user."
  ],
  splatpal: [
    "SplatPal was one of my favorite personal projects and my first App Store featured app, built as a Splatoon companion.",
    "SplatPal included a custom game-inspired UI, item databases, and external data integrations."
  ],
  techStack: [
    "My core stack is Swift with UIKit and SwiftUI, plus Firebase, Stripe, SPM, and XCTest-driven quality practices.",
    "I focus heavily on architecture, testing, and maintainability so teams can move fast without losing reliability."
  ],
  swift: [
    "I have written Swift since early versions and still prefer it for most mobile product work.",
    "Swift keeps improving, and async/await in particular made large app codebases easier to reason about."
  ],
  swiftui: [
    "SwiftUI is strong for new UI surfaces, but deep UIKit knowledge still matters for edge cases and mature apps."
  ],
  crypto: [
    "I am interested in crypto mostly from a technology and creator-ownership perspective, with a cautious view of speculation.",
    "I have participated in DeSo communities and also push for stronger accountability in crypto spaces."
  ],
  nft: [
    "I have created NFT collections as generative art projects where the creative process matters more than speculation.",
    "For me, NFT work is mostly about code-driven visual experimentation."
  ],
  deso: [
    "DeSo is a social-focused blockchain ecosystem. I have spent time there exploring creator tools and community experiments."
  ],
  ai: [
    "I am enthusiastic about AI tools for creativity and engineering productivity, while staying realistic about risks and misuse.",
    "I experiment with generative AI and try to balance momentum with thoughtful adoption."
  ],
  dog: [
    "My dog Java shows up in a lot of my posts and is probably the most popular part of my social feed.",
    "Java is named after the programming language and is a frequent adventure partner."
  ],
  gaming: [
    "I play and build around games, which is part of why SplatPal happened in the first place.",
    "I tend to enjoy games where optimization and systems-thinking pay off."
  ],
  art: [
    "I enjoy generative art because it combines engineering constraints with creative output.",
    "Algorithmic art projects are one of my favorite side hobbies."
  ],
  opensource: [
    "I have contributed to open source projects and I value giving back to the mobile developer community."
  ],
  github: [
    "GitHub is where most of my personal experiments and shipped side projects live."
  ],
  location: [
    "I am based in Wilmington, Delaware."
  ],
  education: [
    "I have a CS degree, but most growth came from shipping real products and learning through production feedback."
  ],
  leadership: [
    "My leadership style is hands-on: architecture direction, mentorship, and practical delivery support.",
    "I like leaders who can move between strategy and deep technical debugging when needed."
  ],
  journeyWest: [
    "Journey West was a toolkit for a Colorado real estate team, including branded tools and mapping-focused workflows."
  ],
  advice: [
    "Ship real products, test thoroughly, and focus on fundamentals before chasing every trend.",
    "Strong engineering habits come from repetition: build, review, test, and iterate."
  ],
  hello: [
    "Hey, I am Kevin. Ask me about iOS development, projects, AI, crypto, or Java the dog.",
    "Welcome. I can walk through my work history, architecture approach, and favorite projects."
  ],
  thanks: [
    "Happy to help.",
    "Anytime. Ask another question if you want to keep going."
  ],
  hobbies: [
    "Outside of core work I spend time on gaming, generative art, hiking, and side coding projects.",
    "Most of my hobbies still orbit around building things and exploring new tools."
  ],
  funny: [
    "Even with years of experience, I still occasionally look up how to center a div.",
    "Named my dog Java, and she has fewer runtime issues than most codebases."
  ],
  motivation: [
    "I am motivated by building software that removes friction for real users.",
    "The best outcome is when users say the product feels simple and dependable."
  ],
  freelance: [
    "I run SideApps and stay open to strong iOS opportunities, product builds, and consulting work."
  ],
  colorado: [
    "I have spent time in Colorado and built tools for teams there."
  ],
  philosophy: [
    "I care about craft: turning abstract ideas into useful products that improve daily workflows.",
    "Good software should feel invisible when it is working well."
  ],
  testing: [
    "Testing is mandatory for serious app teams. Coverage and behavior-focused tests reduce risk.",
    "I prefer automated tests that validate outcomes, not just implementation details."
  ],
  architecture: [
    "I favor clean, scalable app architecture and consistency across modules.",
    "Pattern choice is less important than clarity, predictability, and team-wide discipline."
  ]
};

const fallbackResponses = [
  "Good question. I do not have a preloaded answer for that exact topic, but I can talk in detail about iOS, architecture, or portfolio work.",
  "I am better on product, engineering, and project questions. Try asking about apps, Swift, AI, or my background.",
  "That is outside my prepared set. Ask about leadership, testing, or one of the projects on this page.",
  "I do not want to bluff an answer there. Try a question on iOS development, shipping process, or career history.",
  "I am not preloaded for that specific topic. Ask me about SideApps, mobile architecture, or major projects."
];

const keywordMap: KeywordEntry[] = [
  { keys: ['career', 'experience', 'work history', 'background', 'professional', 'resume', 'cv', 'job', 'jobs', 'employment'], cat: 'career' },
  { keys: ['washloft', 'wash loft', 'laundry'], cat: 'washloft' },
  { keys: ['capital one', 'capitalone', 'banking', 'fintech'], cat: 'capitalOne' },
  { keys: ['chewy', 'practicehub', 'practice hub', 'veterinar', 'vet app'], cat: 'chewy' },
  { keys: ['aaf', 'alliance of american football', 'football league', 'american football'], cat: 'aaf' },
  { keys: ['amwell', 'american well', 'telehealth', 'clinician'], cat: 'amwell' },
  { keys: ['apps', 'app', 'built', 'portfolio', 'projects', 'ship'], cat: 'apps' },
  { keys: ['splatpal', 'splatoon', 'nintendo'], cat: 'splatpal' },
  { keys: ['tech stack', 'technologies', 'tools', 'framework', 'what do you use', 'stack'], cat: 'techStack' },
  { keys: ['swift', 'swift language', 'swift programming'], cat: 'swift' },
  { keys: ['swiftui', 'swift ui', 'declarative'], cat: 'swiftui' },
  { keys: ['crypto', 'bitcoin', 'blockchain', 'web3', 'defi', 'token'], cat: 'crypto' },
  { keys: ['nft', 'nfts', 'generative art collection', 'mint'], cat: 'nft' },
  { keys: ['deso', 'bitclout', 'diamond app', 'decentralized social', 'creator coin'], cat: 'deso' },
  { keys: ['ai', 'artificial intelligence', 'machine learning', 'llm', 'chatgpt', 'gpt', 'language model', 'text to video', 'generative ai'], cat: 'ai' },
  { keys: ['dog', 'java', 'pet', 'pets', 'puppy', 'pup'], cat: 'dog' },
  { keys: ['game', 'gaming', 'splatoon game', 'oddsparks', 'play'], cat: 'gaming' },
  { keys: ['generative art', 'art', 'creative', 'nft art', 'slopes', 'algorithmic'], cat: 'art' },
  { keys: ['open source', 'opensource', 'github contribute', 'contribution', 'oss'], cat: 'opensource' },
  { keys: ['github', 'repos', 'repository', 'code', 'commit', 'contribution graph'], cat: 'github' },
  { keys: ['location', 'live', 'where', 'wilmington', 'delaware', 'based'], cat: 'location' },
  { keys: ['education', 'degree', 'school', 'university', 'cs degree', 'computer science degree'], cat: 'education' },
  { keys: ['leader', 'leadership', 'manage', 'manager', 'team', 'lead', 'mentor'], cat: 'leadership' },
  { keys: ['journey west', 'real estate', 'colorado tools', 'arcgis', 'summit county'], cat: 'journeyWest' },
  { keys: ['advice', 'tip', 'recommend', 'suggestion', 'junior', 'learn', 'start'], cat: 'advice' },
  { keys: ['hello', 'hi', 'hey', 'sup', "what's up", 'howdy', 'yo', 'greetings', 'morning', 'gm'], cat: 'hello' },
  { keys: ['thanks', 'thank you', 'thx', 'appreciate', 'cheers'], cat: 'thanks' },
  { keys: ['hobby', 'hobbies', 'free time', 'fun', 'outside work', 'interests', 'passion'], cat: 'hobbies' },
  { keys: ['funny', 'joke', 'humor', 'laugh', 'lol', 'haha'], cat: 'funny' },
  { keys: ['motivation', 'motivated', 'inspire', 'driven', 'why do you', 'what drives', 'purpose', 'tick'], cat: 'motivation' },
  { keys: ['freelance', 'hire', 'contract', 'consulting', 'available', 'sideapps'], cat: 'freelance' },
  { keys: ['colorado', 'arches', 'national park', 'sunset', 'hiking', 'mountain'], cat: 'colorado' },
  { keys: ['philosophy', 'meaning', 'life', 'deep', 'think about'], cat: 'philosophy' },
  { keys: ['test', 'testing', 'coverage', 'xctest', 'unit test', 'tdd'], cat: 'testing' },
  { keys: ['architecture', 'mvvm', 'mvc', 'design pattern', 'clean code', 'scalab'], cat: 'architecture' }
];

const defaultSuggestions = [
  'Tell me about your career',
  'What apps have you built?',
  'What tech stack do you use?',
  'Thoughts on AI?',
  'Do you have any pets?',
  'Any advice for devs?'
];

const followUpSuggestions: Record<string, string[]> = {
  career: ['Tell me about Capital One', 'What was Chewy like?', 'What about the football app?'],
  apps: ["What's SplatPal?", 'Tell me about WashLoft', "What's on your GitHub?"],
  dog: ['What games do you play?', 'Tell me about your hobbies', 'Any generative art?'],
  crypto: ['Do you create NFTs?', "What's DeSo?", 'Thoughts on AI?'],
  techStack: ['SwiftUI or UIKit?', 'How do you test?', 'Architecture patterns?'],
  ai: ['What apps have you built?', 'Do you make generative art?', 'Any advice for devs?'],
  hello: ["What's your background?", 'What have you built?', 'Got any pets?']
};

function getTimeLabel(): string {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function matchCategory(inputValue: string): string | null {
  const lowered = inputValue.toLowerCase();
  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const entry of keywordMap) {
    for (const key of entry.keys) {
      if (lowered.includes(key) && key.length > bestScore) {
        bestScore = key.length;
        bestMatch = entry.cat;
      }
    }
  }

  return bestMatch;
}

function pickResponse(
  category: string | null,
  usedResponses: MutableRefObject<Record<string, number[]>>
): string {
  const responseKey = category && responses[category] ? category : '_fallback';
  const pool = responseKey === '_fallback' ? fallbackResponses : responses[responseKey];
  const used = usedResponses.current[responseKey] ?? [];
  const availableIndices = pool
    .map((_, index) => index)
    .filter((index) => !used.includes(index));

  let selectedIndex: number;
  if (availableIndices.length > 0) {
    selectedIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    usedResponses.current[responseKey] = [...used, selectedIndex];
  } else {
    selectedIndex = Math.floor(Math.random() * pool.length);
    usedResponses.current[responseKey] = [selectedIndex];
  }

  return pool[selectedIndex];
}

export default function KevinChatbotSection() {
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const usedResponsesRef = useRef<Record<string, number[]>>({});
  const pendingTimeoutsRef = useRef<number[]>([]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [timestamp, setTimestamp] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>(defaultSuggestions);

  const sendMessage = useCallback((rawMessage: string) => {
    const trimmed = rawMessage.trim();
    if (!trimmed) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      isKevin: false,
      text: trimmed
    };
    setMessages((previous) => [...previous, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const matchedCategory = matchCategory(trimmed);
    const delay = 600 + Math.random() * 800;
    const timeoutId = window.setTimeout(() => {
      setIsTyping(false);
      const reply = pickResponse(matchedCategory, usedResponsesRef);
      const botMessage: ChatMessage = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        isKevin: true,
        text: reply
      };
      setMessages((previous) => [...previous, botMessage]);
      setSuggestions(
        matchedCategory && followUpSuggestions[matchedCategory]
          ? followUpSuggestions[matchedCategory]
          : defaultSuggestions
      );
    }, delay);

    pendingTimeoutsRef.current.push(timeoutId);
  }, []);

  useEffect(() => {
    setTimestamp(`Today ${getTimeLabel()}`);
    setSuggestions(defaultSuggestions);

    const initialDelay = window.setTimeout(() => {
      setIsTyping(true);
      const welcomeDelay = window.setTimeout(() => {
        setIsTyping(false);
        setMessages([
          {
            id: Date.now(),
            isKevin: true,
            text: "Hey, I am Kevin. I am an iOS engineer, builder, and SideApps founder. Ask me about my projects, engineering approach, or anything else you want to know."
          }
        ]);
      }, 1200);
      pendingTimeoutsRef.current.push(welcomeDelay);
    }, 500);

    pendingTimeoutsRef.current.push(initialDelay);

    return () => {
      for (const timeoutId of pendingTimeoutsRef.current) {
        window.clearTimeout(timeoutId);
      }
      pendingTimeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!chatAreaRef.current) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      if (!chatAreaRef.current) {
        return;
      }
      chatAreaRef.current.scrollTo({
        top: chatAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [messages, isTyping]);

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.style.height = 'auto';
    inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 100)}px`;
  }, [inputValue]);

  return (
    <section id="chatbot" className="relative bg-black px-4 pb-24 pt-12 md:px-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 space-y-3 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Chat With Kevin</h2>
          <p className="mx-auto max-w-2xl text-sm text-zinc-400 md:text-base">
            This assistant is based on my public profile and project history. Ask about apps, architecture, AI, crypto, or my engineering background.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-zinc-950">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent_40%)]" />
          <div className="relative z-10 mx-auto flex h-[80vh] min-h-[560px] max-h-[820px] w-full max-w-3xl flex-col">
            <header className="border-b border-emerald-500/15 bg-black/40 px-5 py-4 backdrop-blur-sm md:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-500 text-sm font-semibold text-white">
                  KS
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    Kevin Sullivan
                  </h3>
                  <p className="text-xs text-zinc-500">iOS Developer and SideApps Founder</p>
                </div>
              </div>
            </header>

            <div ref={chatAreaRef} className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
              <p className="mb-4 text-center text-xs text-zinc-600">{timestamp}</p>
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isKevin ? 'justify-start' : 'justify-end'}`}>
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed md:max-w-[82%] ${
                        message.isKevin
                          ? 'rounded-tl-sm border border-emerald-500/20 bg-emerald-900/40 text-emerald-50'
                          : 'rounded-tr-sm border border-zinc-700 bg-zinc-800/90 text-zinc-100'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-emerald-500/20 bg-emerald-900/40 px-4 py-3">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-300 [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-300 [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-300" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-emerald-500/15 px-4 py-3 md:px-6">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                    className="whitespace-nowrap rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-emerald-500/40 hover:text-emerald-300"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <div className="flex items-end gap-2 rounded-2xl border border-zinc-700 bg-zinc-900/90 p-2">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      sendMessage(inputValue);
                    }
                  }}
                  rows={1}
                  placeholder="Ask Kevin anything..."
                  className="max-h-[100px] min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-zinc-500"
                />
                <button
                  type="button"
                  onClick={() => sendMessage(inputValue)}
                  className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gradient-to-br from-emerald-700 to-emerald-500 text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!inputValue.trim()}
                  aria-label="Send"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2 11 13" />
                    <path d="M22 2 15 22 11 13 2 9 22 2Z" />
                  </svg>
                </button>
              </div>
            </div>

            <footer className="px-6 pb-4 pt-1 text-center text-[11px] text-zinc-600">
              Built from public social profile content. This is a simulated assistant.
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}
