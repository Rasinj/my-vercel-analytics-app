import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, BarChart3 } from 'lucide-react';

const stats = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Active Users',
    value: '2,338',
    change: '+180',
    trend: 'up',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Sales',
    value: '1,234',
    change: '-5.4%',
    trend: 'down',
    icon: ShoppingCart,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  {
    title: 'Performance',
    value: '89.5%',
    change: '+12.3%',
    trend: 'up',
    icon: BarChart3,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
];

export default function DataDisplay() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
        
        return (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                <TrendIcon className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">{stat.change}</span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}