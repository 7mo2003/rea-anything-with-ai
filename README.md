# REA Anything With AI

A Linux-first reverse-engineering and software analysis toolkit inspired by REA, designed to be lighter, faster, and easier to run on Linux environments.

This project is a clean, independent starting point for building an AI-assisted analysis workflow for binaries, applications, and runtime behavior on Linux. It focuses on efficiency, shell integration, readable output, and analyst-friendly workflows.

## Why this version

- Linux-first design and tooling assumptions
- Faster local analysis workflows without heavy GUI dependencies
- Cleaner command-line interfaces and structured JSON output
- Better fit for CI, servers, containers, and lab environments
- Built with modern Node.js + TypeScript for maintainability

## Attribution

This project is inspired by the original REA project by morluto/rea.

Original repository:
https://github.com/morluto/rea

The original project remains the reference for large-scale reverse-engineering tooling. This repo is a leaner, Linux-optimized starting point intended for independent deployment and experimentation.

## Features

- ELF binary inspection
- Process and runtime inspection
- Linux system overview collection
- Structured evidence output
- CLI-driven analysis flow
- JSON export for automation and AI pipelines
- Prepared for MCP/agent integration in later iterations

## Quick start

```bash
npm install
npm run build
npm run dev -- --target /bin/ls
```

## Example output

```bash
$ npm run dev -- --target /bin/ls

[linux-analysis] Target: /bin/ls
[linux-analysis] OS: Linux x86_64
[linux-analysis] ELF detected: yes
[linux-analysis] Bitness: 64-bit
[linux-analysis] Machine: x86-64
[linux-analysis] Stripped: unknown
[linux-analysis] Process inspect: available
[linux-analysis] Summary: binary is statically analyzable and suitable for local trace workflows
```

## Project structure

```text
src/
  cli.ts
  index.ts
  linux/
    elf-analyzer.ts
    process-inspector.ts
    system-overview.ts
  core/
    analysis-engine.ts
    report-writer.ts
```

## Linux focus

This version is optimized for Linux and assumes availability of standard tools such as:

- /proc
- ps
- file
- readelf
- ldd
- objdump
- bash/sh for automation

It is intentionally designed to be easier to deploy in development, build, and security lab environments than a full GUI-driven reverse-engineering workstation.

## Security and ethics

This project is for lawful research, software analysis of systems you own or are authorized to inspect, and educational experimentation. Do not use it against systems or targets without explicit authorization.

## License

MIT
