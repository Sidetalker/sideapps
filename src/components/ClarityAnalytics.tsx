'use client';

import { useEffect } from 'react';

declare global {
    interface Window {
        clarity: {
            q?: unknown[];
            (...args: unknown[]): void;
        };
        [key: string]: unknown;
    }
}

function debugLog(message: string, ...args: unknown[]) {
    console.log(`[Clarity Debug] ${message}`, ...args);
}

export function ClarityAnalytics() {
    useEffect(() => {
        debugLog('ClarityAnalytics useEffect triggered');
        let clarityInstance: typeof window.clarity | undefined;
        
        // Only run in production and client-side
        if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
            debugLog('Initializing Clarity in production mode');
            (function(c: Window, l: Document, a: string, r: string, i: string, t?: HTMLScriptElement, y?: Element){
                const clarityFunc = function(...args: unknown[]){
                    const clarity = (c[a] as { q?: unknown[] });
                    clarity.q = clarity.q || [];
                    debugLog('Clarity queue operation', args);
                    clarity.q.push(args);
                };
                c[a] = c[a] || clarityFunc;
                if (l.createElement && l.getElementsByTagName) {
                    t = l.createElement(r) as HTMLScriptElement;
                    if (t) {
                        t.async = true;
                        t.src = "https://www.clarity.ms/tag/" + i;
                        y = l.getElementsByTagName(r)[0];
                        if (y?.parentNode) {
                            debugLog('Inserting Clarity script into DOM');
                            y.parentNode.insertBefore(t, y);
                        }
                    }
                }
            })(window, document, "clarity", "script", "qgf1ui728l");

            // Store reference to clarity instance
            clarityInstance = window.clarity;
            debugLog('Clarity instance stored', !!clarityInstance);

            // Add SPA tracking
            const handleRouteChange = () => {
                debugLog('Route change detected');
                if (clarityInstance) {
                    debugLog('Notifying Clarity of new page');
                    clarityInstance("newPage");
                } else {
                    debugLog('Warning: Clarity instance not available during route change');
                }
            };

            // Start tracking
            if (clarityInstance) {
                debugLog('Starting Clarity tracking');
                clarityInstance("start");
            } else {
                debugLog('Warning: Could not start Clarity tracking - instance not available');
            }

            // Listen for URL changes
            window.addEventListener('popstate', handleRouteChange);
            debugLog('Added popstate event listener');
            
            // Cleanup
            return () => {
                debugLog('Cleaning up Clarity analytics');
                window.removeEventListener('popstate', handleRouteChange);
                // Ensure clarity stops tracking when component unmounts
                if (clarityInstance) {
                    debugLog('Stopping Clarity tracking');
                    clarityInstance("stop");
                } else {
                    debugLog('Warning: Could not stop Clarity tracking - instance not available');
                }
            };
        } else {
            debugLog('Clarity not initialized - not in production mode or window not available');
        }
    }, []);

    return null;
} 