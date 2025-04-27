import React, { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { mockReports } from '../data/mockData';

// Extract unique patients
const patients = Array.from(
  new Map(mockReports.map(r => [r.patient.id, r.patient])).values()
);

const PatientHistoryPage: React.FC = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const patientReports = mockReports
    .filter(r => r.patient.id === selectedPatientId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <h2 className="text-2xl font-semibold mb-6">Patient History</h2>
      <div className="flex gap-8">
        {/* Patient List */}
        <div className="w-1/3">
          <h3 className="text-lg font-medium mb-4">Patients</h3>
          <div className="space-y-2">
            {patients.map(patient => (
              <Card
                key={patient.id}
                hoverable
                className={`cursor-pointer ${selectedPatientId === patient.id ? 'border-primary-500' : ''}`}
                onClick={() => setSelectedPatientId(patient.id)}
              >
                <div className="font-medium">{patient.name}</div>
                <div className="text-xs text-neutral-500">Age: {patient.age} • Gender: {patient.gender}</div>
              </Card>
            ))}
          </div>
        </div>
        {/* Timeline */}
        <div className="flex-1">
          {selectedPatient ? (
            <>
              <h3 className="text-lg font-medium mb-4">History for {selectedPatient.name}</h3>
              <div className="relative border-l-2 border-primary-200 pl-6">
                {patientReports.length === 0 && <div className="text-neutral-400">No reports found.</div>}
                {patientReports.map((report, idx) => (
                  <div key={report.id} className="mb-8 flex items-start">
                    <div className="w-3 h-3 bg-primary-500 rounded-full mt-1.5 mr-4" />
                    <div>
                      <div className="font-semibold">{report.title}</div>
                      <div className="text-xs text-neutral-500 mb-1">{new Date(report.date).toLocaleDateString()} • {report.provider}</div>
                      <div className="text-sm text-neutral-700 whitespace-pre-line mb-2">{report.content.slice(0, 120)}{report.content.length > 120 ? '...' : ''}</div>
                      <Button size="sm" variant="outline" onClick={() => setPdfUrl(report.pdfUrl || null)}>
                        View Full Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-neutral-400 mt-12">Select a patient to view their history.</div>
          )}
        </div>
      </div>
      {/* Report Content Modal */}
      {pdfUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-3xl w-full relative">
            <button
              className="absolute top-2 right-2 text-neutral-500 hover:text-neutral-800 text-xl"
              onClick={() => setPdfUrl(null)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="mb-4 font-semibold text-lg">Full Report</div>
            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed max-h-[70vh] overflow-auto bg-neutral-50 p-4 rounded border">
              {patientReports.find(r => r.pdfUrl === pdfUrl)?.content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientHistoryPage; 