'use client';

import { Dataset } from '@/lib/datasets';

interface DatasetSwitcherProps {
  datasets: Dataset[];
  selectedDataset: Dataset;
  onDatasetChange: (dataset: Dataset) => void;
}

export default function DatasetSwitcher({ datasets, selectedDataset, onDatasetChange }: DatasetSwitcherProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-3">
        <label htmlFor="dataset-select" className="font-semibold text-gray-800 text-lg">
          📊 Dataset:
        </label>
        <select
          id="dataset-select"
          value={selectedDataset.id}
          onChange={(e) => {
            const dataset = datasets.find(d => d.id === e.target.value);
            if (dataset) onDatasetChange(dataset);
          }}
          className="px-5 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all cursor-pointer"
        >
          {datasets.map((dataset) => (
            <option key={dataset.id} value={dataset.id}>
              {dataset.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-2xl">💡</span>
        <p className="text-sm text-gray-600 font-medium">{selectedDataset.description}</p>
      </div>
    </div>
  );
}