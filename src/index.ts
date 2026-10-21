import { analyzeELF } from './elf-analyzer.js';
import { collectSystemOverview, inspectProcesses, inspectProcStatus } from './system-overview.js';

export interface AnalysisSummary {
  target: string;
  summary: string;
  elf: Awaited<ReturnType<typeof analyzeELF>>;
  system: ReturnType<typeof collectSystemOverview>;
  processInfo: ReturnType<typeof inspectProcStatus>;
  runningProcesses: ReturnType<typeof inspectProcesses>;
}

export async function runLinuxAnalysis(target: string): Promise<AnalysisSummary> {
  const elf = await analyzeELF(target);
  const system = collectSystemOverview();
  const processInfo = inspectProcStatus();
  const runningProcesses = inspectProcesses(10);

  const summary = elf.isELF
    ? `ELF binary detected (${elf.bitness}, ${elf.machine}). Target is suitable for local Linux-native analysis.`
    : `Target is not recognized as a standard ELF binary. It may be a script, resource, or non-native artifact.`;

  return {
    target,
    summary,
    elf,
    system,
    processInfo,
    runningProcesses
  };
}
