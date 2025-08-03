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

export default function SignalVisualizerMobile({ data, labels, onSegmentSelect, height = 300 }: SignalVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; time: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ x: number; time: number } | null>(null);

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

    // Selection rectangle
    const selectionRect = g.append('rect')
      .attr('class', 'selection')
      .attr('fill', '#3b82f6')
      .attr('opacity', 0.2)
      .attr('visibility', 'hidden');

    // Selection lines
    const startLine = g.append('line')
      .attr('class', 'selection-line')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2)
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('visibility', 'hidden');

    const endLine = g.append('line')
      .attr('class', 'selection-line')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2)
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('visibility', 'hidden');

    // Update selection visualization
    if (isDragging && dragStart && dragEnd) {
      const x1 = Math.min(dragStart.x, dragEnd.x);
      const x2 = Math.max(dragStart.x, dragEnd.x);
      
      selectionRect
        .attr('x', x1)
        .attr('y', 0)
        .attr('width', x2 - x1)
        .attr('height', innerHeight)
        .attr('visibility', 'visible');
      
      startLine
        .attr('x1', x1)
        .attr('x2', x1)
        .attr('visibility', 'visible');
      
      endLine
        .attr('x1', x2)
        .attr('x2', x2)
        .attr('visibility', 'visible');
    }

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

    // Interactive overlay
    const overlay = g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .style('cursor', 'crosshair');

    // Helper function to get coordinates
    const getCoordinates = (event: any) => {
      const rect = (event.target as Element).getBoundingClientRect();
      let clientX, clientY;
      
      if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else if (event.changedTouches && event.changedTouches.length > 0) {
        clientX = event.changedTouches[0].clientX;
        clientY = event.changedTouches[0].clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }
      
      const x = clientX - rect.left - margin.left;
      const y = clientY - rect.top - margin.top;
      const time = xScale.invert(Math.max(0, Math.min(x, innerWidth)));
      
      return { x: Math.max(0, Math.min(x, innerWidth)), y, time };
    };

    // Start drag
    const handleStart = (event: any) => {
      event.preventDefault();
      const coords = getCoordinates(event);
      setIsDragging(true);
      setDragStart(coords);
      setDragEnd(coords);
    };

    // During drag
    const handleMove = (event: any) => {
      event.preventDefault();
      const coords = getCoordinates(event);
      
      if (isDragging && dragStart) {
        setDragEnd(coords);
      } else {
        // Hover effect
        hoverLine
          .attr('x1', coords.x)
          .attr('x2', coords.x)
          .style('opacity', 1);
        
        tooltip
          .attr('x', coords.x + 5)
          .attr('y', 15)
          .text(`${coords.time.toFixed(2)}s`)
          .style('opacity', 1);
      }
    };

    // End drag
    const handleEnd = (event: any) => {
      event.preventDefault();
      
      if (isDragging && dragStart && dragEnd) {
        const startTime = Math.min(dragStart.time, dragEnd.time);
        const endTime = Math.max(dragStart.time, dragEnd.time);
        
        if (endTime - startTime > 0.1) {
          onSegmentSelect(startTime, endTime);
        }
      }
      
      setIsDragging(false);
      setDragStart(null);
      setDragEnd(null);
    };

    // Mouse leave
    const handleLeave = () => {
      hoverLine.style('opacity', 0);
      tooltip.style('opacity', 0);
      
      if (isDragging) {
        setIsDragging(false);
        setDragStart(null);
        setDragEnd(null);
      }
    };

    // Attach event listeners
    overlay
      .on('mousedown', handleStart)
      .on('mousemove', handleMove)
      .on('mouseup', handleEnd)
      .on('mouseleave', handleLeave)
      .on('touchstart', handleStart)
      .on('touchmove', handleMove)
      .on('touchend', handleEnd);

  }, [data, labels, dimensions, onSegmentSelect, isDragging, dragStart, dragEnd]);

  return (
    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4">
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        className="touch-none select-none"
        style={{ touchAction: 'none' }}
      />
      {isDragging && dragStart && dragEnd && (
        <div className="absolute bottom-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md text-xs sm:text-sm">
          {Math.abs(dragEnd.time - dragStart.time).toFixed(2)}s selected
        </div>
      )}
    </div>
  );
}