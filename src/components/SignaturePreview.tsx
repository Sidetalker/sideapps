interface SignatureData {
  name: string;
  title: string;
  phone: string;
  profileImageUrl: string;
}

interface SignaturePreviewProps {
  signatureData: SignatureData;
}

export default function SignaturePreview({ signatureData }: SignaturePreviewProps) {
  return (
    <div className="space-y-6">
      {/* HTML Preview */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Visual Preview</h3>
        <div className="bg-white p-4 rounded border">
          <table 
            cellPadding="0" 
            cellSpacing="0" 
            style={{
              borderCollapse: 'collapse',
              fontFamily: 'Arial, sans-serif',
              color: '#333'
            }}
          >
            <tbody>
              <tr>
                <td style={{
                  paddingRight: '20px',
                  verticalAlign: 'top'
                }}>
                  <img 
                    src={signatureData.profileImageUrl} 
                    alt="Profile Picture" 
                    width="90"
                    style={{
                      borderRadius: '50%',
                      width: '90px',
                      height: '90px',
                      objectFit: 'cover'
                    }}
                  />
                </td>
                <td style={{
                  verticalAlign: 'middle',
                  lineHeight: '1.2'
                }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    {signatureData.name}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    fontStyle: 'italic',
                    marginBottom: '10px'
                  }}>
                    {signatureData.title}
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    Mobile: <a href={`tel:${signatureData.phone}`} style={{ color: '#0066cc', textDecoration: 'none' }}>{signatureData.phone}</a>
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    <a href="http://journeywestcolorado.com" style={{ color: '#0066cc', textDecoration: 'none' }}>journeywestcolorado.com</a>
                  </div>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                  <img 
                    src="https://www.sideapps.dev/journeyWest/logo.png" 
                    alt="Journey West Logo" 
                    width="75"
                    style={{ width: '75px' }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* HTML Code Preview */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-3">HTML Code</h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded text-xs font-mono overflow-x-auto">
          <pre className="whitespace-pre-wrap break-all">
{`<table cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif; color: #333;">
    <tr>
        <td style="padding-right: 20px; vertical-align: top;">
            <img src="${signatureData.profileImageUrl}" alt="Profile Picture" width="90" style="border-radius: 50%; width: 90px;">
        </td>
        <td style="vertical-align: middle; line-height: 1.2;">
            <div style="font-size: 16px; font-weight: bold;">${signatureData.name}</div>
            <div style="font-size: 13px; font-style: italic; margin-bottom: 10px;">${signatureData.title}</div>
            <div style="font-size: 13px;">Mobile: <a href="tel:${signatureData.phone}" style="color: #0066cc; text-decoration: none;">${signatureData.phone}</a></div>
            <div style="font-size: 13px;"><a href="http://journeywestcolorado.com" style="color: #0066cc; text-decoration: none;">journeywestcolorado.com</a></div>
        </td>
        <td style="vertical-align: top;">
            <img src="https://www.sideapps.dev/journeyWest/logo.png" alt="Journey West Logo" width="75" style="width: 75px;">
        </td>
    </tr>
</table>`}
          </pre>
        </div>
      </div>
    </div>
  );
}