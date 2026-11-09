---
name: implement
description: Build a new SAP ABAP feature from an approved specification to activated, tested code in DEV assigned to a transport, with two technical options for a person to choose from and ABAP Unit tests for each acceptance criterion. Use when someone says "implement this ticket", "build this", "develop this change", "add this field / check / output to the Z program", "write the BAdI implementation", "create the class for this spec", or hands over a spec that scored 8/10 or more in spec-grill. Not for unclear tickets (run spec-grill first), not for bugs (use bugfix), not for restructuring old code without new behaviour (use refactor).
---

# implement

Take an approved specification and deliver working ABAP: code, tests and a transport assignment.
A person picks the technical option, reviews the diff and releases the transport. The tests are
written against the acceptance criteria in the spec, so they prove the requirement, not just the
code you happened to write.

## When to use

- A specification scored 8/10 or higher (see spec-grill)
- A new report, class, BAdI implementation, enhancement, function module, CDS view or DDIC object
- An extension of an existing Z object with new behaviour

## When not to use

- The spec scores below 8 or has open questions: send it back through spec-grill
- A defect in existing behaviour: use bugfix
- Same behaviour, cleaner code: use refactor
- Moving read logic into CDS: use cds-rewrite

## How you reach the system

Say which setup you are using before step 1.

- **ABAP MCP server that can write (DEV only).** Read live code, DDIC and where-used. Create
  and change objects only in the packages the team allows, activate them, run syntax check, ATC
  and ABAP Unit, fix what fails and run again.
- **Read-only ABAP MCP server.** Read live and run ATC and ABAP Unit over MCP, but write
  nothing. Hand the code to a person, who pastes it into ADT and activates it; then run the
  checks and propose fixes from the results.
- **Files exported with abapGit.** Work on the export. Write new and changed objects as files in
  abapGit format, check them with abaplint if the team uses it, and hand over. A person imports
  or creates them in DEV and runs the checks.

## Workflow (a person approves at each gate)

**1. Read the spec and the system.** Confirm the spec has a score of 8 or more. Read every object
it names, plus the where-used of anything you will change. List the places the change touches.
If the spec contradicts what is in the system (a field that does not exist, a BAdI that is
already implemented), stop and send it back.

**2. Two options, then STOP for a choice.** Propose two technical options. For each: objects to
create or change, the enhancement technique (BAdI, enhancement, new class, change to Z code),
impact on callers, performance, upgrade safety and risks. Recommend one and say why. Do not write
code until a person picks.

**3. Tests first.** Write ABAP Unit tests for each acceptance criterion, given / when / then. Use
test doubles for the database (`CL_OSQL_TEST_ENVIRONMENT`, `CL_CDS_TEST_ENVIRONMENT`) and for
dependencies behind interfaces (`CL_ABAP_TESTDOUBLE`). On releases without these frameworks, inject
the dependency through an interface and replace it in the test.

**4. Build.** Write the code following Clean ABAP and the team's naming rules. Small methods,
exceptions over return codes in new code, no SELECT in loops, AUTHORITY-CHECK where the spec
asks for it. Activate, run syntax check, ATC and the tests; fix and repeat until all pass (or
hand over, depending on your setup).

**5. Show the diff, then STOP for review.** Present the full diff and the test and ATC results.
A person reviews it. Apply their changes and run the checks again.

**6. Transport and note.** Assign every object to one transport (use the one the person gives
you, or create one if your setup allows it). Write a short technical note for Jira: options
considered, the one chosen and why, objects changed, test results. A person releases the
transport.

## Rules

- DEV only. Never connect to QAS or production to build or test.
- Only the packages the team allows. Never change SAP standard objects; use the enhancement
  framework instead, and only where the spec needs it.
- Never read table contents to "see what the data looks like". Ask for DDIC and invented test
  data.
- No silent extras. Build what the spec says. If you see a problem outside the scope, report it.
- One change per transport. Never release a transport; people do.
- Follow the team's CLAUDE.md for release, naming and packages.

## Output

1. The list of affected places (step 1)
2. The two options and the chosen one (step 2)
3. Code and test classes, activated or as files
4. ATC and ABAP Unit results
5. Transport number (or the object list for a person to assign) and the Jira technical note
