'use client';

import { useState, useEffect, useRef } from 'react';
import SignalSelector from '@/components/SignalSelector';
import SimpleSignalViewer from '@/components/SimpleSignalViewer';
import PlaybackControls from '@/components/PlaybackControls';
import SimpleLabelButtons from '@/components/SimpleLabelButtons';
import { signals, Label, LabelCategory } from '@/lib/signal-data';

export default function Home() {
  const [selectedSignal, setSelectedSignal] = useState(signals[0]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const animationRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number | undefined>(undefined);

  // Playback logic
  useEffect(() => {
    if (isPlaying) {
      const animate = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        
        const deltaTime = (timestamp - lastTimeRef.current) / 1000; // Convert to seconds
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

  // Reset when signal changes
  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
    setLabels([]);
  }, [selectedSignal]);

  const handleLabelClick = (category: LabelCategory) => {
    // Find the end of the last label or use current time - 0.5s as start
    const sortedLabels = [...labels].sort((a, b) => a.startTime - b.startTime);
    const lastLabel = sortedLabels[sortedLabels.length - 1];
    
    const startTime = lastLabel ? lastLabel.endTime : Math.max(0, currentTime - 0.5);
    const endTime = Math.min(currentTime + 0.5, selectedSignal.duration);
    
    if (endTime > startTime) {
      const newLabel: Label = {
        id: Date.now().toString(),
        startTime,
        endTime,
        category: category.name,
        color: category.color,
        description: category.description
      };
      
      setLabels([...labels, newLabel]);
    }
  };

  const handleDeleteLabel = (id: string) => {
    setLabels(labels.filter(label => label.id !== id));
  };

  const handleExport = () => {
    const exportData = {
      signal: selectedSignal.name,
      labels: labels.map(({ id, ...label }) => label),
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-3 py-4">
        <header className="mb-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Signal Labeler</h1>
          <p className="text-sm text-gray-600">Play signal and press buttons to label</p>
        </header>
        
        <div className="space-y-4">
          <SignalSelector
            signals={signals}
            selectedSignal={selectedSignal}
            onSignalChange={setSelectedSignal}
          />
          
          <SimpleSignalViewer
            data={selectedSignal.data}
            labels={labels}
            currentTime={currentTime}
            height={200}
          />
          
          <PlaybackControls
            currentTime={currentTime}
            duration={selectedSignal.duration}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onSeek={setCurrentTime}
            onSpeedChange={setPlaybackSpeed}
            playbackSpeed={playbackSpeed}
          />
          
          <SimpleLabelButtons
            onLabelClick={handleLabelClick}
            disabled={isPlaying}
          />
          
          {/* Labels list */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Labels ({labels.length})
              </h3>
              <button
                onClick={handleExport}
                disabled={labels.length === 0}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  labels.length > 0
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Export JSON
              </button>
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {labels.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">
                  No labels yet. Play the signal and press label buttons.
                </p>
              )}
              {labels.map(label => (
                <div
                  key={label.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: label.color }}
                    />
                    <span className="font-medium text-sm">{label.category}</span>
                    <span className="text-xs text-gray-500">
                      {label.startTime.toFixed(2)}s - {label.endTime.toFixed(2)}s
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteLabel(label.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}