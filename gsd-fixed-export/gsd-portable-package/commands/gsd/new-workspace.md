---
name: gsd:new-workspace
description: Create an isolated workspace with repo copies and independent .planning/
argument-hint: "--name <name> [--repos repo1,repo2] [--path /target] [--strategy worktree|clone] [--branch name] [--auto]"
allowed-tools:
  - Read
  - Bash
  - Write
  - AskUserQuestion
---
<context>
**Flags:**
- `--name` (required) â€?Workspace name
- `--repos` â€?Comma-separated repo paths or names. If omitted, interactive selection from child git repos in cwd
- `--path` â€?Target directory. Defaults to `~/gsd-workspaces/<name>`
- `--strategy` â€?`worktree` (default, lightweight) or `clone` (fully independent)
- `--branch` â€?Branch to checkout. Defaults to `workspace/<name>`
- `--auto` â€?Skip interactive questions, use defaults
</context>

<objective>
Create a physical workspace directory containing copies of specified git repos (as worktrees or clones) with an independent `.planning/` directory for isolated GSD sessions.

**Use cases:**
- Multi-repo orchestration: work on a subset of repos in parallel with isolated GSD state
- Feature branch isolation: create a worktree of the current repo with its own `.planning/`

**Creates:**
- `<path>/WORKSPACE.md` â€?workspace manifest
- `<path>/.planning/` â€?independent planning directory
- `<path>/<repo>/` â€?git worktree or clone for each specified repo

**After this command:** `cd` into the workspace and run `/gsd:new-project` to initialize GSD.
</objective>

<execution_context>
@$HOME/.trae-cn/get-shit-done/workflows/new-workspace.md
@$HOME/.trae-cn/get-shit-done/references/ui-brand.md
</execution_context>

<process>
Execute the new-workspace workflow from @$HOME/.trae-cn/get-shit-done/workflows/new-workspace.md end-to-end.
Preserve all workflow gates (validation, approvals, commits, routing).
</process>
