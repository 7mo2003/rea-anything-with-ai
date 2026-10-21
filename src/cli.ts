#!/usr/bin/env node
import { runLinuxAnalysis } from './index.js';

async function main() {
  const args = process.argv.slice(2);
  const targetArg = args.find((arg) => arg.startsWith('--target='));
  const target = targetArg ? targetArg.split('=')[1] : args[0] ?? '/bin/ls';

  console.log(`[linux-analysis] Target: ${target}`);

  const report = await runLinuxAnalysis(target);

  console.log(`[linux-analysis] Summary: ${report.summary}`);
  console.log(`[linux-analysis] OS: ${report.system.platform} ${report.system.arch}`);
  console.log(`[linux-analysis] Kernel: ${report.system.kernel}`);
  console.log(`[linux-analysis] CPUs: ${report.system.cpus}`);
  console.log(`[linux-analysis] Memory: ${report.system.totalMemoryGB} GB`);
  console.log(`[linux-analysis] ELF detected: ${report.elf.isELF ? 'yes' : 'no'}`);
  console.log(`[linux-analysis] Bitness: ${report.elf.bitness}`);
  console.log(`[linux-analysis] Machine: ${report.elf.machine}`);
  console.log(`[linux-analysis] File type: ${report.elf.fileType}`);

  if (report.elf.error) {
    console.warn(`[linux-analysis] Warning: ${report.elf.error}`);
  }
}

main().catch((error) => {
  console.error('[linux-analysis] Fatal error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
