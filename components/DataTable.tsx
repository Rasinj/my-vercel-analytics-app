'use client';

import { DataPoint } from '@/lib/datasets';

interface DataTableProps {
  data: DataPoint[];
}

export default function DataTable({ data }: DataTableProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">📋</span>
        <h3 className="text-2xl font-bold text-gray-800">Raw Data Table</h3>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                📌 Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                💰 Value
              </th>
              {data[0]?.category && (
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  🏷️ Category
                </th>
              )}
              {data[0]?.date && (
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  📅 Date
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.map((item, index) => (
              <tr 
                key={index} 
                className={`
                  hover:bg-blue-50 transition-colors cursor-pointer
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                `}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                  {item.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {item.value.toLocaleString()}
                  </span>
                </td>
                {item.category && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                  </td>
                )}
                {item.date && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                    {item.date}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}