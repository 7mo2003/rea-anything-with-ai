# REA Anything With AI

A Linux-first AI-assisted reverse engineering and software analysis toolkit inspired by REA.

This project is designed for local analysis of Linux binaries, runtime behavior, process state, and security-related artifacts. It focuses on lightweight execution, structured output, and easy automation in Linux environments.

## Why this project

- Linux-first workflow
- Fast CLI-based operation
- Native ELF and system inspection
- Minimal dependency footprint
- Suitable for local analysis, research labs, and automation pipelines
- Built as a foundation for future AI/MCP integration

## What it does

- Detects ELF files and reports bitness and architecture
- Collects system metadata from Linux (`uname`, `/proc`, OS metadata)
- Inspects live process state and summary information
- Produces human-readable or JSON reports
- Provides a clean base to extend with advanced binary analysis features

## Core goals

- Local binary investigation
- Process, runtime, and environment discovery
- Evidence-oriented output
- Structured JSON for AI workflows
- Extension-friendly command-line design

## Attribution

This project is inspired by the REA repository by morluto/rea.

Original repository:
https://github.com/morluto/rea

This repo is an independent Linux-optimized implementation created for experimentation, local analysis, and controlled deployment.

## Quick start

```bash
npm install
npm run build
npm run dev -- analyze --target /bin/ls
npm run dev -- analyze --target /bin/ls --json
```

## CLI usage

```bash
npm run dev -- --help
npm run dev -- analyze --target /bin/ls
npm run dev -- analyze --target /usr/bin/ssh --json
```

## Example output

```text
$ npm run dev -- analyze --target /bin/ls

[rea-anything-with-ai] target: /bin/ls
[rea-anything-with-ai] summary: ELF binary detected (64-bit, x86-64). Target is suitable for local Linux-native analysis.
[rea-anything-with-ai] platform: linux
[rea-anything-with-ai] os-name: Ubuntu
[rea-anything-with-ai] arch: x64
[rea-anything-with-ai] kernel: Linux 6.8.0-...
[rea-anything-with-ai] memory-gb: 15.42
[rea-anything-with-ai] elf-detected: yes
[rea-anything-with-ai] bitness: 64-bit
[rea-anything-with-ai] machine: x86-64
[rea-anything-with-ai] file-type: ELF 64-bit LSB pie executable x86-64
[rea-anything-with-ai] stripped: unknown
[rea-anything-with-ai] running-processes: 10
```

## Architecture

```text
src/
  cli.ts
  index.ts
  core/
    command-parser.ts
    report-writer.ts
    types.ts
  linux/
    analysis.ts
    elf-analyzer.ts
    system-overview.ts
```

## Linux focus

This project assumes common Linux tooling is available on the system, including:

- /proc
- readelf
- objdump
- file
- ldd
- uname
- ps

It is designed for local lab work, reverse engineering exercises, and environment analysis under Linux.

## Security and ethics

This project is intended for lawful research, authorized analysis, software interoperability, and education. Do not use it on systems or targets without explicit authorization.

## License

MIT

## Arabic summary

هذا المشروع هو نسخة Linux-first ومُحسّنة من فكرة REA، موجهة لتحليل الملفات الثنائية، النظام والعمليات محليًا. الهدف هو جعل التحليل أسهل وأسرع وأكثر فاعلية في بيئة Linux، مع تقارير واضحة وقابلة للذكاء الاصطناعي أو الاستخدام اليدوي.
