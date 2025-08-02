export interface DataPoint {
  name: string;
  value: number;
  category?: string;
  date?: string;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  data: DataPoint[];
}

export const datasets: Dataset[] = [
  {
    id: 'sales',
    name: 'Sales Performance',
    description: 'Monthly sales data for 2024',
    data: [
      { name: 'Jan', value: 4000, category: 'Q1', date: '2024-01' },
      { name: 'Feb', value: 3000, category: 'Q1', date: '2024-02' },
      { name: 'Mar', value: 5000, category: 'Q1', date: '2024-03' },
      { name: 'Apr', value: 4500, category: 'Q2', date: '2024-04' },
      { name: 'May', value: 6000, category: 'Q2', date: '2024-05' },
      { name: 'Jun', value: 5500, category: 'Q2', date: '2024-06' },
      { name: 'Jul', value: 7000, category: 'Q3', date: '2024-07' },
      { name: 'Aug', value: 6500, category: 'Q3', date: '2024-08' },
      { name: 'Sep', value: 8000, category: 'Q3', date: '2024-09' },
    ]
  },
  {
    id: 'traffic',
    name: 'Website Traffic',
    description: 'Daily visitor statistics',
    data: [
      { name: 'Mon', value: 2400, category: 'Weekday', date: '2024-03-11' },
      { name: 'Tue', value: 2210, category: 'Weekday', date: '2024-03-12' },
      { name: 'Wed', value: 2290, category: 'Weekday', date: '2024-03-13' },
      { name: 'Thu', value: 2000, category: 'Weekday', date: '2024-03-14' },
      { name: 'Fri', value: 2181, category: 'Weekday', date: '2024-03-15' },
      { name: 'Sat', value: 2500, category: 'Weekend', date: '2024-03-16' },
      { name: 'Sun', value: 2100, category: 'Weekend', date: '2024-03-17' },
    ]
  },
  {
    id: 'products',
    name: 'Product Categories',
    description: 'Revenue by product category',
    data: [
      { name: 'Electronics', value: 35000, category: 'Tech' },
      { name: 'Clothing', value: 28000, category: 'Fashion' },
      { name: 'Home & Garden', value: 22000, category: 'Living' },
      { name: 'Books', value: 15000, category: 'Media' },
      { name: 'Sports', value: 18000, category: 'Recreation' },
      { name: 'Toys', value: 12000, category: 'Recreation' },
      { name: 'Food', value: 25000, category: 'Consumables' },
    ]
  }
];