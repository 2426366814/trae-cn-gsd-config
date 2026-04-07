---
name: gsd:ui-phase
description: Generate UI design contract (UI-SPEC.md) for frontend phases
argument-hint: "[phase]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - Task
  - WebFetch
  - AskUserQuestion
  - mcp__context7__*
---
<objective>
Create a UI design contract (UI-SPEC.md) for a frontend phase.
Orchestrates gsd-ui-researcher and gsd-ui-checker.
Flow: Validate â†?Research UI â†?Verify UI-SPEC â†?Done
</objective>

<execution_context>
@$HOME/.trae-cn/get-shit-done/workflows/ui-phase.md
@$HOME/.trae-cn/get-shit-done/references/ui-brand.md
</execution_context>

<context>
Phase number: $ARGUMENTS â€?optional, auto-detects next unplanned phase if omitted.
</context>

<process>
Execute @$HOME/.trae-cn/get-shit-done/workflows/ui-phase.md end-to-end.
Preserve all workflow gates.
</process>
