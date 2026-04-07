---
name: gsd:review
description: Request cross-AI peer review of phase plans from external AI CLIs
argument-hint: "--phase N [--gemini] [--claude] [--codex] [--all]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

<objective>
Invoke external AI CLIs (Gemini, Claude, Codex) to independently review phase plans.
Produces a structured REVIEWS.md with per-reviewer feedback that can be fed back into
planning via /gsd:plan-phase --reviews.

**Flow:** Detect CLIs â†?Build review prompt â†?Invoke each CLI â†?Collect responses â†?Write REVIEWS.md
</objective>

<execution_context>
@$HOME/.trae-cn/get-shit-done/workflows/review.md
</execution_context>

<context>
Phase number: extracted from $ARGUMENTS (required)

**Flags:**
- `--gemini` â€?Include Gemini CLI review
- `--claude` â€?Include Claude CLI review (uses separate session)
- `--codex` â€?Include Codex CLI review
- `--all` â€?Include all available CLIs
</context>

<process>
Execute the review workflow from @$HOME/.trae-cn/get-shit-done/workflows/review.md end-to-end.
</process>
