'use client';

import { Signal } from '@/lib/signal-data';

interface SignalSelectorProps {
  signals: Signal[];
  selectedSignal: Signal;
  onSignalChange: (signal: Signal) => void;
}

export default function SignalSelector({ signals, selectedSignal, onSignalChange }: SignalSelectorProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <label htmlFor="signal-select" className="font-semibold text-gray-800 text-sm sm:text-base flex items-center">
          <span className="text-xl mr-2">📊</span>
          Signal:
        </label>
        <select
          id="signal-select"
          value={selectedSignal.id}
          onChange={(e) => {
            const signal = signals.find(s => s.id === e.target.value);
            if (signal) onSignalChange(signal);
          }}
          className="w-full sm:flex-1 px-3 sm:px-4 py-2 bg-white border-2 border-gray-200 rounded-lg font-medium text-gray-700 hover:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all cursor-pointer text-sm sm:text-base"
        >
          {signals.map((signal) => (
            <option key={signal.id} value={signal.id}>
              {signal.name}
            </option>
          ))}
        </select>
        <div className="text-xs sm:text-sm text-gray-600">
          <span className="font-medium">{selectedSignal.duration}s</span> @ {selectedSignal.sampleRate}Hz
        </div>
      </div>
      <p className="text-xs sm:text-sm text-gray-500 mt-2 italic">{selectedSignal.description}</p>
    </div>
  );
}