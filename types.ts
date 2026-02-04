
export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface ContractClause {
  title: string;
  whatItMeans: string;
  whyItMatters: string;
  riskLevel: RiskLevel;
  watchOutIf: string;
}

export interface AnalysisResult {
  overview: {
    contractType: string;
    whoItMainlyProtects: string;
    overallTone: string;
  };
  clauses: ContractClause[];
  redFlags: string[];
  summary: {
    overallRiskLevel: RiskLevel;
    plainVerdict: string;
  };
  checklist: string[];
  sources?: { uri: string; title: string }[];
}

export interface ContractFile {
  base64: string;
  mimeType: string;
  name: string;
}
