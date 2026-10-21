import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import os from 'node:os';

export interface SystemOverview {
  platform: string;
  arch: string;
  kernel: string;
  totalMemoryGB: number;
  cpus: number;
  hostname: string;
  user: string;
}

export function collectSystemOverview(): SystemOverview {
  const uname = execFileSync('uname', ['-a'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const memInfo = readFileSync('/proc/meminfo', 'utf8');
  const memoryMatch = memInfo.match(/MemTotal:\s+(\d+)\s+kB/);
  const totalMemoryGB = memoryMatch ? Number(memoryMatch[1]) / 1024 / 1024 : 0;

  return {
    platform: process.platform,
    arch: process.arch,
    kernel: uname,
    totalMemoryGB: Number(totalMemoryGB.toFixed(2)),
    cpus: os.cpus().length,
    hostname: os.hostname(),
    user: process.env.USER ?? 'unknown'
  };
}

export function inspectProcStatus(): Record<string, string> {
  if (!existsSync('/proc/self/status')) {
    return { status: 'not-available' };
  }

  const status = readFileSync('/proc/self/status', 'utf8');
  const lines = status.split(/\r?\n/);
  const result: Record<string, string> = {};

  for (const line of lines) {
    const idx = line.indexOf(':');
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      result[key] = value;
    }
  }

  return result;
}
