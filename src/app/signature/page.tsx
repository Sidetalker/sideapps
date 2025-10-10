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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/journeyWest/textLogo.jpg" 
            alt="Journey West Colorado Email Signature Editor" 
            className="mx-auto mb-4 h-16 w-auto"
          />
          <p className="text-gray-600">
            The Mountains are Calling... <span className="italic font-bold">don&apos;t wait around on your email signature</span>
          </p>
        </div>
        <SignatureEditor />
      </div>
    </div>
  );
}