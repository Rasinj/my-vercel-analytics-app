'use client';

import { useState } from 'react';
import DatasetSwitcher from '@/components/DatasetSwitcher';
import DataPlot from '@/components/DataPlot';
import DataTable from '@/components/DataTable';
import { datasets } from '@/lib/datasets';

export default function Home() {
  const [selectedDataset, setSelectedDataset] = useState(datasets[0]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Analytics Dashboard</h1>
          <p className="text-gray-600">Visualize and explore different datasets</p>
        </header>
        
        <DatasetSwitcher 
          datasets={datasets}
          selectedDataset={selectedDataset}
          onDatasetChange={setSelectedDataset}
        />

        <div className="space-y-8">
          <DataPlot data={selectedDataset.data} chartType="line" />
          <DataTable data={selectedDataset.data} />
        </div>
      </div>
    </div>
  );
}