import React from 'react';
import { motion } from 'framer-motion';
import { Discrepancy } from '../../types';
import Badge from '../UI/Badge';
import { AlertCircle, AlertTriangle, Info, Check } from 'lucide-react';

interface DiscrepancyListProps {
  discrepancies: Discrepancy[];
  selectedDiscrepancyId: string | null;
  onSelectDiscrepancy: (id: string) => void;
}

const DiscrepancyList: React.FC<DiscrepancyListProps> = ({
  discrepancies,
  selectedDiscrepancyId,
  onSelectDiscrepancy,
}) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-error-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-warning-500" />;
      case 'medium':
        return <Info className="h-4 w-4 text-primary-500" />;
      default:
        return <Check className="h-4 w-4 text-success-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'conflict':
        return <Badge variant="error">Conflict</Badge>;
      case 'missing':
        return <Badge variant="warning">Missing</Badge>;
      case 'rangeVariation':
        return <Badge variant="primary">Range Variation</Badge>;
      case 'terminologyDifference':
        return <Badge variant="secondary">Terminology</Badge>;
      default:
        return <Badge variant="neutral">{type}</Badge>;
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <ul className="divide-y divide-neutral-200">
        {discrepancies.map((discrepancy) => (
          <motion.li
            key={discrepancy.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
            className={`p-4 cursor-pointer transition-colors ${
              selectedDiscrepancyId === discrepancy.id ? 'bg-primary-50' : ''
            }`}
            onClick={() => onSelectDiscrepancy(discrepancy.id)}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                {getSeverityIcon(discrepancy.severity)}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-neutral-900">
                  {discrepancy.description}
                </p>
                <div className="flex items-center mt-1 space-x-2">
                  {getTypeBadge(discrepancy.type)}
                  <Badge 
                    variant={
                      discrepancy.severity === 'critical' ? 'error' :
                      discrepancy.severity === 'high' ? 'warning' :
                      discrepancy.severity === 'medium' ? 'primary' :
                      'success'
                    }
                    size="sm"
                  >
                    {discrepancy.severity}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-neutral-600">
                  {discrepancy.context}
                </p>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default DiscrepancyList;