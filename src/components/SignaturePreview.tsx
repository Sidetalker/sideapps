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

interface SignaturePreviewProps {
  signatureData: SignatureData;
  advancedSettings: AdvancedSettings;
}

export default function SignaturePreview({ signatureData, advancedSettings }: SignaturePreviewProps) {
  const profileBorderStyle = advancedSettings.profileImageBorder.enabled 
    ? `${advancedSettings.profileImageBorder.width}px solid ${advancedSettings.profileImageBorder.color}` 
    : 'none';

  const copyVisualSignature = async () => {
    try {
      // Create a temporary div with the signature content
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      
      const profileBorderStyleForHTML = advancedSettings.profileImageBorder.enabled 
        ? `border: ${advancedSettings.profileImageBorder.width}px solid ${advancedSettings.profileImageBorder.color}; ` 
        : '';

      tempDiv.innerHTML = `<table cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif; color: #333;">
        <tr>
            <td style="padding-right: ${advancedSettings.horizontalPadding}px; vertical-align: top;">
                <img src="${signatureData.profileImageUrl}" alt="Profile Picture" width="${advancedSettings.profileImageSize}" style="border-radius: 50%; width: ${advancedSettings.profileImageSize}px; height: ${advancedSettings.profileImageSize}px; object-fit: cover; ${profileBorderStyleForHTML}">
            </td>
            <td style="vertical-align: middle; line-height: 1.2;">
                <div style="font-size: ${advancedSettings.nameFontSize}px; font-weight: bold;">${signatureData.name}</div>
                <div style="font-size: ${advancedSettings.titleFontSize}px; font-style: italic; margin-bottom: ${advancedSettings.textGroupSpacing}px; margin-top: ${advancedSettings.lineSpacing}px;">${signatureData.title}</div>
                <div style="font-size: ${advancedSettings.contactFontSize}px; margin-bottom: ${advancedSettings.lineSpacing}px;">Mobile: <a href="tel:${signatureData.phone}" style="color: #0066cc; text-decoration: none;">${signatureData.phone}</a></div>
                <div style="font-size: ${advancedSettings.contactFontSize}px;"><a href="http://journeywestcolorado.com" style="color: #0066cc; text-decoration: none;">journeywestcolorado.com</a></div>
            </td>
            <td style="vertical-align: top;">
                <img src="https://www.sideapps.dev/journeyWest/logo.png" alt="Journey West Logo" width="${advancedSettings.logoImageSize}" style="width: ${advancedSettings.logoImageSize}px;">
            </td>
        </tr>
      </table>`;

      document.body.appendChild(tempDiv);

      // Select and copy the content
      const range = document.createRange();
      range.selectNodeContents(tempDiv);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);

      // Try to copy using the modern API first
      try {
        const htmlContent = tempDiv.innerHTML;
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([htmlContent], { type: 'text/html' }),
            'text/plain': new Blob([tempDiv.textContent || ''], { type: 'text/plain' })
          })
        ]);
        alert('Visual signature copied to clipboard!');
      } catch (clipboardError) {
        // Fallback to execCommand for older browsers
        console.warn('Modern clipboard API failed, trying fallback:', clipboardError);
        const successful = document.execCommand('copy');
        if (successful) {
          alert('Visual signature copied to clipboard!');
        } else {
          throw new Error('Copy command failed');
        }
      }

      // Clean up
      document.body.removeChild(tempDiv);
      selection?.removeAllRanges();

    } catch (error) {
      console.error('Failed to copy visual signature:', error);
      alert('Failed to copy visual signature. Please try copying the HTML code instead.');
    }
  };

  return (
    <div className="space-y-6">
      {/* HTML Preview */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-gray-700">Visual Preview</h3>
          <button
            onClick={copyVisualSignature}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Copy Visual Signature
          </button>
        </div>
        <div className="bg-white p-4 rounded border overflow-x-auto">
          <div className="min-w-max">
            <table 
              cellPadding="0" 
              cellSpacing="0" 
              style={{
                borderCollapse: 'collapse',
                fontFamily: 'Arial, sans-serif',
                color: '#333',
                width: 'auto'
              }}
            >
              <tbody>
                <tr>
                  <td style={{
                    paddingRight: `${advancedSettings.horizontalPadding}px`,
                    verticalAlign: 'top',
                    whiteSpace: 'nowrap'
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={signatureData.profileImageUrl} 
                      alt="Profile Picture" 
                      width={advancedSettings.profileImageSize}
                      style={{
                        borderRadius: '50%',
                        width: `${advancedSettings.profileImageSize}px`,
                        height: `${advancedSettings.profileImageSize}px`,
                        objectFit: 'cover',
                        border: profileBorderStyle,
                        display: 'block'
                      }}
                    />
                  </td>
                  <td style={{
                    verticalAlign: 'middle',
                    lineHeight: '1.2',
                    whiteSpace: 'nowrap'
                  }}>
                    <div style={{
                      fontSize: `${advancedSettings.nameFontSize}px`,
                      fontWeight: 'bold'
                    }}>
                      {signatureData.name}
                    </div>
                    <div style={{
                      fontSize: `${advancedSettings.titleFontSize}px`,
                      fontStyle: 'italic',
                      marginBottom: `${advancedSettings.textGroupSpacing}px`,
                      marginTop: `${advancedSettings.lineSpacing}px`
                    }}>
                      {signatureData.title}
                    </div>
                    <div style={{ 
                      fontSize: `${advancedSettings.contactFontSize}px`,
                      marginBottom: `${advancedSettings.lineSpacing}px`
                    }}>
                      Mobile: <a href={`tel:${signatureData.phone}`} style={{ color: '#0066cc', textDecoration: 'none' }}>{signatureData.phone}</a>
                    </div>
                    <div style={{ fontSize: `${advancedSettings.contactFontSize}px` }}>
                      <a href="http://journeywestcolorado.com" style={{ color: '#0066cc', textDecoration: 'none' }}>journeywestcolorado.com</a>
                    </div>
                  </td>
                  <td style={{ 
                    verticalAlign: 'top',
                    paddingLeft: '10px'
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="https://www.sideapps.dev/journeyWest/logo.png" 
                      alt="Journey West Logo" 
                      width={advancedSettings.logoImageSize}
                      style={{ 
                        width: `${advancedSettings.logoImageSize}px`,
                        display: 'block'
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* HTML Code Preview */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-3">HTML Code</h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded text-xs font-mono overflow-x-auto">
          <pre className="whitespace-pre-wrap break-all">
{(() => {
  const profileBorderStyle = advancedSettings.profileImageBorder.enabled 
    ? `border: ${advancedSettings.profileImageBorder.width}px solid ${advancedSettings.profileImageBorder.color}; ` 
    : '';

  return `<table cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif; color: #333;">
    <tr>
        <td style="padding-right: ${advancedSettings.horizontalPadding}px; vertical-align: top;">
            <img src="${signatureData.profileImageUrl}" alt="Profile Picture" width="${advancedSettings.profileImageSize}" style="border-radius: 50%; width: ${advancedSettings.profileImageSize}px; height: ${advancedSettings.profileImageSize}px; object-fit: cover; ${profileBorderStyle}">
        </td>
        <td style="vertical-align: middle; line-height: 1.2;">
            <div style="font-size: ${advancedSettings.nameFontSize}px; font-weight: bold;">${signatureData.name}</div>
            <div style="font-size: ${advancedSettings.titleFontSize}px; font-style: italic; margin-bottom: ${advancedSettings.textGroupSpacing}px; margin-top: ${advancedSettings.lineSpacing}px;">${signatureData.title}</div>
            <div style="font-size: ${advancedSettings.contactFontSize}px; margin-bottom: ${advancedSettings.lineSpacing}px;">Mobile: <a href="tel:${signatureData.phone}" style="color: #0066cc; text-decoration: none;">${signatureData.phone}</a></div>
            <div style="font-size: ${advancedSettings.contactFontSize}px;"><a href="http://journeywestcolorado.com" style="color: #0066cc; text-decoration: none;">journeywestcolorado.com</a></div>
        </td>
        <td style="vertical-align: top;">
            <img src="https://www.sideapps.dev/journeyWest/logo.png" alt="Journey West Logo" width="${advancedSettings.logoImageSize}" style="width: ${advancedSettings.logoImageSize}px;">
        </td>
    </tr>
</table>`;
})()}
          </pre>
        </div>
      </div>
    </div>
  );
}