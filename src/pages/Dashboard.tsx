import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import { useReports } from '../contexts/ReportContext';
import { 
  ChevronRight, 
  AlertTriangle,
  ArrowRight,
  FileText,
  Clock
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { reports, compareReports } = useReports();
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patientReports = useMemo(() => {
    const grouped = reports.reduce((acc, report) => {
      const patientId = report.patient.id;
      if (!acc[patientId]) {
        acc[patientId] = {
          patient: report.patient,
          reports: []
        };
      }
      acc[patientId].reports.push(report);
      return acc;
    }, {} as Record<string, { patient: any, reports: typeof reports }>);

    return Object.values(grouped);
  }, [reports]);

  const handleSelectReport = (reportId: string) => {
    setError(null);
    setSelectedReports(prev => {
      if (prev.includes(reportId)) {
        return prev.filter(id => id !== reportId);
      }
      if (prev.length >= 2) {
        return [prev[1], reportId];
      }
      return [...prev, reportId];
    });
  };

  const handleCompare = async () => {
    if (selectedReports.length !== 2) return;
    
    setComparing(true);
    setError(null);

    try {
      await compareReports(selectedReports[0], selectedReports[1]);
      navigate('/compare');
    } catch (error) {
      console.error('Error comparing reports:', error);
      setError(
        error instanceof Error 
          ? error.message 
          : 'Failed to compare reports. Please try again.'
      );
    } finally {
      setComparing(false);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900">Patient Reports</h2>
          <p className="text-neutral-600 mt-1">Select reports to compare and analyze discrepancies</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="primary" size="md">
            {selectedReports.length}/2 selected
          </Badge>
          <Button
            variant="primary"
            disabled={selectedReports.length !== 2 || comparing}
            loading={comparing}
            onClick={handleCompare}
            rightIcon={<ChevronRight className="h-4 w-4" />}
          >
            Compare Selected
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {patientReports.length === 0 ? (
        <Card>
          <div className="py-8 text-center">
            <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-neutral-700 mb-2">No Reports Available</h3>
            <p className="text-neutral-600">
              Upload medical reports to start analyzing discrepancies
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {patientReports.map(({ patient, reports }) => (
            <Card key={patient.id}>
              <div className="border-b border-neutral-200 pb-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-neutral-900">{patient.name}</h3>
                    <p className="text-sm text-neutral-600">
                      ID: {patient.id} • Age: {patient.age} • Gender: {patient.gender}
                    </p>
                  </div>
                  {reports.length > 1 && (
                    <Badge variant="warning" size="md">
                      {reports.length} reports need review
                    </Badge>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-neutral-600">
                      <th className="pb-2 font-medium">Select</th>
                      <th className="pb-2 font-medium">Report Title</th>
                      <th className="pb-2 font-medium">Provider</th>
                      <th className="pb-2 font-medium">Date</th>
                      <th className="pb-2 font-medium">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {reports.map(report => (
                      <motion.tr
                        key={report.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={selectedReports.includes(report.id) ? 'bg-primary-50' : ''}
                      >
                        <td className="py-3 pr-4">
                          <input
                            type="checkbox"
                            checked={selectedReports.includes(report.id)}
                            onChange={() => handleSelectReport(report.id)}
                            className="h-4 w-4 text-primary-500 focus:ring-primary-400 border-neutral-300 rounded"
                          />
                        </td>
                        <td className="py-3 pr-4">
                          <div className="font-medium text-neutral-900">{report.title}</div>
                        </td>
                        <td className="py-3 pr-4 text-neutral-600">{report.provider}</td>
                        <td className="py-3 pr-4 text-neutral-600">
                          {new Date(report.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 pr-4">
                          <Badge variant="secondary" size="sm">
                            {report.metadata.testType}
                          </Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;