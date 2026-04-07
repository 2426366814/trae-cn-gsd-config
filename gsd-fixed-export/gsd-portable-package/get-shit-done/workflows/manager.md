<purpose>

Interactive command center for managing a milestone from a single terminal. Shows a dashboard of all phases with visual status, dispatches discuss inline and plan/execute as background agents, and loops back to the dashboard after each action. Enables parallel phase work from one terminal.

</purpose>

<required_reading>

Read all files referenced by the invoking prompt's execution_context before starting.

</required_reading>

<process>

<step name="initialize" priority="first">

## 1. Initialize

Bootstrap via manager init:

```bash
GSD_BIN=$(node -e "const p=require('path'),f=require('fs'),h=require('os').homedir();const t=p.join(h,'.trae-cn');console.log(p.join(f.existsSync(t)?t:p.join(h,'.claude'),'get-shit-done/bin'))")
INIT=$(node "$GSD_BIN/gsd-tools.cjs" init manager)
if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi
```

Parse JSON for: `milestone_version`, `milestone_name`, `phase_count`, `completed_count`, `in_progress_count`, `phases`, `recommended_actions`, `all_complete`, `waiting_signal`.

**If error:** Display the error message and exit.

Display startup banner:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━�? GSD �?MANAGER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━�?
 {milestone_version} �?{milestone_name}
 {phase_count} phases · {completed_count} complete

 �?Discuss �?inline    �?Plan/Execute �?background
 Dashboard auto-refreshes when background work is active.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━�?```

Proceed to dashboard step.

</step>

<step name="dashboard">

## 2. Dashboard (Refresh Point)

**Every time this step is reached**, re-read state from disk to pick up changes from background agents:

```bash
GSD_BIN=$(node -e "const p=require('path'),f=require('fs'),h=require('os').homedir();const t=p.join(h,'.trae-cn');console.log(p.join(f.existsSync(t)?t:p.join(h,'.claude'),'get-shit-done/bin'))")
INIT=$(node "$GSD_BIN/gsd-tools.cjs" init manager)
if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi
```

Parse the full JSON. Build the dashboard display.

Build dashboard from JSON. Symbols: `✓` done, `◆` active, `○` pending, `·` queued. Progress bar: 20-char `█░`.

**Status mapping** (disk_status �?D P E Status):

- `complete` �?`�?�?✓` `�?Complete`
- `partial` �?`�?�?◆` `�?Executing...`
- `planned` �?`�?�?○` `�?Ready to execute`
- `discussed` �?`�?�?·` `�?Ready to plan`
- `researched` �?`�?· ·` `�?Ready to plan`
- `empty`/`no_directory` + `is_next_to_discuss` �?`�?· ·` `�?Ready to discuss`
- `empty`/`no_directory` otherwise �?`· · ·` `· Up next`
- If `is_active`, replace status icon with `◆` and append `(active)`

If any `is_active` phases, show: `�?Background: {action} Phase {N}, ...` above grid.

Use `display_name` (not `name`) for the Phase column �?it's pre-truncated to 20 chars with `…` if clipped. Pad all phase names to the same width for alignment.

Use `deps_display` from init JSON for the Deps column �?shows which phases this phase depends on (e.g. `1,3`) or `—` for none.

Example output:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━�? GSD �?DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━�? ████████████░░░░░░░░ 60%  (3/5 phases)
 �?Background: Planning Phase 4
 | # | Phase                | Deps | D | P | E | Status              |
 |---|----------------------|------|---|---|---|---------------------|
 | 1 | Foundation           | �?   | �?| �?| �?| �?Complete          |
 | 2 | API Layer            | 1    | �?| �?| �?| �?Executing (active)|
 | 3 | Auth System          | 1    | �?| �?| �?| �?Ready to execute  |
 | 4 | Dashboard UI & Set�? | 1,2  | �?| �?| · | �?Planning (active) |
 | 5 | Notifications        | �?   | �?| · | · | �?Ready to discuss  |
 | 6 | Polish & Final Mail�?| 1-5  | · | · | · | · Up next           |
```

**Recommendations section:**

If `all_complete` is true:

```
╔══════════════════════════════════════════════════════════════╗
�? MILESTONE COMPLETE                                          �?╚══════════════════════════════════════════════════════════════╝

All {phase_count} phases done. Ready for final steps:
  �?/gsd:verify-work �?run acceptance testing
  �?/gsd:complete-milestone �?archive and wrap up
```

Ask user via AskUserQuestion:
- **question:** "All phases complete. What next?"
- **options:** "Verify work" / "Complete milestone" / "Exit manager"

Handle responses:
- "Verify work": `Skill(skill="gsd:verify-work")`  then loop to dashboard.
- "Complete milestone": `Skill(skill="gsd:complete-milestone")` then exit.
- "Exit manager": Go to exit step.

**If NOT all_complete**, build compound options from `recommended_actions`:

**Compound option logic:** Group background actions (plan/execute) together, and pair them with the single inline action (discuss) when one exists. The goal is to present the fewest options possible �?one option can dispatch multiple background agents plus one inline action.

**Building options:**

1. Collect all background actions (execute and plan recommendations) �?there can be multiple of each.
2. Collect the inline action (discuss recommendation, if any �?there will be at most one since discuss is sequential).
3. Build compound options:

   **If there are ANY recommended actions (background, inline, or both):**
   Create ONE primary "Continue" option that dispatches ALL of them together:
   - Label: `"Continue"` �?always this exact word
   - Below the label, list every action that will happen. Enumerate ALL recommended actions �?do not cap or truncate:
     ```
     Continue:
       �?Execute Phase 32 (background)
       �?Plan Phase 34 (background)
       �?Discuss Phase 35 (inline)
     ```
   - This dispatches all background agents first, then runs the inline discuss (if any).
   - If there is no inline discuss, the dashboard refreshes after spawning background agents.

   **Important:** The Continue option must include EVERY action from `recommended_actions` �?not just 2. If there are 3 actions, list 3. If there are 5, list 5.

4. Always add:
   - `"Refresh dashboard"`
   - `"Exit manager"`

Display recommendations compactly:

```
───────────────────────────────────────────────────────────────
�?Next Steps
───────────────────────────────────────────────────────────────

Continue:
  �?Execute Phase 32 (background)
  �?Plan Phase 34 (background)
  �?Discuss Phase 35 (inline)
```

**Auto-refresh:** If background agents are running (`is_active` is true for any phase), set a 60-second auto-refresh cycle. After presenting the action menu, if no user input is received within 60 seconds, automatically refresh the dashboard. This interval is configurable via `manager_refresh_interval` in GSD config (default: 60 seconds, set to 0 to disable).

Present via AskUserQuestion:
- **question:** "What would you like to do?"
- **options:** (compound options as built above + refresh + exit, AskUserQuestion auto-adds "Other")

**On "Other" (free text):** Parse intent �?if it mentions a phase number and action, dispatch accordingly. If unclear, display available actions and loop to action_menu.

Proceed to handle_action step with the selected action.

</step>

<step name="handle_action">

## 4. Handle Action

### Refresh Dashboard

Loop back to dashboard step.

### Exit Manager

Go to exit step.

### Compound Action (background + inline)

When the user selects a compound option:

1. **Spawn all background agents first** (plan/execute) �?dispatch them in parallel using the Plan Phase N / Execute Phase N handlers below.
2. **Then run the inline discuss:**

```
Skill(skill="gsd:discuss-phase", args="{PHASE_NUM}")
```

After discuss completes, loop back to dashboard step (background agents continue running).

### Discuss Phase N

Discussion is interactive �?needs user input. Run inline:

```
Skill(skill="gsd:discuss-phase", args="{PHASE_NUM}")
```

After discuss completes, loop back to dashboard step.

### Plan Phase N

Planning runs autonomously. Spawn a background agent:

```
Task(
  description="Plan phase {N}: {phase_name}",
  run_in_background=true,
  prompt="You are running the GSD plan-phase workflow for phase {N} of the project.

Working directory: {cwd}
Phase: {N} �?{phase_name}
Goal: {goal}

Steps:
1. Read the plan-phase workflow: cat $GSD_DIR/workflows/plan-phase.md
2. Run: node \"$GSD_BIN/gsd-tools.cjs\" init plan-phase {N}
3. Follow the workflow steps to produce PLAN.md files for this phase.
4. If research is enabled in config, run the research step first.
5. Spawn a gsd-planner subagent via Task() to create the plans.
6. If plan-checker is enabled, spawn a gsd-plan-checker subagent to verify.
7. Commit plan files when complete.

Important: You are running in the background. Do NOT use AskUserQuestion �?make autonomous decisions based on project context. If you hit a blocker, write it to STATE.md as a blocker and stop. Do NOT silently work around permission or file access errors �?let them fail so the manager can surface them with resolution hints."
)
```

Display:

```
�?Spawning planner for Phase {N}: {phase_name}...
```

Loop back to dashboard step.

### Execute Phase N

Execution runs autonomously. Spawn a background agent:

```
Task(
  description="Execute phase {N}: {phase_name}",
  run_in_background=true,
  prompt="You are running the GSD execute-phase workflow for phase {N} of the project.

Working directory: {cwd}
Phase: {N} �?{phase_name}
Goal: {goal}

Steps:
1. Read the execute-phase workflow: cat $GSD_DIR/workflows/execute-phase.md
2. Run: node \"$GSD_BIN/gsd-tools.cjs\" init execute-phase {N}
3. Follow the workflow steps: discover plans, analyze dependencies, group into waves.
4. For each wave, spawn gsd-executor subagents via Task() to execute plans in parallel.
5. After all waves complete, spawn a gsd-verifier subagent if verifier is enabled.
6. Update ROADMAP.md and STATE.md with progress.
7. Commit all changes.

Important: You are running in the background. Do NOT use AskUserQuestion �?make autonomous decisions. Use --no-verify on git commits. If you hit a permission error, file lock, or any access issue, do NOT work around it �?let it fail and write the error to STATE.md as a blocker so the manager can surface it with resolution guidance."
)
```

Display:

```
�?Spawning executor for Phase {N}: {phase_name}...
```

Loop back to dashboard step.

</step>

<step name="background_completion">

## 5. Background Agent Completion

When notified that a background agent completed:

1. Read the result message from the agent.
2. Display a brief notification:

```
�?{description}
  {brief summary from agent result}
```

3. Loop back to dashboard step.

**If the agent reported an error or blocker:**

Classify the error:

**Permission / tool access error** (e.g. tool not allowed, permission denied, sandbox restriction):
- Parse the error to identify which tool or command was blocked.
- Display the error clearly, then offer to fix it:
  - **question:** "Phase {N} failed �?permission denied for `{tool_or_command}`. Want me to add it to settings.local.json so it's allowed?"
  - **options:** "Add permission and retry" / "Run this phase inline instead" / "Skip and continue"
  - "Add permission and retry": Use `Skill(skill="update-config")` to add the permission to `settings.local.json`, then re-spawn the background agent. Loop to dashboard.
  - "Run this phase inline instead": Dispatch the same action (plan/execute) inline via `Skill()` instead of a background Task. Loop to dashboard after.
  - "Skip and continue": Loop to dashboard (phase stays in current state).

**Other errors** (git lock, file conflict, logic error, etc.):
- Display the error, then offer options via AskUserQuestion:
  - **question:** "Background agent for Phase {N} encountered an issue: {error}. What next?"
  - **options:** "Retry" / "Run inline instead" / "Skip and continue" / "View details"
  - "Retry": Re-spawn the same background agent. Loop to dashboard.
  - "Run inline instead": Dispatch the action inline via `Skill()`. Loop to dashboard after.
  - "Skip and continue": Loop to dashboard (phase stays in current state).
  - "View details": Read STATE.md blockers section, display, then re-present options.

</step>

<step name="exit">

## 6. Exit

Display final status with progress bar:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━�? GSD �?SESSION END
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━�?
 {milestone_version} �?{milestone_name}
 {PROGRESS_BAR} {progress_pct}%  ({completed_count}/{phase_count} phases)

 Resume anytime: /gsd:manager
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━�?```

**Note:** Any background agents still running will continue to completion. Their results will be visible on next `/gsd:manager` or `/gsd:progress` invocation.

</step>

</process>

<success_criteria>
- [ ] Dashboard displays all phases with correct status indicators (D/P/E/V columns)
- [ ] Progress bar shows accurate completion percentage
- [ ] Dependency resolution: blocked phases show which deps are missing
- [ ] Recommendations prioritize: execute > plan > discuss
- [ ] Discuss phases run inline via Skill() �?interactive questions work
- [ ] Plan phases spawn background Task agents �?return to dashboard immediately
- [ ] Execute phases spawn background Task agents �?return to dashboard immediately
- [ ] Dashboard refreshes pick up changes from background agents via disk state
- [ ] Background agent completion triggers notification and dashboard refresh
- [ ] Background agent errors present retry/skip options
- [ ] All-complete state offers verify-work and complete-milestone
- [ ] Exit shows final status with resume instructions
- [ ] "Other" free-text input parsed for phase number and action
- [ ] Manager loop continues until user exits or milestone completes
</success_criteria>
