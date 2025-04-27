import { Report, ComparisonResult, Discrepancy, SeverityLevel } from '../types';

export const mockReports: Report[] = [
  {
    id: 'report-1',
    title: 'Complete Blood Count',
    provider: 'City Hospital Lab',
    date: '2025-06-10T14:30:00Z',
    content: `Patient: John Smith\nAge: 55\nGender: Male\nTest: Complete Blood Count (CBC)\nDate: June 10, 2025\n\nRESULTS:\nWBC: 7.5 x 10^3/uL (4.5-11.0)\nRBC: 4.8 x 10^6/uL (4.5-5.9)\nHemoglobin: 14.2 g/dL (13.5-17.5)\nHematocrit: 42% (41-50%)\nMCV: 88 fL (80-100)\nMCH: 29.5 pg (27-31)\nMCHC: 33.8 g/dL (32-36)\nPlatelets: 250 x 10^3/uL (150-450)\nGlucose: 115 mg/dL (70-99) - HIGH\n\nINTERPRETATION:\nMild elevation in glucose levels suggesting pre-diabetic condition.\nAll other values within normal range.\nFollow-up recommended in 3 months.\n\nDr. James Wilson\nLaboratory Director`,
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
    pdfUrl: `/pdfs/report-1.pdf`,
  },
  {
    id: 'report-2',
    title: 'Blood Chemistry Analysis',
    provider: 'MediLab Services',
    date: '2025-06-12T10:15:00Z',
    content: `PATIENT INFORMATION:\nName: John Smith\nDOB: 01/15/1970\nSex: M\nCollected: 06/12/2025 08:30 AM\nReported: 06/12/2025 10:15 AM\n\nTEST RESULTS:\nGlucose (fasting): 140 mg/dL [Reference: 65-95 mg/dL] *HIGH*\nHbA1c: 7.2% [Reference: 4.0-5.6%] *HIGH*\nWBC Count: 7.8 x 10^3/uL [Reference: 4.5-11.0 x 10^3/uL]\nRBC Count: 4.9 x 10^6/uL [Reference: 4.5-5.9 x 10^6/uL]\nHemoglobin: 14.5 g/dL [Reference: 13.5-17.5 g/dL]\nPlatelets: 245 x 10^3/uL [Reference: 150-450 x 10^3/uL]\n\nCLINICAL FINDINGS:\nPatient presents with elevated glucose levels consistent with diabetes mellitus.\nRecommend follow-up with primary care physician within 1 week.\nDietary modification and glucose monitoring advised.\n\nElectronically signed by:\nDr. Patricia Lee, MD, FCAP\nLaboratory Director\nMediLab Services`,
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
    pdfUrl: `/pdfs/report-2.pdf`,
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
    pdfUrl: `/pdfs/report-3.pdf`,
  },
  {
    id: 'report-4',
    title: 'Renal Function Panel',
    provider: 'City Hospital Lab',
    date: '2025-06-18T11:00:00Z',
    content: `Patient: Alice Brown\nAge: 60\nGender: Female\nTest: Renal Function Panel\nDate: June 18, 2025\n\nRESULTS:\nBUN: 18 mg/dL (7-20)\nCreatinine: 1.0 mg/dL (0.6-1.3)\nGFR: 85 mL/min (>60)\nINTERPRETATION:\nAll values within normal range.\nFollow-up recommended in 6 months.`,
    patient: {
      id: 'P-67890',
      name: 'Alice Brown',
      age: 60,
      gender: 'Female',
    },
    metadata: {
      testType: 'Renal Function',
      orderedBy: 'Dr. Lee',
      reportedBy: 'City Hospital Lab',
    },
    pdfUrl: `/pdfs/report-4.pdf`,
  },
  {
    id: 'report-5',
    title: 'Thyroid Panel',
    provider: 'MediLab Services',
    date: '2025-06-20T13:30:00Z',
    content: `Patient: Bob Green\nAge: 45\nGender: Male\nTest: Thyroid Panel\nDate: June 20, 2025\n\nRESULTS:\nTSH: 2.5 uIU/mL (0.4-4.0)\nT4: 8.0 ug/dL (5.0-12.0)\nT3: 120 ng/dL (80-180)\nINTERPRETATION:\nAll values within normal range.\nFollow-up recommended in 1 year.`,
    patient: {
      id: 'P-54321',
      name: 'Bob Green',
      age: 45,
      gender: 'Male',
    },
    metadata: {
      testType: 'Thyroid',
      orderedBy: 'Dr. Patel',
      reportedBy: 'MediLab Services',
    },
    pdfUrl: `/pdfs/report-5.pdf`,
  },
  {
    id: 'report-6',
    title: 'Liver Function Test',
    provider: 'Central Diagnostics',
    date: '2025-06-22T09:00:00Z',
    content: `Patient: Carol White\nAge: 38\nGender: Female\nTest: Liver Function Test\nDate: June 22, 2025\n\nRESULTS:\nALT: 22 U/L (7-56)\nAST: 19 U/L (10-40)\nALP: 80 U/L (44-147)\nBilirubin: 0.7 mg/dL (0.1-1.2)\nINTERPRETATION:\nAll values within normal range.\nFollow-up recommended in 1 year.`,
    patient: {
      id: 'P-11223',
      name: 'Carol White',
      age: 38,
      gender: 'Female',
    },
    metadata: {
      testType: 'Liver Function',
      orderedBy: 'Dr. Kim',
      reportedBy: 'Central Diagnostics',
    },
    pdfUrl: `/pdfs/report-6.pdf`,
  },
  {
    id: 'report-7',
    title: 'Electrolyte Panel',
    provider: 'QuickLab',
    date: '2025-06-25T15:45:00Z',
    content: `Patient: David Black\nAge: 50\nGender: Male\nTest: Electrolyte Panel\nDate: June 25, 2025\n\nRESULTS:\nSodium: 140 mmol/L (135-145)\nPotassium: 4.2 mmol/L (3.5-5.1)\nChloride: 102 mmol/L (98-107)\nBicarbonate: 25 mmol/L (22-29)\nINTERPRETATION:\nAll values within normal range.\nFollow-up recommended in 1 year.`,
    patient: {
      id: 'P-33445',
      name: 'David Black',
      age: 50,
      gender: 'Male',
    },
    metadata: {
      testType: 'Electrolyte',
      orderedBy: 'Dr. Singh',
      reportedBy: 'QuickLab',
    },
    pdfUrl: `/pdfs/report-7.pdf`,
  },
  {
    id: 'report-8',
    title: 'Vitamin D Test',
    provider: 'Sunrise Labs',
    date: '2025-06-28T08:20:00Z',
    content: `Patient: Emily Stone\nAge: 29\nGender: Female\nTest: Vitamin D Test\nDate: June 28, 2025\n\nRESULTS:\nVitamin D: 32 ng/mL (30-100)\nINTERPRETATION:\nSufficient vitamin D level.\nFollow-up recommended in 1 year.`,
    patient: {
      id: 'P-55667',
      name: 'Emily Stone',
      age: 29,
      gender: 'Female',
    },
    metadata: {
      testType: 'Vitamin D',
      orderedBy: 'Dr. Adams',
      reportedBy: 'Sunrise Labs',
    },
    pdfUrl: `/pdfs/report-8.pdf`,
  },
  {
    id: 'report-9',
    title: 'Electrolyte Panel',
    provider: 'Sunrise Labs',
    date: '2025-07-01T10:00:00Z',
    content: `Patient: Alice Brown\nAge: 60\nGender: Female\nTest: Electrolyte Panel\nDate: July 1, 2025\n\nRESULTS:\nSodium: 130 mmol/L (135-145) - LOW\nPotassium: 4.0 mmol/L (3.5-5.1)\nChloride: 101 mmol/L (98-107)\nBicarbonate: 24 mmol/L (22-29)\nINTERPRETATION:\nHyponatremia detected. Follow-up recommended in 1 month.`,
    patient: {
      id: 'P-67890',
      name: 'Alice Brown',
      age: 60,
      gender: 'Female',
    },
    metadata: {
      testType: 'Electrolyte',
      orderedBy: 'Dr. Lee',
      reportedBy: 'City Hospital Lab',
    },
    pdfUrl: `/pdfs/report-9.pdf`,
  },
  {
    id: 'report-10',
    title: 'Vitamin B12 Test',
    provider: 'Sunrise Labs',
    date: '2025-07-03T09:30:00Z',
    content: `Patient: Bob Green\nAge: 45\nGender: Male\nTest: Vitamin B12 Test\nDate: July 3, 2025\n\nRESULTS:\nVitamin B12: 120 pg/mL (200-900) - LOW\nINTERPRETATION:\nVitamin B12 deficiency detected. Follow-up recommended in 3 months.`,
    patient: {
      id: 'P-54321',
      name: 'Bob Green',
      age: 45,
      gender: 'Male',
    },
    metadata: {
      testType: 'Vitamin B12',
      orderedBy: 'Dr. Patel',
      reportedBy: 'MediLab Services',
    },
    pdfUrl: `/pdfs/report-10.pdf`,
  },
  {
    id: 'report-11',
    title: 'Basic Metabolic Panel',
    provider: 'QuickLab',
    date: '2025-07-05T11:15:00Z',
    content: `Patient: Carol White\nAge: 38\nGender: Female\nTest: Basic Metabolic Panel\nDate: July 5, 2025\n\nRESULTS:\nGlucose: 110 mg/dL (70-99) - HIGH\nCalcium: 9.2 mg/dL (8.5-10.5)\nSodium: 138 mmol/L (135-145)\nPotassium: 4.1 mmol/L (3.5-5.1)\nINTERPRETATION:\nMild hyperglycemia detected. Follow-up recommended in 2 weeks.`,
    patient: {
      id: 'P-11223',
      name: 'Carol White',
      age: 38,
      gender: 'Female',
    },
    metadata: {
      testType: 'Basic Metabolic Panel',
      orderedBy: 'Dr. Kim',
      reportedBy: 'Central Diagnostics',
    },
    pdfUrl: `/pdfs/report-11.pdf`,
  },
  {
    id: 'report-12',
    title: 'Calcium Test',
    provider: 'Central Diagnostics',
    date: '2025-07-07T14:00:00Z',
    content: `Patient: David Black\nAge: 50\nGender: Male\nTest: Calcium Test\nDate: July 7, 2025\n\nRESULTS:\nCalcium: 7.5 mg/dL (8.5-10.5) - LOW\nINTERPRETATION:\nHypocalcemia detected. Follow-up recommended in 2 weeks.`,
    patient: {
      id: 'P-33445',
      name: 'David Black',
      age: 50,
      gender: 'Male',
    },
    metadata: {
      testType: 'Calcium',
      orderedBy: 'Dr. Singh',
      reportedBy: 'QuickLab',
    },
    pdfUrl: `/pdfs/report-12.pdf`,
  },
  {
    id: 'report-13',
    title: 'Iron Panel',
    provider: 'QuickLab',
    date: '2025-07-10T08:45:00Z',
    content: `Patient: Emily Stone\nAge: 29\nGender: Female\nTest: Iron Panel\nDate: July 10, 2025\n\nRESULTS:\nSerum Iron: 85 ug/dL (60-170)\nTIBC: 320 ug/dL (250-370)\nTransferrin Saturation: 27% (20-50)\nINTERPRETATION:\nAll values within normal range.`,
    patient: {
      id: 'P-55667',
      name: 'Emily Stone',
      age: 29,
      gender: 'Female',
    },
    metadata: {
      testType: 'Iron Panel',
      orderedBy: 'Dr. Adams',
      reportedBy: 'Sunrise Labs',
    },
    pdfUrl: `/pdfs/report-13.pdf`,
  },
  {
    id: 'report-14',
    title: 'Basic Metabolic Panel',
    provider: 'QuickLab',
    date: '2025-07-12T10:30:00Z',
    content: `Patient: Alice Brown\nAge: 60\nGender: Female\nTest: Basic Metabolic Panel\nDate: July 12, 2025\n\nRESULTS:\nGlucose: 92 mg/dL (70-99)\nCalcium: 9.0 mg/dL (8.5-10.5)\nSodium: 137 mmol/L (135-145)\nPotassium: 4.3 mmol/L (3.5-5.1)\nINTERPRETATION:\nAll values within normal range.`,
    patient: {
      id: 'P-67890',
      name: 'Alice Brown',
      age: 60,
      gender: 'Female',
    },
    metadata: {
      testType: 'Basic Metabolic Panel',
      orderedBy: 'Dr. Singh',
      reportedBy: 'QuickLab',
    },
    pdfUrl: `/pdfs/report-14.pdf`,
  },
  {
    id: 'report-15',
    title: 'Liver Function Test',
    provider: 'Central Diagnostics',
    date: '2025-07-14T09:00:00Z',
    content: `Patient: Bob Green\nAge: 45\nGender: Male\nTest: Liver Function Test\nDate: July 14, 2025\n\nRESULTS:\nALT: 20 U/L (7-56)\nAST: 18 U/L (10-40)\nALP: 78 U/L (44-147)\nBilirubin: 0.8 mg/dL (0.1-1.2)\nINTERPRETATION:\nAll values within normal range.`,
    patient: {
      id: 'P-54321',
      name: 'Bob Green',
      age: 45,
      gender: 'Male',
    },
    metadata: {
      testType: 'Liver Function',
      orderedBy: 'Dr. Kim',
      reportedBy: 'Central Diagnostics',
    },
    pdfUrl: `/pdfs/report-15.pdf`,
  },
  {
    id: 'report-16',
    title: 'Vitamin D Test',
    provider: 'Sunrise Labs',
    date: '2025-07-16T08:20:00Z',
    content: `Patient: Carol White\nAge: 38\nGender: Female\nTest: Vitamin D Test\nDate: July 16, 2025\n\nRESULTS:\nVitamin D: 30 ng/mL (30-100)\nINTERPRETATION:\nSufficient vitamin D level.`,
    patient: {
      id: 'P-11223',
      name: 'Carol White',
      age: 38,
      gender: 'Female',
    },
    metadata: {
      testType: 'Vitamin D',
      orderedBy: 'Dr. Adams',
      reportedBy: 'Sunrise Labs',
    },
    pdfUrl: `/pdfs/report-16.pdf`,
  },
  {
    id: 'report-17',
    title: 'Renal Function Panel',
    provider: 'City Hospital Lab',
    date: '2025-07-18T11:00:00Z',
    content: `Patient: David Black\nAge: 50\nGender: Male\nTest: Renal Function Panel\nDate: July 18, 2025\n\nRESULTS:\nBUN: 17 mg/dL (7-20)\nCreatinine: 1.1 mg/dL (0.6-1.3)\nGFR: 82 mL/min (>60)\nINTERPRETATION:\nAll values within normal range.`,
    patient: {
      id: 'P-33445',
      name: 'David Black',
      age: 50,
      gender: 'Male',
    },
    metadata: {
      testType: 'Renal Function',
      orderedBy: 'Dr. Lee',
      reportedBy: 'City Hospital Lab',
    },
    pdfUrl: `/pdfs/report-17.pdf`,
  },
  {
    id: 'report-18',
    title: 'Blood Chemistry Analysis',
    provider: 'MediLab Services',
    date: '2025-07-20T10:15:00Z',
    content: `Patient: Emily Stone\nAge: 29\nGender: Female\nTest: Blood Chemistry Analysis\nDate: July 20, 2025\n\nRESULTS:\nGlucose (fasting): 130 mg/dL [Reference: 65-95 mg/dL] - HIGH\nHbA1c: 6.0% [Reference: 4.0-5.6%] - HIGH\nWBC Count: 6.9 x 10^3/uL [Reference: 4.5-11.0 x 10^3/uL]\nINTERPRETATION:\nHyperglycemia and elevated HbA1c detected. Follow-up recommended in 2 weeks.`,
    patient: {
      id: 'P-55667',
      name: 'Emily Stone',
      age: 29,
      gender: 'Female',
    },
    metadata: {
      testType: 'Blood Chemistry',
      orderedBy: 'Dr. Robert Chen',
      reportedBy: 'MediLab Services',
    },
    pdfUrl: `/pdfs/report-18.pdf`,
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