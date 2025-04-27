import { Report, ComparisonResult, Discrepancy, SeverityLevel } from '../types';

export const mockReports: Report[] = [
  {
    id: 'report-1',
    title: 'Complete Blood Count',
    provider: 'City Hospital Lab',
    date: '2025-06-10T14:30:00Z',
    content: `Patient: John Smith
Age: 55
Gender: Male
Test: Complete Blood Count (CBC)
Date: June 10, 2025

RESULTS:
WBC: 7.5 x 10^3/uL (4.5-11.0)
RBC: 4.8 x 10^6/uL (4.5-5.9)
Hemoglobin: 14.2 g/dL (13.5-17.5)
Hematocrit: 42% (41-50%)
MCV: 88 fL (80-100)
MCH: 29.5 pg (27-31)
MCHC: 33.8 g/dL (32-36)
Platelets: 250 x 10^3/uL (150-450)
Glucose: 115 mg/dL (70-99) - HIGH

INTERPRETATION:
Mild elevation in glucose levels suggesting pre-diabetic condition.
All other values within normal range.
Follow-up recommended in 3 months.

Dr. James Wilson
Laboratory Director`,
    patient: {
      id: 'P-12345',
      name: 'John Smith',
      age: 55,
      gender: 'Male',
    },
    metadata: {
      testType: 'Complete Blood Count',
      orderedBy: 'Dr. Sarah Johnson',
      reportedBy: 'Dr. James Wilson',
    },
  },
  {
    id: 'report-2',
    title: 'Blood Chemistry Analysis',
    provider: 'MediLab Services',
    date: '2025-06-12T10:15:00Z',
    content: `PATIENT INFORMATION:
Name: John Smith
DOB: 01/15/1970
Sex: M
Collected: 06/12/2025 08:30 AM
Reported: 06/12/2025 10:15 AM

TEST RESULTS:
Glucose (fasting): 126 mg/dL [Reference: 65-95 mg/dL] *HIGH*
HbA1c: 6.2% [Reference: 4.0-5.6%] *HIGH*
WBC Count: 7.8 x 10^3/uL [Reference: 4.5-11.0 x 10^3/uL]
RBC Count: 4.9 x 10^6/uL [Reference: 4.5-5.9 x 10^6/uL]
Hemoglobin: 14.5 g/dL [Reference: 13.5-17.5 g/dL]
Platelets: 245 x 10^3/uL [Reference: 150-450 x 10^3/uL]

CLINICAL FINDINGS:
Patient presents with elevated glucose levels consistent with diabetes mellitus.
Recommend follow-up with primary care physician within 2 weeks.
Dietary modification and glucose monitoring advised.

Electronically signed by:
Dr. Patricia Lee, MD, FCAP
Laboratory Director
MediLab Services`,
    patient: {
      id: 'P-12345',
      name: 'John Smith',
      age: 55,
      gender: 'Male',
    },
    metadata: {
      testType: 'Blood Chemistry',
      orderedBy: 'Dr. Robert Chen',
      reportedBy: 'Dr. Patricia Lee',
    },
  },
  {
    id: 'report-3',
    title: 'Lipid Panel',
    provider: 'HealthFirst Diagnostics',
    date: '2025-06-15T09:45:00Z',
    content: `HealthFirst Diagnostics
Patient ID: 12345
Name: John Smith
Age/Sex: 55/M
Collection Date: 06/15/2025
Physician: Dr. Emily Brooks

LIPID PANEL
Total Cholesterol: 210 mg/dL [Desirable: <200 mg/dL] - BORDERLINE HIGH
HDL Cholesterol: 45 mg/dL [Optimal: >60 mg/dL]
LDL Cholesterol: 130 mg/dL [Optimal: <100 mg/dL] - BORDERLINE HIGH
Triglycerides: 180 mg/dL [Normal: <150 mg/dL] - HIGH
Total Cholesterol/HDL Ratio: 4.7 [Desirable: <4.0] - ELEVATED
Non-HDL Cholesterol: 165 mg/dL [Desirable: <130 mg/dL] - HIGH

COMMENTS:
Patient shows borderline high cholesterol levels and elevated triglycerides.
Recommend diet modification, increased physical activity, and reassessment in 3 months.
Consider statins if levels remain elevated at follow-up.

Dr. William Thompson
Clinical Pathologist`,
    patient: {
      id: 'P-12345',
      name: 'John Smith',
      age: 55,
      gender: 'Male',
    },
    metadata: {
      testType: 'Lipid Panel',
      orderedBy: 'Dr. Emily Brooks',
      reportedBy: 'Dr. William Thompson',
    },
  },
];

const createMockDiscrepancies = (): Discrepancy[] => {
  return [
    {
      id: 'disc-1',
      type: 'conflict',
      description: 'Conflicting glucose reference ranges between reports',
      severity: 'high',
      location: {
        report1Location: { start: 420, end: 450 },
        report2Location: { start: 300, end: 340 },
      },
      context: 'City Hospital Lab reports normal glucose range as 70-99 mg/dL while MediLab Services reports it as 65-95 mg/dL',
      suggestion: 'Consider the more stringent reference range (65-95 mg/dL) for clinical decision making. Follow up with endocrinology consult.',
    },
    {
      id: 'disc-2',
      type: 'conflict',
      description: 'Different glucose level interpretations between reports',
      severity: 'critical',
      location: {
        report1Location: { start: 420, end: 450 },
        report2Location: { start: 300, end: 340 },
      },
      context: 'First report suggests pre-diabetic condition while second report indicates diabetes mellitus',
      suggestion: 'Order HbA1c confirmatory test to assess long-term glucose control. Schedule endocrinology consultation.',
    },
    {
      id: 'disc-3',
      type: 'missing',
      description: 'HbA1c value present in second report but missing in first',
      severity: 'high',
      location: {
        report1Location: null,
        report2Location: { start: 350, end: 380 },
      },
      context: 'HbA1c is a critical measure for assessing glucose control over time',
      suggestion: 'Add HbA1c testing to standard protocol for all patients with elevated glucose levels.',
    },
    {
      id: 'disc-4',
      type: 'rangeVariation',
      description: 'Different recommended follow-up timeframes',
      severity: 'medium',
      location: {
        report1Location: { start: 650, end: 680 },
        report2Location: { start: 600, end: 630 },
      },
      context: 'First report recommends follow-up in 3 months while second suggests 2 weeks',
      suggestion: 'Follow the more urgent recommendation (2 weeks) due to possible diabetes diagnosis.',
    },
    {
      id: 'disc-5',
      type: 'terminologyDifference',
      description: 'Different terminology for elevated glucose',
      severity: 'low',
      location: {
        report1Location: { start: 550, end: 600 },
        report2Location: { start: 550, end: 600 },
      },
      context: 'First report uses "pre-diabetic condition" while second uses "diabetes mellitus"',
      suggestion: 'Standardize terminology based on ADA diagnostic criteria for consistent communication.',
    },
    {
      id: 'disc-6',
      type: 'rangeVariation',
      description: 'Slight variation in platelets count',
      severity: 'informational',
      location: {
        report1Location: { start: 400, end: 420 },
        report2Location: { start: 450, end: 470 },
      },
      context: 'Minor difference in platelets count (250 vs 245) but both within normal range',
      suggestion: 'No clinical action required. Normal variation between testing occasions.',
    },
  ];
};

const createSeveritySummary = (discrepancies: Discrepancy[]) => {
  const severityCounts: Record<SeverityLevel, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    informational: 0,
  };
  
  const typeCounts: Record<string, number> = {
    conflict: 0,
    missing: 0,
    rangeVariation: 0,
    terminologyDifference: 0,
  };
  
  discrepancies.forEach(d => {
    severityCounts[d.severity]++;
    typeCounts[d.type]++;
  });
  
  return {
    totalDiscrepancies: discrepancies.length,
    bySeverity: severityCounts,
    byType: typeCounts,
    clinicalImplications: "Reports show significant discrepancies in glucose interpretation and reference ranges. Recommended actions include additional testing (HbA1c), more urgent follow-up (2 weeks), and endocrinology consultation."
  };
};

export const mockComparisons: ComparisonResult[] = [
  {
    id: 'comparison-1',
    timestamp: '2025-06-15T15:30:00Z',
    report1: mockReports[0],
    report2: mockReports[1],
    discrepancies: createMockDiscrepancies(),
    summary: createSeveritySummary(createMockDiscrepancies()),
  },
];