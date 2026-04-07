<purpose>
List all GSD workspaces found in ~/gsd-workspaces/ with their status.
</purpose>

<required_reading>
Read all files referenced by the invoking prompt's execution_context before starting.
</required_reading>

<process>

## 1. Setup

```bash
GSD_BIN=$(node -e "const p=require('path'),f=require('fs'),h=require('os').homedir();const t=p.join(h,'.trae-cn');console.log(p.join(f.existsSync(t)?t:p.join(h,'.claude'),'get-shit-done/bin'))")
INIT=$(node "$GSD_BIN/gsd-tools.cjs" init list-workspaces)
if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi
```

Parse JSON for: `workspace_base`, `workspaces`, `workspace_count`.

## 2. Display

**If `workspace_count` is 0:**

```
No workspaces found in ~/gsd-workspaces/

Create one with:
  /gsd:new-workspace --name my-workspace --repos repo1,repo2
```

Done.

**If workspaces exist:**

Display a table:

```
GSD Workspaces (~/gsd-workspaces/)

| Name | Repos | Strategy | GSD Project |
|------|-------|----------|-------------|
| feature-a | 3 | worktree | Yes |
| feature-b | 2 | clone | No |

Manage:
  cd ~/gsd-workspaces/<name>     # Enter a workspace
  /gsd:remove-workspace <name>   # Remove a workspace
```

For each workspace, show:
- **Name** â€?directory name
- **Repos** â€?count from init data
- **Strategy** â€?from WORKSPACE.md
- **GSD Project** â€?whether `.planning/PROJECT.md` exists (Yes/No)

</process>
