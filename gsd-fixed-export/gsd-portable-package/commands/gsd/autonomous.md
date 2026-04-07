---
name: gsd:autonomous
description: Run all remaining phases autonomously â€?discussâ†’planâ†’execute per phase
argument-hint: "[--from N]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
  - Task
---
<objective>
Execute all remaining milestone phases autonomously. For each phase: discuss â†?plan â†?execute. Pauses only for user decisions (grey area acceptance, blockers, validation requests).

Uses ROADMAP.md phase discovery and Skill() flat invocations for each phase command. After all phases complete: milestone audit â†?complete â†?cleanup.

**Creates/Updates:**
- `.planning/STATE.md` â€?updated after each phase
- `.planning/ROADMAP.md` â€?progress updated after each phase
- Phase artifacts â€?CONTEXT.md, PLANs, SUMMARYs per phase

**After:** Milestone is complete and cleaned up.
</objective>

<execution_context>
@$HOME/.trae-cn/get-shit-done/workflows/autonomous.md
@$HOME/.trae-cn/get-shit-done/references/ui-brand.md
</execution_context>

<context>
Optional flag: `--from N` â€?start from phase N instead of the first incomplete phase.

Project context, phase list, and state are resolved inside the workflow using init commands (`gsd-tools.cjs init milestone-op`, `gsd-tools.cjs roadmap analyze`). No upfront context loading needed.
</context>

<process>
Execute the autonomous workflow from @$HOME/.trae-cn/get-shit-done/workflows/autonomous.md end-to-end.
Preserve all workflow gates (phase discovery, per-phase execution, blocker handling, progress display).
</process>
