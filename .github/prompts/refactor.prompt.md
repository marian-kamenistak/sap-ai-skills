---
name: refactor
description: 'Refactor legacy SAP ABAP code in small, tested steps toward Clean ABAP without changing behaviour, starting with characterization tests that pin down today''s output.'
agent: agent
---
<!-- Generated from skills/refactor/SKILL.md by scripts/build-copilot.mjs. Edit the SKILL.md, then run the script. -->

# refactor

Make old code easier to read, test and change, while it does exactly what it did before. The
safety net comes first: characterization tests that capture today's behaviour, warts included.
Then small steps, each one checked. If a step breaks a test, it is undone, not explained away.

## When to use

- A program or class that has to be changed soon and nobody dares to touch
- Huge methods or FORM routines, copy-pasted blocks, global variables shared across includes
- Code that cannot be unit tested because everything is static or reads the database directly
- Old syntax a team wants to bring to its current release level

## When not to use

- The change adds or alters behaviour: use implement (refactor first, as a separate transport, if
  it helps)
- The goal is to move data reads into the database: use cds-rewrite
- There is a known defect: use bugfix first, then refactor

## How you reach the system

Say which setup you are using before step 1.

- **ABAP MCP server that can write (DEV only).** Apply each step in DEV in an allowed package,
  activate, run the characterization tests, ABAP Unit and ATC after every step.
- **Read-only ABAP MCP server.** Propose each step as a diff. A person applies it in ADT and
  activates it; then run the tests and ATC over MCP and report.
- **Files exported with abapGit.** Change the files one step per commit, check with abaplint if
  the team uses it. A person imports into DEV and runs the tests after each step, or at agreed
  checkpoints.

## Workflow (a person approves at each gate)

**1. Map the code.** Read the object, its includes and its where-used. List public interfaces
(method signatures, function module parameters, selection screens, report output) that callers
depend on. These stay stable unless a person approves a change.

**2. Pin down behaviour.** Write characterization tests that record what the code returns today
for representative and edge-case inputs, using test doubles for the database
(`CL_OSQL_TEST_ENVIRONMENT`) and dependencies. If the code is not testable at all, the first
refactoring step is the smallest change that makes it testable (extract the logic into a method,
inject the dependency), done by hand-checked diff. Run the tests on the old code; they must pass.

**3. Plan the steps, then STOP.** List the steps in order, smallest first. Typical moves:
extract method, rename for meaning, replace a FORM with a method, replace global data with
parameters, introduce an interface for a dependency, replace nested reads with a single read,
modern syntax (inline declarations, `VALUE`, `NEW`, string templates) where the release allows it.
A person approves the plan.

**4. One step at a time.** Apply one step, activate, run the tests and ATC. Green: next step.
Red: undo the step and look again. Never fix a failing characterization test by changing the
expected value.

**5. Show the diff after each step or at agreed checkpoints.** A person reviews.

**6. Transport.** All steps in one transport, separate from any functional change. Write the
transport description: what changed structurally, that behaviour is unchanged, test results.

## Rules

- Behaviour does not change. If you find a bug, report it separately with a failing test; do not
  fix it inside the refactoring.
- Public signatures stay stable unless a person approves the change and every caller in the
  where-used list is updated in the same transport.
- Follow Clean ABAP (github.com/SAP/styleguides) and the team's CLAUDE.md. Use only syntax the
  team's release supports.
- Never read table contents. Invented test data only.
- DEV only, allowed packages only, a person releases the transport.

## Output

1. Interface map (what callers depend on)
2. Characterization tests and their result on the old code
3. The approved step plan
4. The diff per step with test and ATC results
5. Transport description
