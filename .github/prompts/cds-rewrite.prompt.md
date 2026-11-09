---
name: cds-rewrite
description: 'Rewrite the data logic of an ABAP report, class or function module into CDS view entities, with tests that prove the output is unchanged and a runtime comparison before and after.'
agent: agent
---
<!-- Generated from skills/cds-rewrite/SKILL.md by scripts/build-copilot.mjs. Edit the SKILL.md, then run the script. -->

# cds-rewrite

Move data access out of ABAP and into CDS view entities, so HANA does the joins, filters and
totals where the data lives. Behaviour must not change. Every rewrite ships with tests that prove
it, and with runtime numbers that justify it.

## When it pays off, and when it doesn't

Worth it:
- SELECT inside LOOP, or nested SELECTs (the classic N+1)
- FOR ALL ENTRIES driving a second or third read
- Joins, filters, aggregations (SUM, COUNT, MAX) or calculated fields built in ABAP after reading
- The same read logic copied across several programs
- A report that should also feed a Fiori app, an OData API or analytics

Leave it in ABAP:
- Writes (INSERT / UPDATE / MODIFY / DELETE), locks, COMMIT logic
- Procedural business rules with many branches, BAdI calls, function module calls per row
- Reads that are already a single well-indexed SELECT with no post-processing

If the measured runtime doesn't improve and the code doesn't get simpler, stop and report that.
No gain, no rewrite.

## How you reach the system

Find out which of the three setups the team has before step 1, and say which one you are using.

- **ABAP MCP server that can write (DEV only).** Read source, DDIC and where-used live. Create
  and activate the view entity and access control in an allowed Z package, change the program,
  run syntax check, ATC and ABAP Unit yourself.
- **Read-only ABAP MCP server.** Read live and run ATC and ABAP Unit, but write nothing. Hand the
  CDS sources and the new program code to a person, who creates and activates them in ADT; then
  run the tests over MCP and propose fixes.
- **Files exported with abapGit.** Work on the exported package only. Ask for any DDIC definition
  or called object that is not in the export. Write the sources as files (abapGit format), check
  them with abaplint if the team uses it, and hand over; a person creates the objects and runs the
  tests in SAP and pastes the results back.

## Workflow (a person approves at each gate)

**1. Inventory.** Read the object and everything it includes. List every data access in a table:
line, statement, tables, WHERE fields, what ABAP does with the result afterwards (loop join,
filter, total, lookup). Add the where-used of the object. With an ABAP MCP server, read live
source and DDIC; without one, work on the abapGit export and ask for missing DDIC definitions.

**2. Pin down today's behaviour.** Before touching anything, write ABAP Unit tests that capture
the current output on representative test data, using `CL_OSQL_TEST_ENVIRONMENT` to replace the
database tables. Include edge cases: empty input table (the FOR ALL ENTRIES trap), duplicates,
missing master data, authorization-restricted rows. Run them. They must pass on the old code.

**3. Design, then STOP for approval.** Propose:
- one or more `define view entity` objects: data sources, joins vs associations, WHERE, GROUP BY,
  calculated fields, parameters for selection-screen inputs
- naming per house rules (e.g. `ZI_` interface/basic views, `ZC_` consumption views; follow the
  team's CLAUDE.md if it says otherwise)
- an access control (`define role`) that replaces AUTHORITY-CHECKs where the check is row-level
  and maps cleanly; keep the ABAP check where it doesn't
- what stays in ABAP and why
- the expected effect: which loops and SELECTs disappear

Do not write code until a person approves this design.

**4. Build.** Create the view entity and access control, activate them, then change the program to
read from the view and delete the replaced ABAP logic. With write access over MCP, do this in DEV
in an allowed package; otherwise write the sources to files for a person to create in ADT.
Add CDS tests with `CL_CDS_TEST_ENVIRONMENT`. Run syntax check, ATC and all tests (the old
characterization tests and the new CDS tests) until every one passes.

**5. Measure.** Compare runtime before and after on realistic data in DEV or QAS: SAT (runtime
analysis) for the whole program, ST05 (SQL trace) for the database part. Report both numbers, the
number of DB round trips and the data volume transferred, if available.

**6. Hand over.** Assign everything to one transport (views, access control, changed program,
test classes). Write the transport description: what moved into CDS, what stayed, test results,
runtime before and after. A person releases the transport.

## Rules

- Never change what the report outputs. If the old code has a bug, report it separately; don't
  fix it silently inside the rewrite.
- Never read table contents from production. Test data only, or DEV/QAS data without personal data.
- Release check: `define view entity` needs SAP_BASIS 7.55+ (S/4HANA 2020 or newer). On older
  releases use classic `define view` with an SQL view name, and say so in the design.
- FOR ALL ENTRIES with an empty driver table reads the whole table. Check the old code's guard and
  keep the same semantics in the view-based version.
- Client handling: view entities are client-dependent automatically; don't add MANDT conditions.
- Prefer associations over joins when the consumer only sometimes needs the target data.
- Keep one change per transport. Don't mix a CDS rewrite with unrelated refactoring.

## Output

1. The inventory table (step 1)
2. The approved design (step 3)
3. CDS sources, access control, changed program, test classes
4. Test results and the before/after runtime table
5. Transport description
