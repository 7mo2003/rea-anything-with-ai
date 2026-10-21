import { existsSync, statSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export interface ELFAnalysisResult {
  path: string;
  exists: boolean;
  isELF: boolean;
  bitness: string;
  machine: string;
  fileType: string;
  stripped: string;
  entryPoint?: string;
  dependencies: string[];
  error?: string;
}

function safeExec(command: string, args: string[]): string {
  try {
    return execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch {
    return '';
  }
}

export async function analyzeELF(filePath: string): Promise<ELFAnalysisResult> {
  if (!filePath || !filePath.trim()) {
    return {
      path: '',
      exists: false,
      isELF: false,
      bitness: 'unknown',
      machine: 'unknown',
      fileType: 'missing',
      stripped: 'unknown',
      dependencies: [],
      error: 'No target provided.'
    };
  }

  if (!existsSync(filePath)) {
    return {
      path: filePath,
      exists: false,
      isELF: false,
      bitness: 'unknown',
      machine: 'unknown',
      fileType: 'missing',
      stripped: 'unknown',
      dependencies: [],
      error: `Target not found: ${filePath}`
    };
  }

  const stats = statSync(filePath);
  if (!stats.isFile()) {
    return {
      path: filePath,
      exists: true,
      isELF: false,
      bitness: 'unknown',
      machine: 'unknown',
      fileType: 'not-a-file',
      stripped: 'unknown',
      dependencies: [],
      error: `Target is not a regular file: ${filePath}`
    };
  }

  let fileOutput = '';
  try {
    const result = await execFileAsync('file', ['--brief', filePath], { encoding: 'utf8' });
    fileOutput = result.stdout.trim();
  } catch {
    fileOutput = '';
  }

  const isELF = /ELF/.test(fileOutput) || safeExec('readelf', ['-h', filePath]).includes('ELF');

  if (!isELF) {
    return {
      path: filePath,
      exists: true,
      isELF: false,
      bitness: 'unknown',
      machine: 'unknown',
      fileType: fileOutput || 'unknown',
      stripped: 'unknown',
      dependencies: [],
      error: 'Target is not recognized as an ELF file.'
    };
  }

  const readelfOutput = safeExec('readelf', ['-h', filePath]);
  const objdumpOutput = safeExec('objdump', ['-f', filePath]);

  const bitness = /64-bit/.test(fileOutput) || readelfOutput.includes('Class:') && readelfOutput.includes('ELF64')
    ? '64-bit'
    : /32-bit/.test(fileOutput) || readelfOutput.includes('ELF32')
      ? '32-bit'
      : 'unknown';

  const machine = /x86-64/.test(fileOutput) || /x86-64/.test(objdumpOutput)
    ? 'x86-64'
    : /ARM/.test(fileOutput) || /arm/.test(objdumpOutput)
      ? 'ARM'
      : /AArch64/.test(fileOutput) || /aarch64/.test(objdumpOutput)
        ? 'AArch64'
        : /RISC-V/.test(fileOutput) || /risc-v/.test(objdumpOutput)
          ? 'RISC-V'
          : 'unknown';

  const stripped = /stripped/.test(fileOutput) || /not stripped/.test(fileOutput) ? ( /stripped/.test(fileOutput) ? 'stripped' : 'not-stripped') : 'unknown';

  const entryMatch = /entry point.*?0x([0-9a-fA-F]+)/i.test(objdumpOutput)
    ? objdumpOutput.match(/entry point.*?0x([0-9a-fA-F]+)/i)?.[1]
    : readelfOutput.match(/Entry point address:\s*(0x[0-9a-fA-F]+)/i)?.[1];

  const deps: string[] = [];
  const lddOutput = safeExec('ldd', [filePath]);
  if (lddOutput) {
    for (const line of lddOutput.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (trimmed) deps.push(trimmed);
    }
  }

  return {
    path: filePath,
    exists: true,
    isELF: true,
    bitness,
    machine,
    fileType: fileOutput || 'ELF binary',
    stripped,
    entryPoint: entryMatch ? `0x${entryMatch}` : undefined,
    dependencies: deps
  };
}
