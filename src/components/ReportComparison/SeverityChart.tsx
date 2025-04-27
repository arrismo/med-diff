import React from 'react';
import { motion } from 'framer-motion';
import { SeverityLevel } from '../../types';

interface ChartProps {
  summary: {
    totalDiscrepancies: number;
    bySeverity: Record<SeverityLevel, number>;
    byType: Record<string, number>;
    clinicalImplications: string;
  };
}

const SeverityChart: React.FC<ChartProps> = ({ summary }) => {
  const severityColors = {
    critical: 'bg-error-500',
    high: 'bg-warning-500',
    medium: 'bg-primary-500',
    low: 'bg-secondary-500',
    informational: 'bg-neutral-400',
  };

  const typeColors = {
    conflict: 'bg-error-500',
    missing: 'bg-warning-500',
    rangeVariation: 'bg-primary-500',
    terminologyDifference: 'bg-secondary-500',
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'conflict':
        return 'Conflicts';
      case 'missing':
        return 'Missing Info';
      case 'rangeVariation':
        return 'Range Var.';
      case 'terminologyDifference':
        return 'Terminology';
      default:
        return type;
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-3">
        <h5 className="text-sm font-medium text-neutral-700">By Severity</h5>
        <p className="text-sm text-neutral-600">Total: {summary.totalDiscrepancies}</p>
      </div>
      
      <div className="h-8 flex rounded-full overflow-hidden">
        {Object.entries(summary.bySeverity).map(([severity, count]) => {
          if (count === 0) return null;
          
          const percentage = (count / summary.totalDiscrepancies) * 100;
          return (
            <motion.div
              key={severity}
              className={`${severityColors[severity as SeverityLevel]} h-full relative group`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {percentage > 10 && (
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                  {count}
                </span>
              )}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {severity}: {count}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {Object.entries(summary.bySeverity)
          .filter(([_, count]) => count > 0)
          .map(([severity, count]) => (
            <div key={severity} className="flex items-center text-xs">
              <div className={`w-3 h-3 rounded-full ${severityColors[severity as SeverityLevel]} mr-1`}></div>
              <span className="capitalize">{severity}</span>
            </div>
          ))}
      </div>
      
      <div className="mt-6">
        <h5 className="text-sm font-medium text-neutral-700 mb-3">By Type</h5>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(summary.byType).map(([type, count]) => (
            <div key={type} className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${typeColors[type as keyof typeof typeColors] || 'bg-neutral-400'} mr-2`}></div>
              <span className="text-xs text-neutral-700">{getTypeLabel(type)}: <span className="font-medium">{count}</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeverityChart;