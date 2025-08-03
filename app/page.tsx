'use client';

import { useState } from 'react';
import SignalSelector from '@/components/SignalSelector';
import SignalVisualizerMobile from '@/components/SignalVisualizerMobile';
import LabelPanel from '@/components/LabelPanel';
import { signals, Label } from '@/lib/signal-data';

export default function Home() {
  const [selectedSignal, setSelectedSignal] = useState(signals[0]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<{ startTime: number; endTime: number } | null>(null);
  
  const handleSegmentSelect = (startTime: number, endTime: number) => {
    setSelectedSegment({ startTime, endTime });
  };
  
  const handleAddLabel = (labelData: Omit<Label, 'id'>) => {
    const newLabel: Label = {
      ...labelData,
      id: Date.now().toString(),
    };
    setLabels([...labels, newLabel]);
    setSelectedSegment(null);
  };
  
  const handleDeleteLabel = (id: string) => {
    setLabels(labels.filter(label => label.id !== id));
  };
  
  const handleEditLabel = (id: string, updates: Partial<Label>) => {
    setLabels(labels.map(label => 
      label.id === id ? { ...label, ...updates } : label
    ));
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <header className="mb-4 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Signal Labeling Tool
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-4">Click and drag on the signal to select segments for labeling</p>
        </header>
        
        <div className="space-y-6">
          <SignalSelector
            signals={signals}
            selectedSignal={selectedSignal}
            onSignalChange={setSelectedSignal}
          />
          
          <SignalVisualizerMobile
            data={selectedSignal.data}
            labels={labels}
            onSegmentSelect={handleSegmentSelect}
            height={typeof window !== 'undefined' && window.innerWidth < 640 ? 250 : 400}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <span className="text-2xl">📈</span>
                  Signal Statistics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                    <p className="text-xs sm:text-sm text-gray-500">Total Labels</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{labels.length}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                    <p className="text-xs sm:text-sm text-gray-500">Duration</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{selectedSignal.duration}s</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                    <p className="text-xs sm:text-sm text-gray-500">Sample Rate</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{selectedSignal.sampleRate}Hz</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                    <p className="text-xs sm:text-sm text-gray-500">Samples</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{selectedSignal.data.length}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleExport}
                  disabled={labels.length === 0}
                  className={`mt-4 w-full py-2 px-4 rounded-lg font-medium transition-all text-sm sm:text-base ${
                    labels.length > 0
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Export Labels ({labels.length})
                </button>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <LabelPanel
                labels={labels}
                selectedSegment={selectedSegment}
                onAddLabel={handleAddLabel}
                onDeleteLabel={handleDeleteLabel}
                onEditLabel={handleEditLabel}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}