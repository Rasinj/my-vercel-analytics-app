'use client';

import { useState } from 'react';
import { Label, LabelCategory, labelCategories } from '@/lib/signal-data';

interface LabelPanelProps {
  labels: Label[];
  selectedSegment: { startTime: number; endTime: number } | null;
  onAddLabel: (label: Omit<Label, 'id'>) => void;
  onDeleteLabel: (id: string) => void;
  onEditLabel: (id: string, updates: Partial<Label>) => void;
}

export default function LabelPanel({ labels, selectedSegment, onAddLabel, onDeleteLabel, onEditLabel }: LabelPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<LabelCategory>(labelCategories[0]);
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const handleAddLabel = () => {
    if (!selectedSegment) return;
    
    onAddLabel({
      startTime: selectedSegment.startTime,
      endTime: selectedSegment.endTime,
      category: selectedCategory.name,
      color: selectedCategory.color,
      description: description || undefined,
    });
    
    setDescription('');
  };
  
  const formatTime = (time: number) => {
    return `${time.toFixed(2)}s`;
  };
  
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">🏷️</span>
          Label Manager
        </h3>
        
        {selectedSegment && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-blue-800 mb-2">
              Selected Segment: {formatTime(selectedSegment.startTime)} - {formatTime(selectedSegment.endTime)}
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {labelCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category)}
                      className={`p-2 rounded-lg border-2 transition-all text-sm font-medium ${
                        selectedCategory.id === category.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a description..."
                />
              </div>
              
              <button
                onClick={handleAddLabel}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-all"
              >
                Add Label
              </button>
            </div>
          </div>
        )}
        
        {!selectedSegment && (
          <p className="text-gray-500 text-sm italic">
            Click and drag on the signal to select a segment for labeling
          </p>
        )}
      </div>
      
      <div>
        <h4 className="font-semibold text-gray-800 mb-3">Existing Labels</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {labels.length === 0 && (
            <p className="text-gray-400 text-sm">No labels yet</p>
          )}
          {labels.map(label => (
            <div
              key={label.id}
              className="bg-gray-50 rounded-lg p-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: label.color }}
                />
                <div>
                  <p className="font-medium text-sm">{label.category}</p>
                  <p className="text-xs text-gray-500">
                    {formatTime(label.startTime)} - {formatTime(label.endTime)}
                  </p>
                  {label.description && (
                    <p className="text-xs text-gray-600 mt-1">{label.description}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => onDeleteLabel(label.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Delete label"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}