'use client';

import { LabelCategory, labelCategories } from '@/lib/signal-data';

interface SimpleLabelButtonsProps {
  onLabelClick: (category: LabelCategory) => void;
  disabled?: boolean;
}

export default function SimpleLabelButtons({ onLabelClick, disabled = false }: SimpleLabelButtonsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Quick Labels</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {labelCategories.map(category => (
          <button
            key={category.id}
            onClick={() => onLabelClick(category)}
            disabled={disabled}
            className={`p-4 rounded-lg border-2 font-medium text-sm transition-all ${
              disabled 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:scale-105 active:scale-95 cursor-pointer'
            }`}
            style={{
              borderColor: category.color,
              backgroundColor: category.color + '20',
              color: category.color
            }}
          >
            <div className="font-bold">{category.name}</div>
            <div className="text-xs opacity-75 mt-1">{category.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}