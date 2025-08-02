'use client';

import { Dataset } from '@/lib/datasets';

interface DatasetSwitcherProps {
  datasets: Dataset[];
  selectedDataset: Dataset;
  onDatasetChange: (dataset: Dataset) => void;
}

export default function DatasetSwitcher({ datasets, selectedDataset, onDatasetChange }: DatasetSwitcherProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <label htmlFor="dataset-select" className="font-medium text-gray-700">
        Select Dataset:
      </label>
      <select
        id="dataset-select"
        value={selectedDataset.id}
        onChange={(e) => {
          const dataset = datasets.find(d => d.id === e.target.value);
          if (dataset) onDatasetChange(dataset);
        }}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {datasets.map((dataset) => (
          <option key={dataset.id} value={dataset.id}>
            {dataset.name}
          </option>
        ))}
      </select>
      <p className="text-sm text-gray-600 italic">{selectedDataset.description}</p>
    </div>
  );
}