export type OutputFormat = 'text' | 'json';
export type AnalysisMode = 'analyze' | 'help';

export interface ParsedArgs {
  command: AnalysisMode;
  target: string;
  json: boolean;
  verbose: boolean;
}

export interface ReportContext {
  target: string;
  timestamp: string;
}
