'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const APP_STORE_URL = 'https://apps.apple.com/app/<NUTRA-TBD>';
const DEEP_LINK_SCHEME = 'nutra://auth/action';
const FALLBACK_DELAY_MS = 2000;

export function AuthActionHandler() {
  const searchParams = useSearchParams();

  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');
  const apiKey = searchParams.get('apiKey');
  const continueUrl = searchParams.get('continueUrl');

  useEffect(() => {
    if (!mode || !oobCode) {
      return;
    }

    const deepLinkParams = new URLSearchParams({ mode, oobCode });

    if (apiKey) {
      deepLinkParams.set('apiKey', apiKey);
    }

    if (continueUrl) {
      deepLinkParams.set('continueUrl', continueUrl);
    }

    const deepLink = `${DEEP_LINK_SCHEME}?${deepLinkParams.toString()}`;

    window.location.href = deepLink;

    const fallbackTimer = window.setTimeout(() => {
      window.location.href = APP_STORE_URL;
    }, FALLBACK_DELAY_MS);

    return () => {
      window.clearTimeout(fallbackTimer);
    };
  }, [mode, oobCode, apiKey, continueUrl]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">Opening Nutra App...</h1>
      <p className="mt-4 max-w-md text-base text-gray-600">
        If the app doesn&apos;t open automatically, please install it from the App Store.
      </p>
    </main>
  );
}

export default AuthActionHandler;
