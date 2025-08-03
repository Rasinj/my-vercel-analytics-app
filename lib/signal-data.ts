export interface SignalPoint {
  time: number;
  value: number;
}

export interface Label {
  id: string;
  startTime: number;
  endTime: number;
  category: string;
  color: string;
  description?: string;
}

export interface Signal {
  id: string;
  name: string;
  description: string;
  data: SignalPoint[];
  sampleRate: number;
  duration: number;
}

export interface LabelCategory {
  id: string;
  name: string;
  color: string;
  description: string;
}

export const labelCategories: LabelCategory[] = [
  { id: 'normal', name: 'Normal', color: '#10b981', description: 'Normal signal behavior' },
  { id: 'anomaly', name: 'Anomaly', color: '#ef4444', description: 'Abnormal pattern detected' },
  { id: 'transition', name: 'Transition', color: '#f59e0b', description: 'State transition period' },
  { id: 'noise', name: 'Noise', color: '#6b7280', description: 'Noisy or unclear signal' },
  { id: 'peak', name: 'Peak', color: '#8b5cf6', description: 'Peak or spike in signal' },
  { id: 'baseline', name: 'Baseline', color: '#3b82f6', description: 'Baseline reference period' },
];

// Generate sample signal data
function generateSignalData(duration: number, sampleRate: number, type: string): SignalPoint[] {
  const data: SignalPoint[] = [];
  const samples = duration * sampleRate;
  
  for (let i = 0; i < samples; i++) {
    const time = i / sampleRate;
    let value = 0;
    
    if (type === 'ecg') {
      // Simulate ECG-like signal
      const heartRate = 1.2; // Hz
      value = Math.sin(2 * Math.PI * heartRate * time) * 0.3;
      if (i % Math.floor(sampleRate / heartRate) < 5) {
        value += Math.exp(-(i % Math.floor(sampleRate / heartRate))) * 2;
      }
      value += (Math.random() - 0.5) * 0.1;
    } else if (type === 'sine') {
      // Multiple sine waves with noise
      value = Math.sin(2 * Math.PI * 0.5 * time) * 2 +
              Math.sin(2 * Math.PI * 1.5 * time) * 0.5 +
              Math.sin(2 * Math.PI * 4 * time) * 0.2 +
              (Math.random() - 0.5) * 0.3;
    } else if (type === 'random') {
      // Random walk signal
      const prev = data[i - 1]?.value || 0;
      value = prev + (Math.random() - 0.5) * 0.5;
      value = Math.max(-3, Math.min(3, value));
    }
    
    data.push({ time, value });
  }
  
  return data;
}

export const signals: Signal[] = [
  {
    id: 'ecg-signal',
    name: 'ECG Signal',
    description: 'Simulated ECG signal with regular heartbeat patterns',
    data: generateSignalData(10, 100, 'ecg'),
    sampleRate: 100,
    duration: 10
  },
  {
    id: 'sensor-data',
    name: 'Sensor Data',
    description: 'Multi-frequency sensor readings with noise',
    data: generateSignalData(10, 100, 'sine'),
    sampleRate: 100,
    duration: 10
  },
  {
    id: 'random-walk',
    name: 'Random Walk',
    description: 'Random walk signal for testing',
    data: generateSignalData(10, 100, 'random'),
    sampleRate: 100,
    duration: 10
  }
];