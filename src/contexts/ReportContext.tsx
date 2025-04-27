import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Report, ComparisonResult, Discrepancy, ComparisonFilter, SeverityLevel } from '../types';
import { mockReports } from '../data/mockData';

interface ReportContextType {
  reports: Report[];
  comparisons: ComparisonResult[];
  activeComparison: ComparisonResult | null;
  filters: ComparisonFilter;
  uploadReport: (report: File) => Promise<Report>;
  compareReports: (report1Id: string, report2Id: string) => Promise<ComparisonResult>;
  getFilteredDiscrepancies: () => Discrepancy[];
  setActiveComparison: (comparison: ComparisonResult | null) => void;
  updateFilters: (newFilters: Partial<ComparisonFilter>) => void;
  clearFilters: () => void;
  viewMode: 'rawText' | 'semantic';
  setViewMode: (mode: 'rawText' | 'semantic') => void;
}

const defaultFilters: ComparisonFilter = {
  severity: ['critical', 'high', 'medium', 'low', 'informational'],
  types: ['conflict', 'missing', 'rangeVariation', 'terminologyDifference'],
  search: '',
};

const ReportContext = createContext<ReportContextType | undefined>(undefined);

interface MedicalValue {
  name: string;
  value: number;
  unit: string;
  interpretation?: string;
  fullText: string;
  position: { start: number; end: number };
}

interface FollowUpInfo {
  timeframe: string;
  position: { start: number; end: number };
  fullText: string;
  value: number;
  unit: string;
}

const extractMedicalValues = (text: string): MedicalValue[] => {
  const values: MedicalValue[] = [];
  
  // Match patterns like "Glucose: 115 mg/dL (70-99) - HIGH" or "HDL Cholesterol: 45 mg/dL [Optimal: >60 mg/dL]"
  const pattern = /([A-Za-z\s]+):\s*(\d+(?:\.\d+)?)\s*([a-zA-Z/%^]+\/?\w*)\s*(?:\(|\[)[^)\]]*(?:\)|\])?\s*(?:[-*]+\s*(HIGH|LOW|ELEVATED|BORDERLINE|ABNORMAL|CRITICAL))?\b/gi;
  
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const [fullText, name, value, unit, interpretation] = match;
    values.push({
      name: name.trim().toLowerCase(),
      value: parseFloat(value),
      unit,
      interpretation: interpretation?.toLowerCase(),
      fullText,
      position: {
        start: match.index,
        end: match.index + fullText.length
      }
    });
  }
  
  return values;
};

const extractFollowUpInfo = (text: string): FollowUpInfo | null => {
  // Enhanced pattern to match various follow-up formats
  const patterns = [
    /(?:follow(?:-|\s)?up|reassessment|review)\s+(?:recommended\s+)?in\s+(\d+)\s+(day|days|week|weeks|month|months|year|years)/i,
    /(?:follow(?:-|\s)?up|reassessment|review)\s+(?:in|within)\s+(\d+)\s+(day|days|week|weeks|month|months|year|years)/i,
    /(?:recommend\s+)?(?:follow(?:-|\s)?up|reassessment|review)\s+(?:in|within)\s+(\d+)\s+(day|days|week|weeks|month|months|year|years)/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const fullText = match[0];
      const startIndex = text.indexOf(fullText);
      return {
        timeframe: fullText,
        position: {
          start: startIndex,
          end: startIndex + fullText.length
        },
        fullText,
        value: parseInt(match[1]),
        unit: match[2].toLowerCase()
      };
    }
  }

  return null;
};

const compareFollowUpTimes = (text1: string, text2: string): Discrepancy | null => {
  const followUp1 = extractFollowUpInfo(text1);
  const followUp2 = extractFollowUpInfo(text2);

  if (!followUp1 || !followUp2) return null;

  // Convert all times to days for comparison
  const getDays = (value: number, unit: string): number => {
    const unitLower = unit.toLowerCase();
    switch (unitLower) {
      case 'day':
      case 'days':
        return value;
      case 'week':
      case 'weeks':
        return value * 7;
      case 'month':
      case 'months':
        return value * 30;
      case 'year':
      case 'years':
        return value * 365;
      default:
        return value;
    }
  };

  const days1 = getDays(followUp1.value, followUp1.unit);
  const days2 = getDays(followUp2.value, followUp2.unit);

  if (days1 !== days2) {
    const severity: SeverityLevel = 
      Math.abs(days1 - days2) > 60 ? 'high' :
      Math.abs(days1 - days2) > 30 ? 'medium' : 
      'low';

    return {
      id: `followup-diff-${Date.now()}`,
      type: 'conflict',
      description: `Different follow-up times: ${followUp1.timeframe} vs ${followUp2.timeframe}`,
      severity,
      location: {
        report1Location: followUp1.position,
        report2Location: followUp2.position
      },
      context: `Reports recommend different follow-up timeframes which may impact patient care`,
      suggestion: 'Confirm appropriate follow-up schedule with healthcare provider'
    };
  }

  return null;
};

const findMedicalDifferences = (text1: string, text2: string): Discrepancy[] => {
  const values1 = extractMedicalValues(text1);
  const values2 = extractMedicalValues(text2);
  const differences: Discrepancy[] = [];
  
  // Compare medical values
  values1.forEach((v1) => {
    const v2 = values2.find(v2 => v2.name === v1.name);
    if (v2) {
      // Only compare if units match
      if (v1.unit === v2.unit) {
        const percentDiff = Math.abs(v1.value - v2.value) / ((v1.value + v2.value) / 2) * 100;
        
        // Only create a discrepancy if values are different
        if (v1.value !== v2.value) {
          const severity: SeverityLevel = 
            (v1.interpretation === 'critical' || v2.interpretation === 'critical') ? 'critical' :
            (v1.interpretation !== v2.interpretation) || percentDiff > 20 ? 'high' :
            percentDiff > 10 ? 'medium' : 'low';

          differences.push({
            id: `value-diff-${Date.now()}-${v1.name}`,
            type: 'conflict',
            description: `${v1.name.charAt(0).toUpperCase() + v1.name.slice(1)}: ${v1.value} ${v1.unit} vs ${v2.value} ${v2.unit}`,
            severity,
            location: {
              report1Location: v1.position,
              report2Location: v2.position
            },
            context: `Different values reported for ${v1.name}${v1.interpretation || v2.interpretation ? 
              ` (${[v1.interpretation, v2.interpretation].filter(Boolean).join(' vs ')})` : 
              ''}`,
            suggestion: 'Review with healthcare provider for clinical significance'
          });
        }
      }
    }
  });

  // Check for follow-up time differences
  const followUpDiff = compareFollowUpTimes(text1, text2);
  if (followUpDiff) {
    differences.push(followUpDiff);
  }

  return differences;
};

export const ReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reports] = useState<Report[]>(mockReports);
  const [comparisons, setComparisons] = useState<ComparisonResult[]>([]);
  const [activeComparison, setActiveComparison] = useState<ComparisonResult | null>(null);
  const [filters, setFilters] = useState<ComparisonFilter>(defaultFilters);
  const [viewMode, setViewMode] = useState<'rawText' | 'semantic'>('semantic');

  const uploadReport = async (file: File): Promise<Report> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReport: Report = {
          id: `report-${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, ""),
          provider: "Uploaded Provider",
          date: new Date().toISOString(),
          content: "Simulated report content would come from the server",
          patient: {
            id: "P-12345",
            name: "Jane Doe",
            age: 45,
            gender: "Female"
          },
          metadata: {
            testType: "Blood Test",
            orderedBy: "Dr. Smith",
            reportedBy: "Lab Corp"
          }
        };
        resolve(newReport);
      }, 1500);
    });
  };

  const compareReports = async (report1Id: string, report2Id: string): Promise<ComparisonResult> => {
    const report1 = reports.find(r => r.id === report1Id);
    const report2 = reports.find(r => r.id === report2Id);
    
    if (!report1 || !report2) {
      throw new Error("Selected reports not found");
    }

    // Indicate loading state (optional, but good UX)
    setActiveComparison(null); // Or set a specific loading state if you have one

    try {
      // Determine the correct API endpoint based on environment
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiUrl = isLocal ? '/api/compare' : '/.netlify/functions/compare';
      // Call the backend API endpoint
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ report1, report2 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const comparisonResult: ComparisonResult = await response.json();

      // Update state with the result from the backend
      setComparisons(prev => [...prev.filter(c => c.id !== comparisonResult.id), comparisonResult]); // Add or update
      setActiveComparison(comparisonResult);
      return comparisonResult;

    } catch (error) {
      console.error('Error comparing reports via API:', error);
      // Optionally set an error state to show in the UI
      // setActiveComparison(null); // Clear comparison on error
      throw error; // Re-throw the error to be handled by the caller if necessary
    }
  };

  const getFilteredDiscrepancies = (): Discrepancy[] => {
    if (!activeComparison) return [];
    
    return activeComparison.discrepancies.filter(discrepancy => {
      if (!filters.severity.includes(discrepancy.severity)) return false;
      if (!filters.types.includes(discrepancy.type)) return false;
      if (filters.search && !discrepancy.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      return true;
    });
  };

  const updateFilters = (newFilters: Partial<ComparisonFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <ReportContext.Provider
      value={{
        reports,
        comparisons,
        activeComparison,
        filters,
        uploadReport,
        compareReports,
        getFilteredDiscrepancies,
        setActiveComparison,
        updateFilters,
        clearFilters,
        viewMode,
        setViewMode,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};