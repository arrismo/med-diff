import React from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Save, Trash2, AlertTriangle } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto max-w-4xl">
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>
      
      <div className="space-y-6">
        <Card title="Data & Privacy">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="store-data"
                  type="checkbox"
                  className="h-4 w-4 text-primary-500 focus:ring-primary-400 border-neutral-300 rounded"
                  checked
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="store-data" className="font-medium text-neutral-700">Store report data</label>
                <p className="text-neutral-500">
                  Allow the system to store uploaded reports for analysis and comparison.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="anonymize"
                  type="checkbox"
                  className="h-4 w-4 text-primary-500 focus:ring-primary-400 border-neutral-300 rounded"
                  checked
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="anonymize" className="font-medium text-neutral-700">Anonymize patient data</label>
                <p className="text-neutral-500">
                  Automatically remove or mask patient identifiers in reports.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="improve"
                  type="checkbox"
                  className="h-4 w-4 text-primary-500 focus:ring-primary-400 border-neutral-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="improve" className="font-medium text-neutral-700">Help improve our models</label>
                <p className="text-neutral-500">
                  Allow anonymized data to be used for improving AI models.
                </p>
              </div>
            </div>
            
            <div className="bg-error-50 border border-error-200 rounded-lg p-4 mt-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-error-500 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-error-800">Data Deletion</h4>
                  <p className="text-xs text-error-700 mt-1">
                    This will permanently delete all your uploaded reports and comparison history.
                  </p>
                  <Button
                    variant="danger"
                    size="sm"
                    className="mt-3"
                    leftIcon={<Trash2 className="h-4 w-4" />}
                  >
                    Delete All Data
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;