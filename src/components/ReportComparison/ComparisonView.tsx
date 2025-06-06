import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useReports } from '../../contexts/ReportContext';
import DiffViewer from './DiffViewer';
import DiscrepancyList from './DiscrepancyList';
import Button from '../UI/Button';
import { FilePlus, ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';

const DoctorNotes: React.FC = () => {
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div>
      <textarea
        className="w-full border border-neutral-300 rounded p-2 min-h-[80px] text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-primary-200"
        placeholder="Enter notes here..."
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />
      <div className="flex items-center space-x-2">
        <Button variant="primary" size="sm" onClick={handleSave}>
          Save Notes
        </Button>
        {saved && <span className="text-success-600 text-sm">Notes saved!</span>}
      </div>
    </div>
  );
};

const ComparisonView: React.FC = () => {
  const { activeComparison, viewMode, setViewMode } = useReports();
  const [selectedDiscrepancyId, setSelectedDiscrepancyId] = useState<string | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  if (!activeComparison) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <FilePlus className="h-16 w-16 text-neutral-300 mb-4" />
        <h2 className="text-xl font-medium text-neutral-800 mb-2">No Active Comparison</h2>
        <p className="text-neutral-600 mb-6 max-w-md">
          Upload and select two reports to compare them and see discrepancies between them.
        </p>
        <Button
          variant="primary"
          onClick={() => window.location.href = '/'}
        >
          Go to Dashboard
        </Button>
      </div>
    );
  }

  const handleDiscrepancySelect = (id: string) => {
    setSelectedDiscrepancyId(id === selectedDiscrepancyId ? null : id);
  };

  const selectedDiscrepancy = selectedDiscrepancyId
    ? activeComparison.discrepancies.find(d => d.id === selectedDiscrepancyId) || null
    : null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => window.location.href = '/'}
          >
            Back
          </Button>
          <h3 className="ml-4 text-neutral-900">
            Comparing: <span className="font-medium">{activeComparison.report1.title}</span> vs <span className="font-medium">{activeComparison.report2.title}</span>
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={fullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            onClick={() => setFullScreen(!fullScreen)}
          >
            {fullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        <motion.div 
          className={`lg:col-span-2 flex flex-col overflow-hidden ${fullScreen ? 'lg:col-span-3' : ''}`}
          layout
        >
          <DiffViewer
            report1={activeComparison.report1}
            report2={activeComparison.report2}
            selectedDiscrepancy={selectedDiscrepancy}
            viewMode={viewMode}
          />
        </motion.div>
        
        {!fullScreen && (
          <motion.div 
            className="flex flex-col overflow-hidden"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-lg border border-neutral-200 flex-1 overflow-hidden flex flex-col mb-4">
              <h4 className="text-lg font-medium p-4 border-b border-neutral-200">Discrepancies</h4>
              <DiscrepancyList
                discrepancies={activeComparison.discrepancies}
                selectedDiscrepancyId={selectedDiscrepancyId}
                onSelectDiscrepancy={handleDiscrepancySelect}
              />
            </div>
            <div className="bg-white rounded-lg border border-neutral-200 p-4 mt-2">
              <h4 className="text-lg font-medium mb-2">Doctor Notes</h4>
              <DoctorNotes />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ComparisonView;