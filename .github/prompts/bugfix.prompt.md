---
name: bugfix
description: 'Fix a bug in SAP ABAP code from a Jira bug, an ST22 short dump, an error message or an application log, by tracing the call chain back to the cause, proving it with the code, writing a test that reproduces it and then the smallest fix.'
agent: agent
---
<!-- Generated from skills/bugfix/SKILL.md by scripts/build-copilot.mjs. Edit the SKILL.md, then run the script. -->

# bugfix

Find the cause first, prove it, then fix it with the smallest change and a test that stops it
coming back. Guessing at a fix from the dump text alone is how bugs get moved instead of fixed.
A person confirms the cause before any code changes.

## When to use

- A short dump in ST22, with a runtime error such as `ITAB_DUPLICATE_KEY`,
  `GETWA_NOT_ASSIGNED`, `CONVT_NO_NUMBER`, or an uncaught exception class
- A wrong result reported in Jira ("the total is off", "status not updated")
- A batch job that fails, with its job log or application log (SLG1)

## When not to use

- The "bug" is a missing feature or a changed requirement: use spec-grill
- You only need to understand the code: use reverse-engineer
- SAP standard code is at fault: search SAP notes and raise an incident; do not modify standard

## How you reach the system

Say which setup you are using before step 1.

- **ABAP MCP server that can write (DEV only).** Read the dump (if the server offers it), code,
  DDIC and where-used live. Write the failing test and the fix in DEV in an allowed package, run
  ATC and ABAP Unit.
- **Read-only ABAP MCP server.** Read and run tests over MCP. Hand the test and the fix to a
  person who applies them in ADT; then run the checks.
- **Files exported with abapGit.** Work on the export plus the dump text a person pastes. Write
  the test and fix as files; a person imports them and runs the checks.

The dump text must reach you without personal data. Variable values in ST22 can hold names,
addresses or bank data: ask the person to remove or mask them before pasting.

## Workflow (a person approves at each gate)

**1. Read the evidence.** From the dump: runtime error, exception class, program, include, line,
the "Active Calls/Events" call stack, and the variable values relevant to the failing statement.
From a wrong result: the steps, the input, expected vs actual. Restate the bug in one sentence.

**2. Trace back.** Start at the failing line and walk the call chain back toward the entry point.
At each hop, ask where the bad value or state came from. Read the where-used if a shared object
is involved.

**3. Name the cause, then STOP.** Describe the cause and show the lines of code that prove it.
If there are several candidates, rank them with evidence. Give the debugger breakpoints that
would confirm it. A person confirms the cause before you continue.

**4. Reproduce with a test.** Write an ABAP Unit test that fails on the current code for exactly
this bug, using test doubles for the database (`CL_OSQL_TEST_ENVIRONMENT`) and dependencies. If
the code cannot be tested, make the smallest testability change first and say so.

**5. The smallest fix.** Change only what the cause needs. Activate, run the new test, the
existing tests and ATC. All must pass. Check the where-used: does the same pattern exist in other
places? Report them; do not fix them silently in this transport.

**6. Show the diff, then STOP for review.** A person reviews the fix and the test.

**7. Transport and record.** Assign the fix and the test to one transport. Write the cause, the
fix and the test into the Jira ticket. A person releases the transport.

## Rules

- No fix before a confirmed cause.
- Never debug or test in production. Reproduce in DEV with invented test data.
- Never read table contents to "see the bad record". Ask a person to describe the data pattern
  (for example "two items with the same key") without real values.
- The smallest change that fixes the cause. Refactoring goes to a separate transport.
- A person releases the transport.

## Output

1. The bug in one sentence
2. Call chain from entry point to the failing line
3. The cause with code evidence, confirmed by <person>
4. The failing test, then passing
5. The fix as a diff, with ATC and test results
6. Same pattern elsewhere (if any)
7. Jira note: cause, fix, test, transport
