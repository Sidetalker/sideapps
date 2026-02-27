'use client';

import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react';
import {
  defaultSuggestions,
  fallbacks,
  followUpSuggestions,
  footerNote,
  initialKevinMessage,
  keywordMap,
  responses
} from '@/data/kevinChatbotData';

interface ChatMessage {
  id: number;
  isKevin: boolean;
  text: string;
  isHtml?: boolean;
}

interface KeywordEntry {
  keys: string[];
  cat: string;
}

const responseMap = responses as Record<string, string[]>;
const fallbackList = fallbacks as string[];
const keywordEntries = keywordMap as KeywordEntry[];
const defaultSuggestionList = defaultSuggestions as string[];
const followUpMap = followUpSuggestions as Record<string, string[]>;

function getTimeLabel(): string {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function matchCategory(inputValue: string): string | null {
  const lowered = inputValue.toLowerCase();
  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const entry of keywordEntries) {
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
  const responseKey = category && responseMap[category] ? category : '_fallback';
  const pool = responseKey === '_fallback' ? fallbackList : responseMap[responseKey];
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
  const [suggestions, setSuggestions] = useState<string[]>(defaultSuggestionList);

  const sendMessage = useCallback((rawMessage: string) => {
    if (!rawMessage || !rawMessage.trim()) {
      return;
    }

    const trimmed = rawMessage.trim();
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
        matchedCategory && followUpMap[matchedCategory]
          ? followUpMap[matchedCategory]
          : defaultSuggestionList
      );
    }, delay);

    pendingTimeoutsRef.current.push(timeoutId);
  }, []);

  useEffect(() => {
    setTimestamp(`Today ${getTimeLabel()}`);
    setSuggestions(defaultSuggestionList);

    const initialDelay = window.setTimeout(() => {
      setIsTyping(true);
      const welcomeDelay = window.setTimeout(() => {
        setIsTyping(false);
        setMessages([
          {
            id: Date.now(),
            isKevin: true,
            text: initialKevinMessage,
            isHtml: true
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
            This assistant is based on public social profile content and project history.
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
                      {message.isKevin ? (
                        <span
                          dangerouslySetInnerHTML={{ __html: message.text }}
                        />
                      ) : (
                        message.text
                      )}
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
              {footerNote}
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}
