# REA Anything With AI

A Linux-first AI-assisted reverse engineering and software analysis toolkit inspired by REA.

This project is built for local analysis of Linux binaries, runtime behavior, process state, and security-relevant artifacts. It aims to be faster, cleaner, and more operationally friendly than a large desktop-only reverse-engineering environment.

## Why this project

- Linux-first workflow
- Strong CLI and automation support
- Lightweight local analysis with minimal dependencies
- Better fit for research labs, security workstations, and CI environments
- Structured output for AI and automation pipelines

## Core goals

- Inspect ELF binaries and native artifacts
- Collect OS and process metadata
- Surface practical evidence from Linux systems
- Produce consistent textual and JSON reports
- Serve as a solid base for future AI-assisted reverse engineering agents

## Project status

This repository is a working foundation and an active Linux-focused starter project. It is intentionally designed to be extended with:

- advanced ELF analysis
- function and symbol extraction
- string/section inspection
- process and dependency mapping
- agent/MCP integration
- cloud or local AI workflows

## Attribution

This project is inspired by the original REA repository from morluto/rea.

Original repo:
https://github.com/morluto/rea

This project is a Linux-optimized, independent implementation intended for local experimentation and deployment.

## Quick start

```bash
npm install
npm run build
npm run dev -- analyze --target /bin/ls --json
```

## Commands

```bash
npm run dev -- --help
npm run dev -- analyze --target /bin/ls
npm run dev -- analyze --target /bin/ls --json
```

## Example output

```text
$ npm run dev -- analyze --target /bin/ls

[rea-anything-with-ai] target: /bin/ls
[rea-anything-with-ai] platform: linux
[rea-anything-with-ai] file-type: ELF 64-bit LSB pie executable x86-64
[rea-anything-with-ai] bitness: 64-bit
[rea-anything-with-ai] machine: x86-64
[rea-anything-with-ai] summary: ELF binary detected and suitable for local native analysis.
[rea-anything-with-ai] kernel: Linux 6.8.0-...
[rea-anything-with-ai] processes: 8 entries inspected
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
    elf-analyzer.ts
    process-inspector.ts
    system-overview.ts
```

## Linux focus

The default workflow assumes that standard Linux utilities are available, including:

- /proc
- file
- readelf
- objdump
- ps
- ldd

This is designed for local lab work, reverse engineering exercises, and environment analysis under Linux.

## Security and ethics

This tool is intended for lawful research, authorized analysis, education, and software interoperability work. Do not use it on systems or targets that you do not own or are not explicitly authorized to inspect.

## License

MIT

## Arabic summary

هذا المشروع هو نسخة Linux-first ومُحسّنة من فكرة REA، موجهة لتحليل الملفات الثنائية، النظام، والعمليات محليًا. الهدف أن يكون أسهل في التشغيل، أسرع في الاستخدام، وأن يوفر تقارير واضحة قابلة للتحليل من قبل الذكاء الاصطناعي أو الإنسان.
