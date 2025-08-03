'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ModernSignalViewer from '@/components/ModernSignalViewer';
import ModernPlaybackControls from '@/components/ModernPlaybackControls';
import QuickLabelBar from '@/components/QuickLabelBar';
import LabelTimeline from '@/components/LabelTimeline';
import { signals, Label, LabelCategory, labelCategories } from '@/lib/signal-data';

export default function Home() {
  const [selectedSignal, setSelectedSignal] = useState(signals[0]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number | undefined>(undefined);

  // Playback logic
  useEffect(() => {
    if (isPlaying) {
      const animate = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        
        const deltaTime = (timestamp - lastTimeRef.current) / 1000;
        const newTime = currentTime + (deltaTime * playbackSpeed);
        
        if (newTime >= selectedSignal.duration) {
          setCurrentTime(selectedSignal.duration);
          setIsPlaying(false);
        } else {
          setCurrentTime(newTime);
          lastTimeRef.current = timestamp;
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    } else {
      lastTimeRef.current = undefined;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentTime, playbackSpeed, selectedSignal.duration]);

  const handleQuickLabel = useCallback((category: LabelCategory) => {
    setIsPlaying(false);
    
    const segmentDuration = 0.5;
    const startTime = Math.max(0, currentTime - segmentDuration / 2);
    const endTime = Math.min(selectedSignal.duration, currentTime + segmentDuration / 2);
    
    const newLabel: Label = {
      id: Date.now().toString(),
      startTime,
      endTime,
      category: category.name,
      color: category.color,
      description: category.description
    };
    
    setLabels(prev => [...prev, newLabel]);
    
    // Visual feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, [currentTime, selectedSignal.duration]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch(e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case 'arrowleft':
          setCurrentTime(prev => Math.max(0, prev - 1));
          break;
        case 'arrowright':
          setCurrentTime(prev => Math.min(selectedSignal.duration, prev + 1));
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
          const index = parseInt(e.key) - 1;
          if (labelCategories[index]) {
            handleQuickLabel(labelCategories[index]);
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedSignal.duration, handleQuickLabel]);

  const handleDeleteLabel = (id: string) => {
    setLabels(labels.filter(label => label.id !== id));
    setSelectedLabel(null);
  };

  const handleExport = () => {
    const exportData = {
      signal: selectedSignal.name,
      sampleRate: selectedSignal.sampleRate,
      duration: selectedSignal.duration,
      labels: labels.map(({ id, ...label }) => ({
        ...label,
        startSample: Math.round(label.startTime * selectedSignal.sampleRate),
        endSample: Math.round(label.endTime * selectedSignal.sampleRate)
      })),
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedSignal.id}-labels-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Signal Labeler Pro
              </h1>
              <p className="text-gray-400 text-sm mt-1">Press number keys 1-6 for quick labels</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedSignal.id}
                onChange={(e) => {
                  const signal = signals.find(s => s.id === e.target.value);
                  if (signal) {
                    setSelectedSignal(signal);
                    setCurrentTime(0);
                    setIsPlaying(false);
                    setLabels([]);
                  }
                }}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {signals.map(signal => (
                  <option key={signal.id} value={signal.id}>{signal.name}</option>
                ))}
              </select>
              <button
                onClick={handleExport}
                disabled={labels.length === 0}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  labels.length > 0
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                Export ({labels.length})
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="space-y-4">
          {/* Signal Viewer */}
          <ModernSignalViewer
            data={selectedSignal.data}
            labels={labels}
            currentTime={currentTime}
            duration={selectedSignal.duration}
            onSeek={setCurrentTime}
            selectedLabel={selectedLabel}
            onLabelSelect={setSelectedLabel}
          />

          {/* Timeline */}
          <LabelTimeline
            labels={labels}
            duration={selectedSignal.duration}
            currentTime={currentTime}
            onSeek={setCurrentTime}
            onDeleteLabel={handleDeleteLabel}
            selectedLabel={selectedLabel}
            onLabelSelect={setSelectedLabel}
          />

          {/* Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <ModernPlaybackControls
                currentTime={currentTime}
                duration={selectedSignal.duration}
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onSeek={setCurrentTime}
                onSpeedChange={setPlaybackSpeed}
                playbackSpeed={playbackSpeed}
              />
            </div>
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Signal Info</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sample Rate:</span>
                    <span>{selectedSignal.sampleRate} Hz</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duration:</span>
                    <span>{selectedSignal.duration}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Samples:</span>
                    <span>{selectedSignal.data.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Label Bar */}
          <QuickLabelBar
            onLabelClick={handleQuickLabel}
            currentTime={currentTime}
          />
        </div>
      </div>
    </div>
  );
}