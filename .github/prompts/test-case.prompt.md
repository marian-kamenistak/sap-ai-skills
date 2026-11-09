---
name: test-case
description: 'Write ABAP Unit tests (given/when/then, with test doubles for the database and dependencies) and manual QAS test scenarios for an SAP ABAP class, program or specification, then run them and fix what fails.'
agent: agent
---
<!-- Generated from skills/test-case/SKILL.md by scripts/build-copilot.mjs. Edit the SKILL.md, then run the script. -->

# test-case

Write tests that prove the specification, not tests that only repeat the code. Two outputs: an
ABAP Unit test class that runs in seconds without real data, and manual test scenarios that a
tester runs in QAS. Each test maps to an acceptance criterion or a named edge case.

## When to use

- A class or program with no tests, before someone changes it
- A specification with acceptance criteria that needs test coverage
- QAS test scenarios for a transport going to test

## When not to use

- Inside refactor or cds-rewrite: they write characterization tests as their first step
- Load and performance testing: use SAT and ST05 with a person, not unit tests
- Testing SAP standard code

## How you reach the system

Say which setup you are using.

- **ABAP MCP server that can write (DEV only).** Create the local test class (or a global test
  class if the team prefers), activate it, run ABAP Unit with coverage, fix failing tests and run
  again.
- **Read-only ABAP MCP server.** Read the code under test live and run ABAP Unit over MCP after
  a person pastes the test class into ADT and activates it. Read the results and propose fixes.
- **Files exported with abapGit.** Write the test class into the `.testclasses.abap` include file
  of the export. A person imports or pastes it, runs the tests in ADT and pastes the result back.

## Workflow

**1. Collect what to prove.** From the specification: each acceptance criterion. From the code:
public methods, branches, error paths. Make a table: test name, criterion or branch, given, when,
then. Add edge cases: empty input, missing master data, duplicates, a user without
authorization, boundary values, the FOR ALL ENTRIES empty-driver trap.

**2. Plan the doubles, then STOP.** Name every dependency and how you will replace it:
- Database tables and CDS views: `CL_OSQL_TEST_ENVIRONMENT`, `CL_CDS_TEST_ENVIRONMENT`
- Classes behind interfaces: `CL_ABAP_TESTDOUBLE` or a hand-written local double
- Function modules: the function test double framework where the release has it, otherwise a
  wrapper class behind an interface
- `TEST-SEAM` / `TEST-INJECTION` only for old code that cannot be changed yet, and say so
If the code cannot be tested without changing it (static calls, SELECTs buried in a FORM), say
what minimal change would make it testable. A person approves the plan and any code change.

**3. Write the tests.** One test method per row in the table, named for the behaviour
(`rejects_empty_order_list`, not `test_1`). Given / when / then as comments or helper methods.
`RISK LEVEL HARMLESS`, `DURATION SHORT`. Test data is invented in the test, never copied from a
real system.

**4. Run and fix.** Run the tests. A failing test is either a test mistake (fix the test) or a
real defect (do not fix the code here; report it with the failing test as evidence).

**5. Write the QAS scenarios.** For each acceptance criterion, a manual scenario: precondition and
test data to create, steps in the transaction, expected result. Add one scenario per
authorization role that the change affects.

## Rules

- Tests prove the spec. If a test passes only because it copies the implementation's logic, it
  proves nothing; rewrite it against the expected business result.
- No real data in tests. No table contents from DEV, QAS or production; invent the data.
- Never weaken an assertion to make a test pass.
- A defect found by a test is reported, not silently fixed inside the test work.
- Follow the team's CLAUDE.md for naming of test classes and methods.

## Output

1. Test table (name, criterion, given, when, then)
2. The test class, activated or as a file
3. Test run result and coverage, if available
4. Defects found, each with its failing test
5. QAS test scenarios
