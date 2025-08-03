'use client';

import { Label } from '@/lib/signal-data';

interface LabelTimelineProps {
  labels: Label[];
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
  onDeleteLabel: (id: string) => void;
  selectedLabel: string | null;
  onLabelSelect: (id: string | null) => void;
}

export default function LabelTimeline({
  labels,
  duration,
  currentTime,
  onSeek,
  onDeleteLabel,
  selectedLabel,
  onLabelSelect
}: LabelTimelineProps) {
  const sortedLabels = [...labels].sort((a, b) => a.startTime - b.startTime);

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-400">Label Timeline</h3>
        <span className="text-xs text-gray-500">{labels.length} labels</span>
      </div>

      {/* Timeline visualization */}
      <div className="relative h-12 bg-gray-800 rounded-lg mb-4 overflow-hidden">
        {/* Current time indicator */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        />

        {/* Labels */}
        {sortedLabels.map((label) => {
          const left = (label.startTime / duration) * 100;
          const width = ((label.endTime - label.startTime) / duration) * 100;
          const isSelected = label.id === selectedLabel;

          return (
            <div
              key={label.id}
              className={`absolute top-1 bottom-1 rounded cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-white z-10' : 'hover:brightness-125'
              }`}
              style={{
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: label.color,
                opacity: isSelected ? 1 : 0.8
              }}
              onClick={() => {
                onLabelSelect(isSelected ? null : label.id);
                onSeek((label.startTime + label.endTime) / 2);
              }}
              title={`${label.category}: ${label.startTime.toFixed(2)}s - ${label.endTime.toFixed(2)}s`}
            />
          );
        })}
      </div>

      {/* Label list */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {sortedLabels.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-4">
            No labels yet. Play the signal and press label buttons.
          </p>
        ) : (
          sortedLabels.map((label) => {
            const isSelected = label.id === selectedLabel;
            return (
              <div
                key={label.id}
                className={`flex items-center justify-between p-2 rounded-lg transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-gray-800 ring-2 ring-blue-500' 
                    : 'bg-gray-800/50 hover:bg-gray-800'
                }`}
                onClick={() => onLabelSelect(isSelected ? null : label.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: label.color }}
                  />
                  <div>
                    <span className="font-medium text-sm text-white">{label.category}</span>
                    <span className="text-xs text-gray-400 ml-2">
                      {label.startTime.toFixed(2)}s - {label.endTime.toFixed(2)}s
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteLabel(label.id);
                  }}
                  className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}