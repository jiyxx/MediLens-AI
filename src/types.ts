export interface MedicalParameter {
  name: string;
  value: string;
  unit: string;
  normalRange: string;
  meaning: string;
  status: 'Normal' | 'Abnormal' | 'Critical' | 'Unknown';
  explanation?: string; // Single sentence explanation
}

export interface HealthReportAnalysis {
  summary: string;
  parameters: MedicalParameter[];
  abnormalities: string[];
  possibleCauses: string[];
  lifestyleSuggestions: string[];
  followUpConsiderations: string[];
  disclaimer: string;
  rawText?: string;
  confidenceScore?: number;
}

export interface FileData {
  file: File;
  previewUrl: string | null;
  base64: string;
  mimeType: string;
}