'use client';

import { useState, useCallback } from 'react';
import SignaturePreview from './SignaturePreview';

interface SignatureData {
  name: string;
  title: string;
  phone: string;
  profileImageUrl: string;
}

export default function SignatureEditor() {
  const [signatureData, setSignatureData] = useState<SignatureData>({
    name: 'Employee',
    title: 'Title',
    phone: '123-456-7890',
    profileImageUrl: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fdefault-user&psig=AOvVaw1jxmKvsL2iuOdQodJ36z44&ust=1760224493038000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCPiMy6_hmpADFQAAAAAdAAAAABAE'
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleInputChange = (field: keyof SignatureData, value: string) => {
    setSignatureData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const { url } = await response.json();
      handleInputChange('profileImageUrl', url);
    } catch (error) {
      console.error('Image upload error:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const copySignatureToClipboard = async () => {
    try {
      const signatureHtml = generateSignatureHtml(signatureData);
      await navigator.clipboard.writeText(signatureHtml);
      // You could add a toast notification here
      alert('Signature copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Failed to copy signature. Please try again.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Editor Controls */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Edit Signature</h2>
        
        <div className="space-y-6">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={signatureData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <input
              type="text"
              id="title"
              value={signatureData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your job title"
            />
          </div>

          {/* Phone Input */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={signatureData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Profile Image Upload */}
          <div>
            <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="space-y-3">
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {isUploading && (
                <p className="text-sm text-blue-600">Uploading image...</p>
              )}
              {uploadError && (
                <p className="text-sm text-red-600">{uploadError}</p>
              )}
              {signatureData.profileImageUrl && (
                <div className="flex items-center space-x-3">
                  <img
                    src={signatureData.profileImageUrl}
                    alt="Profile preview"
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                  <span className="text-sm text-gray-600">Current image</span>
                </div>
              )}
            </div>
          </div>

          {/* Copy Button */}
          <div className="pt-4">
            <button
              onClick={copySignatureToClipboard}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Copy Signature HTML
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Preview</h2>
        <SignaturePreview signatureData={signatureData} />
      </div>
    </div>
  );
}

function generateSignatureHtml(data: SignatureData): string {
  return `<table cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif; color: #333;">
    <tr>
        <td style="padding-right: 20px; vertical-align: top;">
            <img src="${data.profileImageUrl}" alt="Profile Picture" width="90" style="border-radius: 50%; width: 90px;">
        </td>
        <td style="vertical-align: middle; line-height: 1.2;">
            <div style="font-size: 16px; font-weight: bold;">${data.name}</div>
            <div style="font-size: 13px; font-style: italic; margin-bottom: 10px;">${data.title}</div>
            <div style="font-size: 13px;">Mobile: <a href="tel:${data.phone}" style="color: #0066cc; text-decoration: none;">${data.phone}</a></div>
            <div style="font-size: 13px;"><a href="http://journeywestcolorado.com" style="color: #0066cc; text-decoration: none;">journeywestcolorado.com</a></div>
        </td>
        <td style="vertical-align: top;">
            <img src="https://www.sideapps.dev/journeyWest/logo.png" alt="Journey West Logo" width="75" style="width: 75px;">
        </td>
    </tr>
</table>`;
}