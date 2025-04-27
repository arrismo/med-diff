import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import { useReports } from '../contexts/ReportContext';
import { Clock, Search, Filter, FileDown, ArrowRight } from 'lucide-react';

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { comparisons, setActiveComparison } = useReports();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredComparisons = comparisons.filter(comparison => 
    comparison.report1.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comparison.report2.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleViewComparison = (comparisonId: string) => {
    const comparison = comparisons.find(c => c.id === comparisonId);
    if (comparison) {
      setActiveComparison(comparison);
      navigate('/compare');
    }
  };

  if (comparisons.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <Clock className="h-16 w-16 text-neutral-300 mb-4" />
        <h2 className="text-xl font-medium text-neutral-800 mb-2">No Comparison History</h2>
        <p className="text-neutral-600 mb-6 max-w-md">
          You haven't compared any reports yet. Upload reports and start comparing to see your history here.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate('/')}
        >
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-semibold">Comparison History</h2>
        
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm rounded-lg border border-neutral-300 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-64"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          </div>
          
          <Button
            variant="outline"
            leftIcon={<Filter className="h-4 w-4" />}
          >
            Filter
          </Button>
          
          <Button
            variant="outline"
            leftIcon={<FileDown className="h-4 w-4" />}
          >
            Export
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredComparisons.map(comparison => (
          <Card 
            key={comparison.id}
            hoverable
            onClick={() => handleViewComparison(comparison.id)}
            className="transition-all hover:border-primary-300"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center">
                  <h4 className="font-medium text-neutral-800 mr-3">
                    {comparison.report1.title} vs. {comparison.report2.title}
                  </h4>
                  {comparison.summary.bySeverity.critical > 0 && (
                    <Badge variant="error" size="sm">
                      Critical
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center mt-2 gap-2">
                  <p className="text-sm text-neutral-600">
                    {new Date(comparison.timestamp).toLocaleString()}
                  </p>
                  <span className="text-neutral-300">•</span>
                  <p className="text-sm text-neutral-600">
                    {comparison.report1.provider} & {comparison.report2.provider}
                  </p>
                  <span className="text-neutral-300">•</span>
                  <p className="text-sm text-neutral-600">
                    Patient: {comparison.report1.patient.name}
                  </p>
                </div>
                
                <div className="flex items-center mt-3 space-x-2">
                  <Badge variant="primary" size="sm">
                    {comparison.summary.totalDiscrepancies} Discrepancies
                  </Badge>
                  
                  {comparison.summary.bySeverity.high > 0 && (
                    <Badge variant="warning" size="sm">
                      {comparison.summary.bySeverity.high} High
                    </Badge>
                  )}
                  
                  {comparison.summary.bySeverity.medium > 0 && (
                    <Badge variant="secondary" size="sm">
                      {comparison.summary.bySeverity.medium} Medium
                    </Badge>
                  )}
                </div>
              </div>
              
              <Button
                variant="primary"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="mt-4 md:mt-0"
                onClick={() => handleViewComparison(comparison.id)}
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;