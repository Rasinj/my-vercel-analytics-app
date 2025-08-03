'use client';

import { LabelCategory, labelCategories } from '@/lib/signal-data';

interface QuickLabelBarProps {
  onLabelClick: (category: LabelCategory) => void;
  currentTime: number;
}

export default function QuickLabelBar({ onLabelClick, currentTime }: QuickLabelBarProps) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-400">Quick Labels</h3>
        <span className="text-xs text-gray-500">Press 1-6 or click</span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {labelCategories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => onLabelClick(category)}
            className="relative group transform transition-all hover:scale-105 active:scale-95"
          >
            <div
              className="p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-lg"
              style={{
                borderColor: category.color,
                backgroundColor: category.color + '10',
              }}
            >
              {/* Keyboard shortcut */}
              <div className="absolute top-2 right-2 text-xs font-bold opacity-50 group-hover:opacity-100 transition-opacity"
                style={{ color: category.color }}>
                {index + 1}
              </div>
              
              {/* Category name */}
              <div className="font-bold text-sm mb-1" style={{ color: category.color }}>
                {category.name}
              </div>
              
              {/* Description */}
              <div className="text-xs text-gray-400 leading-tight">
                {category.description}
              </div>
              
              {/* Pulse animation on hover */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity"
                style={{ backgroundColor: category.color }}>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-3 text-center text-xs text-gray-500">
        Labels will be placed at <span className="font-mono text-gray-400">{currentTime.toFixed(2)}s</span>
      </div>
    </div>
  );
}