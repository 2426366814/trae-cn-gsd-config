---
name: gsd:validate-phase
description: Retroactively audit and fill Nyquist validation gaps for a completed phase
argument-hint: "[phase number]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Task
  - AskUserQuestion
---
<objective>
Audit Nyquist validation coverage for a completed phase. Three states:
- (A) VALIDATION.md exists â€?audit and fill gaps
- (B) No VALIDATION.md, SUMMARY.md exists â€?reconstruct from artifacts
- (C) Phase not executed â€?exit with guidance

Output: updated VALIDATION.md + generated test files.
</objective>

<execution_context>
@$HOME/.trae-cn/get-shit-done/workflows/validate-phase.md
</execution_context>

<context>
Phase: $ARGUMENTS â€?optional, defaults to last completed phase.
</context>

<process>
Execute @$HOME/.trae-cn/get-shit-done/workflows/validate-phase.md.
Preserve all workflow gates.
</process>
