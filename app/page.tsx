'use client';

import { useState } from 'react';
import DatasetSwitcher from '@/components/DatasetSwitcher';
import DataPlot from '@/components/DataPlot';
import DataTable from '@/components/DataTable';
import { datasets } from '@/lib/datasets';

export default function Home() {
  const [selectedDataset, setSelectedDataset] = useState(datasets[0]);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Data Analytics Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Visualize and explore different datasets with interactive charts</p>
        </header>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
          <DatasetSwitcher 
            datasets={datasets}
            selectedDataset={selectedDataset}
            onDatasetChange={setSelectedDataset}
          />
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setChartType('line')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                chartType === 'line' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Line Chart
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                chartType === 'bar' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Bar Chart
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                chartType === 'area' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Area Chart
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <DataPlot data={selectedDataset.data} chartType={chartType} />
          <DataTable data={selectedDataset.data} />
        </div>
      </div>
    </div>
  );
}