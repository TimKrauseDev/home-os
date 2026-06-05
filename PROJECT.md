# Home OS Project Overview

This document captures product and architecture context for Home OS. test

Use `AGENTS.md` for agent working instructions. Use this file for what the project is, how it is shaped, and why decisions were made.

## Purpose

Home OS is a locally hosted household management application.

The project is meant to track more than finances. It should become a private home operations hub for household money, maintenance, projects, gardening, and future freelance workflows.

The application is intended for one household only, with no outside users. It should prioritize practical daily use, clear records, and long-term household memory over broad multi-user SaaS concerns.

## Target Users

- The household running this local app.
- Homeowners managing maintenance, improvements, budgets, and recurring responsibilities.
- Future portfolio or resume viewers, but only through placeholder or demo data rather than private household data.

## Core Workflows

- Home maintenance: schedule and track recurring maintenance tasks by monthly, seasonal, and yearly cadence.
- Home improvement projects: manage project todos, build items, notes, references, status, pricing, and related details.
- Budgeting: track household finances for the user and spouse, similar in spirit to Monarch-style budgeting.
- Budgeting details: show money in, money out, spending categories, category goals, savings, and monthly spending patterns.
- Freelance: reserved for future workflows and ideas.
- Gardening: maintain a seed list, comments on seeds, planting timing, plant comments, and plant ratings.

## Current Features

- To be documented as features are confirmed.

## Planned Features

- Home maintenance schedules.
- Home improvement project tracker.
- Household budgeting and spending categories.
- Savings and spending goals.
- Freelance workflow area.
- Gardening seed and plant tracker.
- Placeholder or demo data mode suitable for public portfolio or resume use.

## Architecture

- Hosting model: local-only application for household use.
- External users: none planned.
- Private data should remain separate from any future demo or placeholder data.
- Stack: to be confirmed from the codebase.
- Main app entry points: to be documented.
- Important modules: to be documented.

## Data Model

- Likely major domains: maintenance tasks, home projects, budget transactions, budget categories, savings goals, freelance records, seeds, plants, notes, references, and prices.
- Exact entities and persistence model: to be documented as implementation decisions are confirmed.

## Integrations

- No outside sources are required for the initial household app.
- Future imports or integrations should be evaluated carefully because this app contains private household data.

## Decisions

- Keep project overview and agent instructions separate.
- Store durable project memory in repository docs rather than relying on chat history.
- Treat Home OS as a broad household operations app, not only a finance app.
- Build for local household use first.
- Support future placeholder/demo data without exposing private data.

## Open Questions

- What is the primary package manager and development command?
- What financial workflows should be prioritized first?
- What data should be stored locally versus synced or imported?
- Should each domain have its own top-level section, or should the app start with a unified dashboard?
- What data storage approach best fits local-only use?
- How should demo data be separated from real household data?
