import { Metadata } from 'next';
import SignatureEditor from '@/components/SignatureEditor';

export const metadata: Metadata = {
  title: 'Email Signature Editor | SideApps',
  description: 'Create and customize professional email signatures with real-time preview',
};

export default function SignaturePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Email Signature Editor
          </h1>
          <p className="text-gray-600">
            Create professional email signatures with real-time preview
          </p>
        </div>
        <SignatureEditor />
      </div>
    </div>
  );
}