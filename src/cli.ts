#!/usr/bin/env node
import { parseArgs } from './core/command-parser.js';
import { renderJsonReport, renderTextReport } from './core/report-writer.js';
import { runLinuxAnalysis } from './linux/analysis.js';

function printHelp(): void {
  console.log('Usage: rea-anything-with-ai [analyze] --target <path> [--json] [--verbose]');
  console.log('');
  console.log('Examples:');
  console.log('  rea-anything-with-ai --help');
  console.log('  rea-anything-with-ai analyze --target /bin/ls');
  console.log('  rea-anything-with-ai analyze --target /bin/ls --json');
}

async function main(): Promise<void> {
  const parsed = parseArgs(process.argv.slice(2));

  if (parsed.command === 'help') {
    printHelp();
    return;
  }

  const report = await runLinuxAnalysis(parsed.target);
  const output = parsed.json ? renderJsonReport(report) : renderTextReport(report);

  if (parsed.verbose) {
    console.log('[rea-anything-with-ai] verbose mode enabled');
  }

  console.log(output);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error('[rea-anything-with-ai] Fatal error:', message);
  process.exit(1);
});
