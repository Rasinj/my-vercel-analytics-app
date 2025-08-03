'use client';

import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { SignalPoint, Label } from '@/lib/signal-data';

interface SignalVisualizerProps {
  data: SignalPoint[];
  labels: Label[];
  onSegmentSelect: (startTime: number, endTime: number) => void;
  height?: number;
}

export default function SignalVisualizerD3({ data, labels, onSegmentSelect, height = 300 }: SignalVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height });
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const { width } = svgRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [height]);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const innerWidth = dimensions.width - margin.left - margin.right;
    const innerHeight = dimensions.height - margin.top - margin.bottom;

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

    // Grid
    const xGrid = d3.axisBottom(xScale)
      .tickSize(innerHeight)
      .tickFormat(() => '');

    const yGrid = d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickFormat(() => '');

    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(xGrid);

    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(yGrid);

    // Labels background
    labels.forEach(label => {
      const x1 = xScale(label.startTime);
      const x2 = xScale(label.endTime);

      g.append('rect')
        .attr('x', x1)
        .attr('y', 0)
        .attr('width', x2 - x1)
        .attr('height', innerHeight)
        .attr('fill', label.color)
        .attr('opacity', 0.2);

      // Label boundaries
      [x1, x2].forEach(x => {
        g.append('line')
          .attr('x1', x)
          .attr('y1', 0)
          .attr('x2', x)
          .attr('y2', innerHeight)
          .attr('stroke', label.color)
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '5,3');
      });
    });

    // Line generator
    const line = d3.line<SignalPoint>()
      .x(d => xScale(d.time))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Signal line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#6366f1')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d => `${d}s`));

    g.append('g')
      .call(d3.axisLeft(yScale));

    // Brush for selection
    const brush = d3.brushX()
      .extent([[0, 0], [innerWidth, innerHeight]])
      .on('start brush', (event) => {
        if (!event.selection) return;
        const [x1, x2] = event.selection as [number, number];
        const start = xScale.invert(x1);
        const end = xScale.invert(x2);
        setSelection({ start, end });
      })
      .on('end', (event) => {
        if (!event.selection) {
          setSelection(null);
          return;
        }
        const [x1, x2] = event.selection as [number, number];
        const start = xScale.invert(x1);
        const end = xScale.invert(x2);
        
        if (end - start > 0.1) {
          onSegmentSelect(start, end);
        }
        
        // Clear brush
        d3.select(event.target).call(brush.move, null);
        setSelection(null);
      });

    // Brush layer
    const brushG = g.append('g')
      .attr('class', 'brush')
      .call(brush);

    // Style brush selection
    brushG.selectAll('.selection')
      .style('fill', '#3b82f6')
      .style('opacity', 0.2);

    // Hover line and tooltip
    const hoverLine = g.append('line')
      .attr('class', 'hover-line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .style('stroke', '#9ca3af')
      .style('stroke-width', 1)
      .style('stroke-dasharray', '5,5')
      .style('opacity', 0);

    const tooltip = g.append('text')
      .attr('class', 'tooltip')
      .style('font-size', '12px')
      .style('fill', '#4b5563')
      .style('opacity', 0);

    // Overlay for mouse/touch events
    const overlay = g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .style('fill', 'none')
      .style('pointer-events', 'all');

    // Mouse/touch handling
    const handlePointerMove = (event: any) => {
      const [x] = d3.pointer(event);
      const time = xScale.invert(x);
      
      hoverLine
        .attr('x1', x)
        .attr('x2', x)
        .style('opacity', 1);
      
      tooltip
        .attr('x', x + 5)
        .attr('y', 15)
        .text(`${time.toFixed(2)}s`)
        .style('opacity', 1);
    };

    const handlePointerLeave = () => {
      hoverLine.style('opacity', 0);
      tooltip.style('opacity', 0);
    };

    overlay
      .on('mousemove', handlePointerMove)
      .on('touchmove', (event) => {
        event.preventDefault();
        handlePointerMove(event);
      })
      .on('mouseleave', handlePointerLeave)
      .on('touchend', handlePointerLeave);

  }, [data, labels, dimensions, onSegmentSelect]);

  return (
    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4">
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        className="cursor-crosshair touch-none"
      />
      {selection && (
        <div className="absolute bottom-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md text-xs sm:text-sm">
          {Math.abs(selection.end - selection.start).toFixed(2)}s selected
        </div>
      )}
    </div>
  );
}