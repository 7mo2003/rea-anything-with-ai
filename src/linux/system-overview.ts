import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import os from 'node:os';

export interface SystemOverview {
  platform: string;
  osName: string;
  arch: string;
  kernel: string;
  totalMemoryGB: number;
  cpus: number;
  hostname: string;
  user: string;
}

export interface ProcessEntry {
  pid: number;
  name: string;
  state: string;
  memoryKB: number;
}

export function collectSystemOverview(): SystemOverview {
  const uname = execFileSync('uname', ['-a'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  }).trim();

  const osRelease = existsSync('/etc/os-release') ? readFileSync('/etc/os-release', 'utf8') : '';
  const memInfo = existsSync('/proc/meminfo') ? readFileSync('/proc/meminfo', 'utf8') : '';
  const memMatch = memInfo.match(/MemTotal:\s+(\d+)\s+kB/);
  const totalMemoryGB = memMatch ? Number((Number(memMatch[1]) / 1024 / 1024).toFixed(2)) : 0;

  const osNameMatch = osRelease.match(/^NAME="?(.+?)"?$/m);

  return {
    platform: process.platform,
    osName: osNameMatch ? osNameMatch[1].trim() : process.platform,
    arch: process.arch,
    kernel: uname,
    totalMemoryGB,
    cpus: os.cpus().length,
    hostname: os.hostname(),
    user: process.env.USER ?? process.env.USERNAME ?? 'unknown'
  };
}

export function inspectProcStatus(pid: number | null = null): Record<string, string> {
  const procPath = pid === null ? '/proc/self/status' : `/proc/${pid}/status`;

  if (!existsSync(procPath)) {
    return { status: 'not-available' };
  }

  const status = readFileSync(procPath, 'utf8');
  const result: Record<string, string> = {};

  for (const line of status.split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      result[key] = value;
    }
  }

  return result;
}

export function inspectProcesses(limit = 10): ProcessEntry[] {
  if (!existsSync('/proc')) {
    return [];
  }

  const entries: ProcessEntry[] = [];
  for (const item of readdirSync('/proc')) {
    if (!/^\d+$/.test(item)) continue;

    const pid = Number(item);
    const statusPath = `/proc/${pid}/status`;
    const commPath = `/proc/${pid}/comm`;

    if (!existsSync(statusPath) || !existsSync(commPath)) continue;

    try {
      const statusText = readFileSync(statusPath, 'utf8');
      const commText = readFileSync(commPath, 'utf8').trim();
      const stateMatch = statusText.match(/^State:\s+(\S+)/m);
      const memMatch = statusText.match(/^VmRSS:\s+(\d+)\s+kB/m);

      entries.push({
        pid,
        name: commText || 'unknown',
        state: stateMatch ? stateMatch[1] : 'unknown',
        memoryKB: memMatch ? Number(memMatch[1]) : 0
      });
    } catch {
      continue;
    }

    if (entries.length >= limit) break;
  }

  return entries;
}
