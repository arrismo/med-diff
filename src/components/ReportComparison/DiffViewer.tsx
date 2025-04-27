import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw as Sync, Copy } from 'lucide-react';
import { Report, Discrepancy } from '../../types';
import Badge from '../UI/Badge';

interface DiffViewerProps {
  report1: Report;
  report2: Report;
  selectedDiscrepancy: Discrepancy | null;
  viewMode: 'rawText' | 'semantic';
}

const DiffViewer: React.FC<DiffViewerProps> = ({
  report1,
  report2,
  selectedDiscrepancy,
  viewMode,
}) => {
  const report1Ref = useRef<HTMLDivElement>(null);
  const report2Ref = useRef<HTMLDivElement>(null);
  const [syncScroll, setSyncScroll] = useState(true);

  const getHighlightClass = (severity: string) => {
    const baseClasses = 'px-1 py-0.5 rounded relative group cursor-help border-b-2';
    
    switch (severity) {
      case 'critical':
        return `${baseClasses} bg-error-100 text-error-900 border-error-500`;
      case 'high':
        return `${baseClasses} bg-warning-100 text-warning-900 border-warning-500`;
      case 'medium':
        return `${baseClasses} bg-primary-100 text-primary-900 border-primary-500`;
      case 'low':
        return `${baseClasses} bg-neutral-100 text-neutral-900 border-neutral-500`;
      default:
        return `${baseClasses} bg-neutral-100 text-neutral-900 border-neutral-400`;
    }
  };

  const renderContent = (content: string, discrepancy: Discrepancy | null, isReport1: boolean) => {
    if (!discrepancy) {
      return <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{content}</pre>;
    }

    const location = isReport1 ? discrepancy.location.report1Location : discrepancy.location.report2Location;
    if (!location) {
      return <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{content}</pre>;
    }

    const before = content.substring(0, location.start);
    const highlight = content.substring(location.start, location.end);
    const after = content.substring(location.end);

    const highlightClass = getHighlightClass(discrepancy.severity);

    return (
      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
        {before}
        <span 
          className={highlightClass}
          title={discrepancy.description}
        >
          {highlight}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-neutral-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
            <div className="p-3">
              <div className="font-medium mb-1">{discrepancy.description}</div>
              <div className="text-neutral-300 text-[11px] leading-relaxed">{discrepancy.context}</div>
              {discrepancy.suggestion && (
                <div className="mt-2 pt-2 border-t border-neutral-700 text-[11px] text-neutral-200">
                  {discrepancy.suggestion}
                </div>
              )}
            </div>
          </div>
        </span>
        {after}
      </pre>
    );
  };

  useEffect(() => {
    if (!syncScroll) return;
    
    const report1Element = report1Ref.current;
    const report2Element = report2Ref.current;
    
    if (!report1Element || !report2Element) return;
    
    const handleScroll = (event: Event) => {
      const source = event.target as HTMLElement;
      const target = source === report1Element ? report2Element : report1Element;
      
      const sourceScrollTop = source.scrollTop;
      const sourceMaxScroll = source.scrollHeight - source.clientHeight;
      const percentage = sourceScrollTop / sourceMaxScroll;
      
      const targetMaxScroll = target.scrollHeight - target.clientHeight;
      target.scrollTop = percentage * targetMaxScroll;
    };
    
    report1Element.addEventListener('scroll', handleScroll);
    report2Element.addEventListener('scroll', handleScroll);
    
    return () => {
      report1Element.removeEventListener('scroll', handleScroll);
      report2Element.removeEventListener('scroll', handleScroll);
    };
  }, [syncScroll]);

  useEffect(() => {
    if (!selectedDiscrepancy) return;

    const report1Element = report1Ref.current;
    const report2Element = report2Ref.current;
    
    if (!report1Element || !report2Element) return;

    const location1 = selectedDiscrepancy.location.report1Location;
    const location2 = selectedDiscrepancy.location.report2Location;

    const scrollToLocation = (element: HTMLElement, location: { start: number; end: number } | null) => {
      if (!location) return;
      
      const text = element.textContent || '';
      const lineHeight = 20; // Approximate line height
      const charsPerLine = 80; // Approximate characters per line
      const approximateLineNumber = Math.floor(location.start / charsPerLine);
      const scrollPosition = approximateLineNumber * lineHeight;
      
      element.scrollTop = Math.max(0, scrollPosition - element.clientHeight / 3);
    };

    scrollToLocation(report1Element, location1);
    scrollToLocation(report2Element, location2);
  }, [selectedDiscrepancy]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex space-x-2">
          <Badge variant="primary" size="md">
            {viewMode === 'semantic' ? 'Semantic View' : 'Raw Text View'}
          </Badge>
          
          {selectedDiscrepancy && (
            <Badge 
              variant={selectedDiscrepancy.severity === 'critical' ? 'error' : 
                      selectedDiscrepancy.severity === 'high' ? 'warning' : 
                      'primary'} 
              size="md"
            >
              {selectedDiscrepancy.description}
            </Badge>
          )}
        </div>
        
        <button 
          className={`flex items-center text-sm ${syncScroll ? 'text-primary-500' : 'text-neutral-500'}`}
          onClick={() => setSyncScroll(!syncScroll)}
        >
          <Sync className={`h-4 w-4 mr-1 ${syncScroll ? 'animate-spin-slow' : ''}`} />
          {syncScroll ? 'Sync On' : 'Sync Off'}
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-6 flex-1 overflow-hidden">
        <div className="flex flex-col overflow-hidden">
          <div className="flex justify-between items-center bg-neutral-100 p-3 rounded-t-lg">
            <div>
              <h4 className="font-medium">{report1.title}</h4>
              <p className="text-xs text-neutral-600">{report1.provider} - {new Date(report1.date).toLocaleDateString()}</p>
            </div>
            <button 
              className="text-neutral-500 hover:text-neutral-700 transition-colors"
              onClick={() => navigator.clipboard.writeText(report1.content)}
              title="Copy report content"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <div 
            ref={report1Ref}
            className="flex-1 overflow-auto bg-white border border-neutral-200 p-4 rounded-b-lg"
          >
            {renderContent(report1.content, selectedDiscrepancy, true)}
          </div>
        </div>
        
        <div className="flex flex-col overflow-hidden">
          <div className="flex justify-between items-center bg-neutral-100 p-3 rounded-t-lg">
            <div>
              <h4 className="font-medium">{report2.title}</h4>
              <p className="text-xs text-neutral-600">{report2.provider} - {new Date(report2.date).toLocaleDateString()}</p>
            </div>
            <button 
              className="text-neutral-500 hover:text-neutral-700 transition-colors"
              onClick={() => navigator.clipboard.writeText(report2.content)}
              title="Copy report content"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <div 
            ref={report2Ref}
            className="flex-1 overflow-auto bg-white border border-neutral-200 p-4 rounded-b-lg"
          >
            {renderContent(report2.content, selectedDiscrepancy, false)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiffViewer;