---
name: gsd:plan-phase
description: Create detailed phase plan (PLAN.md) with verification loop
argument-hint: "[phase] [--auto] [--research] [--skip-research] [--gaps] [--skip-verify] [--prd <file>] [--reviews] [--text]"
agent: gsd-planner
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - Task
  - WebFetch
  - mcp__context7__*
---
<objective>
Create executable phase prompts (PLAN.md files) for a roadmap phase with integrated research and verification.

**Default flow:** Research (if needed) â†?Plan â†?Verify â†?Done

**Orchestrator role:** Parse arguments, validate phase, research domain (unless skipped), spawn gsd-planner, verify with gsd-plan-checker, iterate until pass or max iterations, present results.
</objective>

<execution_context>
@$HOME/.trae-cn/get-shit-done/workflows/plan-phase.md
@$HOME/.trae-cn/get-shit-done/references/ui-brand.md
</execution_context>

<context>
Phase number: $ARGUMENTS (optional â€?auto-detects next unplanned phase if omitted)

**Flags:**
- `--research` â€?Force re-research even if RESEARCH.md exists
- `--skip-research` â€?Skip research, go straight to planning
- `--gaps` â€?Gap closure mode (reads VERIFICATION.md, skips research)
- `--skip-verify` â€?Skip verification loop
- `--prd <file>` â€?Use a PRD/acceptance criteria file instead of discuss-phase. Parses requirements into CONTEXT.md automatically. Skips discuss-phase entirely.
- `--reviews` â€?Replan incorporating cross-AI review feedback from REVIEWS.md (produced by `/gsd:review`)
- `--text` â€?Use plain-text numbered lists instead of TUI menus (required for `/rc` remote sessions)

Normalize phase input in step 2 before any directory lookups.
</context>

<process>
Execute the plan-phase workflow from @$HOME/.trae-cn/get-shit-done/workflows/plan-phase.md end-to-end.
Preserve all workflow gates (validation, research, planning, verification loop, routing).
</process>
