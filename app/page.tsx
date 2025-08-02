import DataDisplay from '@/components/DataDisplay';
import InteractiveChart from '@/components/InteractiveChart';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor your business metrics and performance</p>
        </header>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Metrics</h2>
            <DataDisplay />
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Trends</h2>
            <InteractiveChart />
          </section>
        </div>
      </div>
    </div>
  );
}