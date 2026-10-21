import { analyzeELF } from './linux/elf-analyzer.js';
import { collectSystemOverview, inspectProcStatus } from './linux/system-overview.js';

export interface AnalysisReport {
  target: string;
  summary: string;
  elf: ReturnType<typeof analyzeELF> extends Promise<infer T> ? T : never;
  system: ReturnType<typeof collectSystemOverview>;
  proc: ReturnType<typeof inspectProcStatus>;
}

export async function runLinuxAnalysis(target: string): Promise<AnalysisReport> {
  const elf = await analyzeELF(target);
  const system = collectSystemOverview();
  const proc = inspectProcStatus();

  const summary = elf.isELF
    ? `Target appears to be an ELF binary (${elf.bitness}, ${elf.machine}). It is suitable for Linux-native static inspection.`
    : `Target is not recognized as a standard ELF binary. It may be a script, resource, or non-native artifact.`;

  return {
    target,
    summary,
    elf,
    system,
    proc
  };
}
