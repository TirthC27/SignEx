'use client';

import { useState } from 'react';
import { Settings, Type, Palette, Volume2, Save } from 'lucide-react';
import { Button } from './ui/button';

interface CaptionSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    fontSize: number;
    fontFamily: string;
    textColor: string;
    backgroundColor: string;
    backgroundOpacity: number;
    showSpeakerNames: boolean;
    showTimestamps: boolean;
    autoScroll: boolean;
    maxLines: number;
  };
  onSettingsChange: (settings: any) => void;
}

const CaptionSettings = ({ isOpen, onClose, settings, onSettingsChange }: CaptionSettingsProps) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const fontFamilyOptions = [
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Helvetica', value: 'Helvetica, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Times New Roman', value: 'Times New Roman, serif' },
    { label: 'Courier New', value: 'Courier New, monospace' },
    { label: 'Open Sans', value: 'Open Sans, sans-serif' }
  ];

  const textColorOptions = [
    { label: 'White', value: '#ffffff' },
    { label: 'Black', value: '#000000' },
    { label: 'Yellow', value: '#ffff00' },
    { label: 'Green', value: '#00ff00' },
    { label: 'Blue', value: '#0080ff' },
    { label: 'Red', value: '#ff0000' }
  ];

  const backgroundColorOptions = [
    { label: 'Black', value: '#000000' },
    { label: 'Dark Gray', value: '#333333' },
    { label: 'Navy', value: '#000080' },
    { label: 'Transparent', value: 'transparent' }
  ];

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const updateSetting = (key: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Caption Settings</h2>
                <p className="text-gray-600 text-sm">Customize your live caption experience</p>
              </div>
            </div>
            <Button onClick={onClose} variant="outline" className="p-2">
              ×
            </Button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="p-6 space-y-6">
          {/* Text Appearance */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Text Appearance</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size: {localSettings.fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="32"
                  value={localSettings.fontSize}
                  onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                <select
                  value={localSettings.fontFamily}
                  onChange={(e) => updateSetting('fontFamily', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {fontFamilyOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Text Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                <div className="flex gap-2">
                  {textColorOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => updateSetting('textColor', option.value)}
                      className={`w-8 h-8 rounded-lg border-2 ${
                        localSettings.textColor === option.value 
                          ? 'border-indigo-500 ring-2 ring-indigo-200' 
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: option.value }}
                      title={option.label}
                    />
                  ))}
                </div>
              </div>

              {/* Max Lines */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Lines: {localSettings.maxLines}
                </label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={localSettings.maxLines}
                  onChange={(e) => updateSetting('maxLines', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Background */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Background</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Background Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                <div className="flex gap-2">
                  {backgroundColorOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => updateSetting('backgroundColor', option.value)}
                      className={`w-8 h-8 rounded-lg border-2 ${
                        localSettings.backgroundColor === option.value 
                          ? 'border-indigo-500 ring-2 ring-indigo-200' 
                          : 'border-gray-300'
                      }`}
                      style={{ 
                        backgroundColor: option.value === 'transparent' ? '#ffffff' : option.value,
                        backgroundImage: option.value === 'transparent' ? 
                          'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
                        backgroundSize: option.value === 'transparent' ? '8px 8px' : 'auto',
                        backgroundPosition: option.value === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0px' : 'auto'
                      }}
                      title={option.label}
                    />
                  ))}
                </div>
              </div>

              {/* Background Opacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Opacity: {Math.round(localSettings.backgroundOpacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={localSettings.backgroundOpacity}
                  onChange={(e) => updateSetting('backgroundOpacity', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Display Options */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Volume2 className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Display Options</h3>
            </div>

            <div className="space-y-3">
              {/* Show Speaker Names */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Show speaker names</label>
                <button
                  onClick={() => updateSetting('showSpeakerNames', !localSettings.showSpeakerNames)}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    localSettings.showSpeakerNames ? 'bg-indigo-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    localSettings.showSpeakerNames ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Show Timestamps */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Show timestamps</label>
                <button
                  onClick={() => updateSetting('showTimestamps', !localSettings.showTimestamps)}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    localSettings.showTimestamps ? 'bg-indigo-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    localSettings.showTimestamps ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Auto Scroll */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Auto-scroll to latest</label>
                <button
                  onClick={() => updateSetting('autoScroll', !localSettings.autoScroll)}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    localSettings.autoScroll ? 'bg-indigo-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    localSettings.autoScroll ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
            <div 
              className="p-4 rounded-lg border-2 border-dashed border-gray-300"
              style={{
                backgroundColor: localSettings.backgroundColor === 'transparent' 
                  ? 'rgba(0,0,0,0.8)' 
                  : `${localSettings.backgroundColor}${Math.round(localSettings.backgroundOpacity * 255).toString(16).padStart(2, '0')}`,
                fontFamily: localSettings.fontFamily,
                fontSize: `${localSettings.fontSize}px`,
                color: localSettings.textColor
              }}
            >
              {localSettings.showSpeakerNames && (
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full mr-2">
                  Speaker
                </span>
              )}
              <span>This is how your captions will look!</span>
              {localSettings.showTimestamps && (
                <span className="text-xs opacity-60 ml-2">
                  {new Date().toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
          <div className="flex gap-3 justify-end">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSave} className="btn-gradient">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptionSettings;
