import type { ParsedArgs } from './types.js';

export function parseArgs(argv: string[]): ParsedArgs {
  const args = [...argv];

  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    return {
      command: 'help',
      target: '/bin/ls',
      json: false,
      verbose: false
    };
  }

  let command: ParsedArgs['command'] = 'analyze';
  let target = '/bin/ls';
  let json = false;
  let verbose = false;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === 'analyze') {
      command = 'analyze';
      continue;
    }

    if (arg === 'help' || arg === '--help' || arg === '-h') {
      command = 'help';
      continue;
    }

    if (arg === '--target' || arg === '-t') {
      target = args[i + 1] ?? target;
      i += 1;
      continue;
    }

    if (arg.startsWith('--target=')) {
      target = arg.slice('--target='.length);
      continue;
    }

    if (arg === '--json') {
      json = true;
      continue;
    }

    if (arg === '--verbose' || arg === '-v') {
      verbose = true;
      continue;
    }

    if (!arg.startsWith('-')) {
      target = arg;
    }
  }

  return { command, target, json, verbose };
}
