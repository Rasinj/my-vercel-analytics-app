'use client';

import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { SignalPoint, Label } from '@/lib/signal-data';

interface SimpleSignalViewerProps {
  data: SignalPoint[];
  labels: Label[];
  currentTime: number;
  height?: number;
}

export default function SimpleSignalViewer({ data, labels, currentTime, height = 200 }: SimpleSignalViewerProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const margin = { top: 10, right: 10, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, data[data.length - 1]?.time || 1])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.value) as [number, number])
      .nice()
      .range([innerHeight, 0]);

    // Main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Background
    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', '#f9fafb');

    // Labels
    labels.forEach(label => {
      const x = xScale(label.startTime);
      const width = xScale(label.endTime) - x;

      g.append('rect')
        .attr('x', x)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', innerHeight)
        .attr('fill', label.color)
        .attr('opacity', 0.3);
    });

    // Signal line
    const line = d3.line<SignalPoint>()
      .x(d => xScale(d.time))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#6366f1')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Current position indicator
    const currentX = xScale(currentTime);
    
    g.append('line')
      .attr('x1', currentX)
      .attr('x2', currentX)
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 2);

    // Position marker
    g.append('circle')
      .attr('cx', currentX)
      .attr('cy', innerHeight / 2)
      .attr('r', 6)
      .attr('fill', '#ef4444');

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d => `${d}s`).ticks(5));

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5));

  }, [data, labels, currentTime, height]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        className="select-none"
      />
    </div>
  );
}