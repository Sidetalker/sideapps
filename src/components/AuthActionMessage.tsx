import type { ReactNode } from 'react';

interface AuthActionMessageProps {
  title?: string;
  description?: ReactNode;
}

export function AuthActionMessage({
  title = 'Opening Nutra App...',
  description = "If the app doesn't open automatically, please install it from the App Store.",
}: AuthActionMessageProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-4 max-w-md text-base text-gray-600">{description}</p>
    </main>
  );
}

export default AuthActionMessage;
