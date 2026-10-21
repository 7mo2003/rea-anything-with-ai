import { existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

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
    return execFileSync(command, args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    }).trim();
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

  const fileOutput = safeExec('file', ['--brief', filePath]);
  const readelfOutput = safeExec('readelf', ['-h', filePath]);
  const objdumpOutput = safeExec('objdump', ['-f', filePath]);

  const isELF = /ELF/.test(fileOutput) || readelfOutput.includes('ELF');
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

  const bitness = /64-bit/.test(fileOutput) || readelfOutput.includes('ELF64')
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

  const stripped = /stripped/.test(fileOutput)
    ? 'stripped'
    : /not stripped/.test(fileOutput)
      ? 'not-stripped'
      : 'unknown';

  const entryMatch = /entry point.*?0x([0-9a-fA-F]+)/i.test(objdumpOutput)
    ? objdumpOutput.match(/entry point.*?0x([0-9a-fA-F]+)/i)?.[1]
    : readelfOutput.match(/Entry point address:\s*(0x[0-9a-fA-F]+)/i)?.[1];

  const dependencies: string[] = [];
  const lddOutput = safeExec('ldd', [filePath]);
  if (lddOutput) {
    for (const line of lddOutput.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (trimmed) dependencies.push(trimmed);
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
    dependencies
  };
}
