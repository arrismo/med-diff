export interface Report {
  id: string;
  title: string;
  provider: string;
  date: string;
  content: string;
  patient: {
    id: string;
    name: string;
    age: number;
    gender: string;
  };
  metadata: {
    testType: string;
    orderedBy: string;
    reportedBy: string;
  };
}

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'informational';

export interface Discrepancy {
  id: string;
  type: 'conflict' | 'missing' | 'rangeVariation' | 'terminologyDifference';
  description: string;
  severity: SeverityLevel;
  location: {
    report1Location: { start: number; end: number } | null;
    report2Location: { start: number; end: number } | null;
  };
  context: string;
  suggestion: string;
}

export interface ComparisonResult {
  id: string;
  timestamp: string;
  report1: Report;
  report2: Report;
  discrepancies: Discrepancy[];
  summary: {
    totalDiscrepancies: number;
    bySeverity: Record<SeverityLevel, number>;
    byType: Record<string, number>;
    clinicalImplications: string;
  };
}

export interface ComparisonFilter {
  severity: SeverityLevel[];
  types: string[];
  search: string;
}