'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { ExternalLink, Globe, Maximize2, Minimize2 } from 'lucide-react';

const WireframeCard = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <div className="w-full h-full">
      {/* SignEX Training iframe Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-full">
        <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-800">SignEX Training</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              onClick={() => setIsFullscreen(!isFullscreen)}
              variant="outline"
              size="sm"
              className="p-1 h-6 w-6"
            >
              {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </Button>
            <Button
              onClick={() => window.open('http://localhost:8000/templates/Training.html', '_blank')}
              size="sm"
              variant="outline"
              className="p-1 h-6 w-6"
              title="Open SignEX Training in new tab"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        {/* iframe Container */}
        <div className={`relative bg-white ${isFullscreen ? 'fixed inset-4 z-50' : 'h-80'}`}>
          {!iframeLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-xs text-gray-600">Loading SignEX Training...</p>
              </div>
            </div>
          )}
          
          <iframe
            src="http://localhost:8000/templates/Training.html"
            title="SignEX iframe"
            className="w-full h-full border-0"
            onLoad={() => setIframeLoaded(true)}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-camera allow-microphone"
            allow="camera; microphone; autoplay"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default WireframeCard;
