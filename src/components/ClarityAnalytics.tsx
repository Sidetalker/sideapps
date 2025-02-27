'use client';

import { useEffect } from 'react';

declare global {
    interface Window {
        clarity: any;
    }
}

export function ClarityAnalytics() {
    useEffect(() => {
        // Only run in production and client-side
        if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
            (function(c: any, l: Document, a: string, r: string, i: string, t?: HTMLScriptElement, y?: Element){
                c[a] = c[a] || function(){(c[a].q = c[a].q || []).push(arguments)};
                if (l.createElement && l.getElementsByTagName) {
                    t = l.createElement(r) as HTMLScriptElement;
                    if (t) {
                        t.async = true;
                        t.src = "https://www.clarity.ms/tag/" + i;
                        y = l.getElementsByTagName(r)[0];
                        if (y?.parentNode) {
                            y.parentNode.insertBefore(t, y);
                        }
                    }
                }
            })(window, document, "clarity", "script", "qgf1ui728l");
        }
    }, []);

    return null;
} 