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
  error?: string;
}

export async function analyzeELF(filePath: string): Promise<ELFAnalysisResult> {
  if (!filePath) {
    return {
      path: '',
      exists: false,
      isELF: false,
      bitness: 'unknown',
      machine: 'unknown',
      fileType: 'missing',
      stripped: 'unknown',
      error: 'No target path provided.'
    };
  }

  const exists = existsSync(filePath);
  if (!exists) {
    return {
      path: filePath,
      exists: false,
      isELF: false,
      bitness: 'unknown',
      machine: 'unknown',
      fileType: 'missing',
      stripped: 'unknown',
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
      error: `Target is not a regular file: ${filePath}`
    };
  }

  try {
    const { stdout } = await execFileAsync('file', ['--brief', filePath], { encoding: 'utf8' });
    const fileOutput = stdout.trim();

    const isELF = /ELF/.test(fileOutput);
    const bitness = /64-bit/.test(fileOutput) ? '64-bit' : /32-bit/.test(fileOutput) ? '32-bit' : 'unknown';
    const machine = /x86-64/.test(fileOutput)
      ? 'x86-64'
      : /ARM/.test(fileOutput)
        ? 'ARM'
        : /AArch64/.test(fileOutput)
          ? 'AArch64'
          : 'unknown';

    const stripped = /stripped/.test(fileOutput) ? 'stripped' : 'not-stripped';

    return {
      path: filePath,
      exists: true,
      isELF,
      bitness,
      machine,
      fileType: fileOutput || 'unknown',
      stripped,
    };
  } catch (error) {
    return {
      path: filePath,
      exists: true,
      isELF: false,
      bitness: 'unknown',
      machine: 'unknown',
      fileType: 'unknown',
      stripped: 'unknown',
      error: error instanceof Error ? error.message : 'Unknown error while probing ELF metadata.'
    };
  }
}
