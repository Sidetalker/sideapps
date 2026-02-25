'use client';

import { useState, useCallback } from 'react';
import SignaturePreview from './SignaturePreview';

interface SignatureData {
  name: string;
  title: string;
  phone: string;
  profileImageUrl: string;
}

interface AdvancedSettings {
  nameFontSize: number;
  titleFontSize: number;
  contactFontSize: number;
  horizontalPadding: number;
  textGroupSpacing: number;
  lineSpacing: number;
  profileImageSize: number;
  logoImageSize: number;
  profileImageBorder: {
    enabled: boolean;
    width: number;
    color: string;
  };
}

export default function SignatureEditor() {
  const [signatureData, setSignatureData] = useState<SignatureData>({
    name: 'Employee',
    title: 'Title',
    phone: '123-456-7890',
    profileImageUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'
  });

  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({
    nameFontSize: 16,
    titleFontSize: 13,
    contactFontSize: 13,
    horizontalPadding: 20,
    textGroupSpacing: 10,
    lineSpacing: 0,
    profileImageSize: 90,
    logoImageSize: 75,
    profileImageBorder: {
      enabled: false,
      width: 2,
      color: '#cccccc'
    }
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleInputChange = (field: keyof SignatureData, value: string) => {
    setSignatureData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdvancedChange = (field: keyof AdvancedSettings, value: number | boolean | string) => {
    setAdvancedSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBorderChange = (field: keyof AdvancedSettings['profileImageBorder'], value: boolean | number | string) => {
    setAdvancedSettings(prev => ({
      ...prev,
      profileImageBorder: {
        ...prev.profileImageBorder,
        [field]: value
      }
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
      const signatureHtml = generateSignatureHtml(signatureData, advancedSettings);
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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

          {/* Advanced Controls Toggle */}
          <div className="border-t pt-6">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <span>Advanced Settings</span>
              <svg
                className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Advanced Controls */}
            {showAdvanced && (
              <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg">
                {/* Font Sizes */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-800">Font Sizes</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Name</label>
                      <input
                        type="number"
                        min="10"
                        max="24"
                        value={advancedSettings.nameFontSize}
                        onChange={(e) => handleAdvancedChange('nameFontSize', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Title</label>
                      <input
                        type="number"
                        min="8"
                        max="20"
                        value={advancedSettings.titleFontSize}
                        onChange={(e) => handleAdvancedChange('titleFontSize', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Contact</label>
                      <input
                        type="number"
                        min="8"
                        max="20"
                        value={advancedSettings.contactFontSize}
                        onChange={(e) => handleAdvancedChange('contactFontSize', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Spacing */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-800">Spacing</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Horizontal Padding</label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={advancedSettings.horizontalPadding}
                        onChange={(e) => handleAdvancedChange('horizontalPadding', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Text Group Spacing</label>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={advancedSettings.textGroupSpacing}
                        onChange={(e) => handleAdvancedChange('textGroupSpacing', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Line Spacing</label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={advancedSettings.lineSpacing}
                        onChange={(e) => handleAdvancedChange('lineSpacing', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Sizes */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-800">Image Sizes</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Profile Picture</label>
                      <input
                        type="number"
                        min="40"
                        max="150"
                        value={advancedSettings.profileImageSize}
                        onChange={(e) => handleAdvancedChange('profileImageSize', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Logo Size</label>
                      <input
                        type="number"
                        min="30"
                        max="120"
                        value={advancedSettings.logoImageSize}
                        onChange={(e) => handleAdvancedChange('logoImageSize', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Image Border */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-800">Profile Image Border</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={advancedSettings.profileImageBorder.enabled}
                        onChange={(e) => handleBorderChange('enabled', e.target.checked)}
                        className="mr-2 rounded"
                      />
                      <span className="text-sm text-gray-700">Enable border</span>
                    </label>
                    {advancedSettings.profileImageBorder.enabled && (
                      <div className="grid grid-cols-2 gap-3 ml-6">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Width (px)</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={advancedSettings.profileImageBorder.width}
                            onChange={(e) => handleBorderChange('width', parseInt(e.target.value))}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Color</label>
                          <input
                            type="color"
                            value={advancedSettings.profileImageBorder.color}
                            onChange={(e) => handleBorderChange('color', e.target.value)}
                            className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Preview</h2>
        <SignaturePreview signatureData={signatureData} advancedSettings={advancedSettings} />
      </div>
    </div>
  );
}

function generateSignatureHtml(data: SignatureData, settings: AdvancedSettings): string {
  const profileBorderStyle = settings.profileImageBorder.enabled 
    ? `border: ${settings.profileImageBorder.width}px solid ${settings.profileImageBorder.color}; ` 
    : '';

  return `<table cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif; color: #333; width: auto;">
    <tr>
        <td style="padding-right: ${settings.horizontalPadding}px; vertical-align: top; white-space: nowrap;">
            <img src="${data.profileImageUrl}" alt="Profile Picture" width="${settings.profileImageSize}" style="border-radius: 50%; width: ${settings.profileImageSize}px; height: ${settings.profileImageSize}px; object-fit: cover; ${profileBorderStyle}display: block;">
        </td>
        <td style="vertical-align: middle; line-height: 1.2; white-space: nowrap;">
            <div style="font-size: ${settings.nameFontSize}px; font-weight: bold;">${data.name}</div>
            <div style="font-size: ${settings.titleFontSize}px; font-style: italic; margin-bottom: ${settings.textGroupSpacing}px; margin-top: ${settings.lineSpacing}px;">${data.title}</div>
            <div style="font-size: ${settings.contactFontSize}px; margin-bottom: ${settings.lineSpacing}px;">Mobile: <a href="tel:${data.phone}" style="color: #0066cc; text-decoration: none;">${data.phone}</a></div>
            <div style="font-size: ${settings.contactFontSize}px;"><a href="http://journeywestcolorado.com" style="color: #0066cc; text-decoration: none;">journeywestcolorado.com</a></div>
        </td>
        <td style="vertical-align: top; padding-left: 10px;">
            <img src="https://www.sideapps.dev/journeyWest/logo.png" alt="Journey West Logo" width="${settings.logoImageSize}" style="width: ${settings.logoImageSize}px; display: block;">
        </td>
    </tr>
</table>`;
}