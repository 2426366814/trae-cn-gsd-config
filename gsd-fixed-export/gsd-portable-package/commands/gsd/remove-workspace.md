---
name: gsd:remove-workspace
description: Remove a GSD workspace and clean up worktrees
argument-hint: "<workspace-name>"
allowed-tools:
  - Bash
  - Read
  - AskUserQuestion
---
<context>
**Arguments:**
- `<workspace-name>` (required) â€?Name of the workspace to remove
</context>

<objective>
Remove a workspace directory after confirmation. For worktree strategy, runs `git worktree remove` for each member repo first. Refuses if any repo has uncommitted changes.
</objective>

<execution_context>
@$HOME/.trae-cn/get-shit-done/workflows/remove-workspace.md
@$HOME/.trae-cn/get-shit-done/references/ui-brand.md
</execution_context>

<process>
Execute the remove-workspace workflow from @$HOME/.trae-cn/get-shit-done/workflows/remove-workspace.md end-to-end.
</process>
