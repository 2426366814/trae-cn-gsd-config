---
name: gsd:new-project
description: Initialize a new project with deep context gathering and PROJECT.md
argument-hint: "[--auto]"
allowed-tools:
  - Read
  - Bash
  - Write
  - Task
  - AskUserQuestion
---
<context>
**Flags:**
- `--auto` â€?Automatic mode. After config questions, runs research â†?requirements â†?roadmap without further interaction. Expects idea document via @ reference.
</context>

<objective>
Initialize a new project through unified flow: questioning â†?research (optional) â†?requirements â†?roadmap.

**Creates:**
- `.planning/PROJECT.md` â€?project context
- `.planning/config.json` â€?workflow preferences
- `.planning/research/` â€?domain research (optional)
- `.planning/REQUIREMENTS.md` â€?scoped requirements
- `.planning/ROADMAP.md` â€?phase structure
- `.planning/STATE.md` â€?project memory

**After this command:** Run `/gsd:plan-phase 1` to start execution.
</objective>

<execution_context>
@$HOME/.trae-cn/get-shit-done/workflows/new-project.md
@$HOME/.trae-cn/get-shit-done/references/questioning.md
@$HOME/.trae-cn/get-shit-done/references/ui-brand.md
@$HOME/.trae-cn/get-shit-done/templates/project.md
@$HOME/.trae-cn/get-shit-done/templates/requirements.md
</execution_context>

<process>
Execute the new-project workflow from @$HOME/.trae-cn/get-shit-done/workflows/new-project.md end-to-end.
Preserve all workflow gates (validation, approvals, commits, routing).
</process>
