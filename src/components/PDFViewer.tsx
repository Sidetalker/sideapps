import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FiDownload } from 'react-icons/fi';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Use the bundled worker from our public directory
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

interface PDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ isOpen, onClose }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageWidth, setPageWidth] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Add timestamp to prevent caching
  const pdfUrl = `/misc/Kevin_Sullivan_iOS_Engineer_Resume.pdf?t=${Date.now()}`;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'Kevin_Sullivan_iOS_Engineer_Resume.pdf';
    link.click();
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error('PDF load error:', error);
    setError(error);
    setIsLoading(false);
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className={`relative bg-white ${isMobile ? 'w-full h-full' : 'w-[90%] max-w-4xl h-[90vh] rounded-lg'}`}
        ref={(ref) => {
          if (ref) {
            setPageWidth(ref.clientWidth);
          }
        }}
      >
        <div className="w-full h-full overflow-auto touch-pan-y pinch-zoom">
          {isMobile ? (
            <>
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="flex items-center justify-center h-full">
                    <div className={`text-gray-600 ${!isLoading ? 'hidden' : ''}`}>
                      Loading PDF...
                    </div>
                  </div>
                }
                error={
                  <div className="flex items-center justify-center h-full">
                    <div className="text-red-600">
                      Error loading PDF: {error?.message}
                    </div>
                  </div>
                }
                className="flex flex-col items-center pb-20 touch-pan-y"
              >
                <Page 
                  pageNumber={pageNumber} 
                  width={pageWidth} 
                  renderTextLayer={false}
                  error={
                    <div className="text-red-600">
                      Error loading page {pageNumber}
                    </div>
                  }
                  className="touch-pan-y"
                />
                {numPages && numPages > 1 && (
                  <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full">
                    <p>
                      Page {pageNumber} of {numPages}
                    </p>
                  </div>
                )}
              </Document>
            </>
          ) : (
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title="Resume PDF"
            />
          )}
        </div>

        {isMobile && (
          <>
            <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 flex justify-between items-center">
              <button onClick={onClose} className="flex items-center gap-2">
                <IoClose size={24} />
                Close
              </button>
              <div className="flex items-center gap-4">
                {numPages && numPages > 1 && (
                  <>
                    <button 
                      onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                      disabled={pageNumber <= 1}
                      className="disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button 
                      onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || 1))}
                      disabled={pageNumber >= (numPages || 1)}
                      className="disabled:opacity-50"
                    >
                      Next
                    </button>
                  </>
                )}
                <button onClick={handleDownload} className="flex items-center gap-2">
                  <FiDownload size={24} />
                  Download
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PDFViewer; 