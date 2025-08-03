'use client';

import { useRef, useState, useEffect, MouseEvent } from 'react';
import { SignalPoint, Label } from '@/lib/signal-data';

interface SignalVisualizerProps {
  data: SignalPoint[];
  labels: Label[];
  onSegmentSelect: (startTime: number, endTime: number) => void;
  height?: number;
}

export default function SignalVisualizer({ data, labels, onSegmentSelect, height = 300 }: SignalVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);
  const [hoveredTime, setHoveredTime] = useState<number | null>(null);
  
  const timeToX = (time: number, width: number) => {
    const duration = data[data.length - 1]?.time || 1;
    return (time / duration) * width;
  };
  
  const xToTime = (x: number, width: number) => {
    const duration = data[data.length - 1]?.time || 1;
    return (x / width) * duration;
  };
  
  const valueToY = (value: number, height: number, minValue: number, maxValue: number) => {
    const range = maxValue - minValue;
    return height - ((value - minValue) / range) * height * 0.8 - height * 0.1;
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Calculate min/max values
    const values = data.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    
    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      
      const x = (width / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw labels
    labels.forEach(label => {
      const x1 = timeToX(label.startTime, width);
      const x2 = timeToX(label.endTime, width);
      
      ctx.fillStyle = label.color + '20';
      ctx.fillRect(x1, 0, x2 - x1, height);
      
      ctx.strokeStyle = label.color;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(x1, 0);
      ctx.lineTo(x1, height);
      ctx.moveTo(x2, 0);
      ctx.lineTo(x2, height);
      ctx.stroke();
      ctx.setLineDash([]);
    });
    
    // Draw selection area
    if (isDragging && dragStart !== null && dragEnd !== null) {
      const x1 = timeToX(Math.min(dragStart, dragEnd), width);
      const x2 = timeToX(Math.max(dragStart, dragEnd), width);
      
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.fillRect(x1, 0, x2 - x1, height);
      
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, 0);
      ctx.lineTo(x1, height);
      ctx.moveTo(x2, 0);
      ctx.lineTo(x2, height);
      ctx.stroke();
    }
    
    // Draw signal
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((point, i) => {
      const x = timeToX(point.time, width);
      const y = valueToY(point.value, height, minValue, maxValue);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw hover line
    if (hoveredTime !== null) {
      const x = timeToX(hoveredTime, width);
      
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw time label
      ctx.fillStyle = '#4b5563';
      ctx.font = '12px sans-serif';
      ctx.fillText(`${hoveredTime.toFixed(2)}s`, x + 5, 15);
    }
    
  }, [data, labels, isDragging, dragStart, dragEnd, hoveredTime]);
  
  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const time = xToTime(x, rect.width);
    
    setIsDragging(true);
    setDragStart(time);
    setDragEnd(time);
  };
  
  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const time = xToTime(x, rect.width);
    
    setHoveredTime(time);
    
    if (isDragging) {
      setDragEnd(time);
    }
  };
  
  const handleMouseUp = () => {
    if (isDragging && dragStart !== null && dragEnd !== null) {
      const start = Math.min(dragStart, dragEnd);
      const end = Math.max(dragStart, dragEnd);
      
      if (end - start > 0.1) { // Minimum segment duration
        onSegmentSelect(start, end);
      }
    }
    
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  };
  
  const handleMouseLeave = () => {
    setHoveredTime(null);
    if (isDragging) {
      handleMouseUp();
    }
  };
  
  return (
    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <canvas
        ref={canvasRef}
        className="w-full cursor-crosshair"
        style={{ height: `${height}px` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
      {isDragging && dragStart !== null && dragEnd !== null && (
        <div className="absolute bottom-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
          {Math.abs(dragEnd - dragStart).toFixed(2)}s selected
        </div>
      )}
    </div>
  );
}