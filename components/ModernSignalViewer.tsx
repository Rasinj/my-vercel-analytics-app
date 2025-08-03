'use client';

import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { SignalPoint, Label } from '@/lib/signal-data';

interface ModernSignalViewerProps {
  data: SignalPoint[];
  labels: Label[];
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  selectedLabel: string | null;
  onLabelSelect: (id: string | null) => void;
}

export default function ModernSignalViewer({
  data,
  labels,
  currentTime,
  duration,
  onSeek,
  selectedLabel,
  onLabelSelect
}: ModernSignalViewerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 300 });
  const [hoveredPoint, setHoveredPoint] = useState<SignalPoint | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const { width } = svgRef.current.getBoundingClientRect();
        setDimensions({ width, height: 300 });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const innerWidth = dimensions.width - margin.left - margin.right;
    const innerHeight = dimensions.height - margin.top - margin.bottom;

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, duration])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.value) as [number, number])
      .nice()
      .range([innerHeight, 0]);

    // Main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Gradient definitions
    const defs = svg.append('defs');
    
    // Signal gradient
    const gradient = defs.append('linearGradient')
      .attr('id', 'signal-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#3b82f6')
      .attr('stop-opacity', 0.8);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#3b82f6')
      .attr('stop-opacity', 0.1);

    // Grid
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisBottom(xScale)
        .tickSize(innerHeight)
        .tickFormat(() => ''));

    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickFormat(() => ''));

    // Labels
    labels.forEach(label => {
      const x1 = xScale(label.startTime);
      const x2 = xScale(label.endTime);
      const isSelected = label.id === selectedLabel;

      const labelG = g.append('g')
        .attr('class', 'label-group')
        .style('cursor', 'pointer')
        .on('click', () => onLabelSelect(isSelected ? null : label.id));

      labelG.append('rect')
        .attr('x', x1)
        .attr('y', 0)
        .attr('width', x2 - x1)
        .attr('height', innerHeight)
        .attr('fill', label.color)
        .attr('opacity', isSelected ? 0.3 : 0.15)
        .attr('stroke', isSelected ? label.color : 'none')
        .attr('stroke-width', 2);

      if (isSelected) {
        labelG.append('text')
          .attr('x', (x1 + x2) / 2)
          .attr('y', 15)
          .attr('text-anchor', 'middle')
          .attr('fill', label.color)
          .attr('font-size', '12px')
          .attr('font-weight', 'bold')
          .text(label.category);
      }
    });

    // Area under curve
    const area = d3.area<SignalPoint>()
      .x(d => xScale(d.time))
      .y0(innerHeight)
      .y1(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'url(#signal-gradient)')
      .attr('d', area);

    // Signal line
    const line = d3.line<SignalPoint>()
      .x(d => xScale(d.time))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Current time indicator
    const currentX = xScale(currentTime);
    
    const timeGroup = g.append('g')
      .attr('class', 'time-indicator');

    timeGroup.append('line')
      .attr('x1', currentX)
      .attr('x2', currentX)
      .attr('y1', -10)
      .attr('y2', innerHeight + 10)
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 2)
      .attr('opacity', 0.8);

    // Find current value
    const currentIndex = Math.round((currentTime / duration) * (data.length - 1));
    const currentValue = data[currentIndex]?.value || 0;
    const currentY = yScale(currentValue);

    timeGroup.append('circle')
      .attr('cx', currentX)
      .attr('cy', currentY)
      .attr('r', 6)
      .attr('fill', '#ef4444')
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .attr('class', 'x-axis')
      .call(d3.axisBottom(xScale)
        .tickFormat(d => `${d}s`))
      .style('color', '#9ca3af');

    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale))
      .style('color', '#9ca3af');

    // Interactive overlay
    const overlay = g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .style('cursor', 'pointer');

    overlay.on('click', (event) => {
      const [x] = d3.pointer(event);
      const time = xScale.invert(x);
      onSeek(Math.max(0, Math.min(duration, time)));
    });

    overlay.on('mousemove', (event) => {
      const [x] = d3.pointer(event);
      const time = xScale.invert(x);
      const index = Math.round((time / duration) * (data.length - 1));
      setHoveredPoint(data[index] || null);
    });

    overlay.on('mouseleave', () => {
      setHoveredPoint(null);
    });

  }, [data, labels, currentTime, duration, dimensions, selectedLabel, onSeek, onLabelSelect]);

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 relative">
      <svg
        ref={svgRef}
        width="100%"
        height={300}
        className="select-none"
      />
      {hoveredPoint && (
        <div className="absolute top-2 right-2 bg-gray-800 px-3 py-1 rounded-lg text-xs">
          <span className="text-gray-400">Value:</span> <span className="text-white font-mono">{hoveredPoint.value.toFixed(3)}</span>
        </div>
      )}
    </div>
  );
}