---
name: gsd:new-milestone
description: Start a new milestone cycle â€?update PROJECT.md and route to requirements
argument-hint: "[milestone name, e.g., 'v1.1 Notifications']"
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - AskUserQuestion
---
<objective>
Start a new milestone: questioning â†?research (optional) â†?requirements â†?roadmap.

Brownfield equivalent of new-project. Project exists, PROJECT.md has history. Gathers "what's next", updates PROJECT.md, then runs requirements â†?roadmap cycle.

**Creates/Updates:**
- `.planning/PROJECT.md` â€?updated with new milestone goals
- `.planning/research/` â€?domain research (optional, NEW features only)
- `.planning/REQUIREMENTS.md` â€?scoped requirements for this milestone
- `.planning/ROADMAP.md` â€?phase structure (continues numbering)
- `.planning/STATE.md` â€?reset for new milestone

**After:** `/gsd:plan-phase [N]` to start execution.
</objective>

<execution_context>
@$HOME/.trae-cn/get-shit-done/workflows/new-milestone.md
@$HOME/.trae-cn/get-shit-done/references/questioning.md
@$HOME/.trae-cn/get-shit-done/references/ui-brand.md
@$HOME/.trae-cn/get-shit-done/templates/project.md
@$HOME/.trae-cn/get-shit-done/templates/requirements.md
</execution_context>

<context>
Milestone name: $ARGUMENTS (optional - will prompt if not provided)

Project and milestone context files are resolved inside the workflow (`init new-milestone`) and delegated via `<files_to_read>` blocks where subagents are used.
</context>

<process>
Execute the new-milestone workflow from @$HOME/.trae-cn/get-shit-done/workflows/new-milestone.md end-to-end.
Preserve all workflow gates (validation, questioning, research, requirements, roadmap approval, commits).
</process>
