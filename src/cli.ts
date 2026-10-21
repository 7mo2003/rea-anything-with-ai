export function renderTextReport(report: any): string {
  const lines: string[] = [];
  lines.push(`[rea-anything-with-ai] target: ${report.target}`);
  lines.push(`[rea-anything-with-ai] summary: ${report.summary}`);
  lines.push(`[rea-anything-with-ai] platform: ${report.system.platform}`);
  lines.push(`[rea-anything-with-ai] os-name: ${report.system.osName}`);
  lines.push(`[rea-anything-with-ai] arch: ${report.system.arch}`);
  lines.push(`[rea-anything-with-ai] kernel: ${report.system.kernel}`);
  lines.push(`[rea-anything-with-ai] memory-gb: ${report.system.totalMemoryGB}`);
  lines.push(`[rea-anything-with-ai] elf-detected: ${report.elf.isELF ? 'yes' : 'no'}`);
  lines.push(`[rea-anything-with-ai] bitness: ${report.elf.bitness}`);
  lines.push(`[rea-anything-with-ai] machine: ${report.elf.machine}`);
  lines.push(`[rea-anything-with-ai] file-type: ${report.elf.fileType}`);
  lines.push(`[rea-anything-with-ai] stripped: ${report.elf.stripped}`);
  lines.push(`[rea-anything-with-ai] running-processes: ${report.runningProcesses.length}`);

  if (report.elf.dependencies.length > 0) {
    lines.push('[rea-anything-with-ai] dependencies:');
    for (const dep of report.elf.dependencies) {
      lines.push(`  - ${dep}`);
    }
  }

  return lines.join('\n');
}

export function renderJsonReport(report: any): string {
  return JSON.stringify(report, null, 2);
}
