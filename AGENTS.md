# AGENTS.md

This file is the durable project memory for coding agents working in this repository.
Read it at the start of each session before making changes.

For product and architecture context, also read `PROJECT.md`.

## Project

Home OS is the working project in this repository.

Keep product intent, architecture notes, setup commands, and active decisions here as they become known. Do not rely on chat memory for important project context.

## Working Agreements

- Inspect the existing codebase before editing.
- Prefer local patterns, dependencies, and naming conventions already present in the repo.
- Keep changes focused on the user's request.
- Do not revert or overwrite user changes unless explicitly asked.
- Use `rg` or `rg --files` for searching when available.
- Use `apply_patch` for manual file edits.
- Run relevant tests or checks when practical, and report any that could not be run.

## Project Notes

- Add setup commands here once confirmed.
- Add development server commands here once confirmed.
- Add test, lint, typecheck, and build commands here once confirmed.
- Add important architecture decisions here as the project takes shape.

## Current TODOs

- Confirm project stack and package manager.
- Document common commands.
- Document main app entry points.
