import { Suspense } from 'react';
import AuthActionHandler from '@/components/AuthActionHandler';
import AuthActionMessage from '@/components/AuthActionMessage';

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthActionMessage />}>
      <AuthActionHandler />
    </Suspense>
  );
}
