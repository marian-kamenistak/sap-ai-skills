---
name: spec-grill
description: 'Grill a Jira ticket or a written requirement for an SAP ABAP change until it is a specification a developer can build without guessing, then score it 0 to 10 on an 8-point rubric and send it back if it scores below 8.'
agent: agent
---
<!-- Generated from skills/spec-grill/SKILL.md by scripts/build-copilot.mjs. Edit the SKILL.md, then run the script. -->

# spec-grill

Turn a ticket into a specification that survives development. Most rework in SAP projects starts
with a ticket that never named the affected objects, the authorizations or the edge cases. This
skill asks the author the questions a senior developer would ask, checks the answers against the
system, and scores the result. Below 8 out of 10, the ticket goes back to its author with a list of
what is missing. Development starts only from 8 up.

## When to use

- A new Jira ticket, user story or change request before anyone estimates or builds it
- A functional spec written by a consultant that a developer has to implement
- A ticket that already went back and forth twice and still feels unclear

## When not to use

- A bug with a short dump or an error message: use bugfix
- Choosing between technical options for an approved spec: use implement
- Understanding existing code first: use reverse-engineer, then come back here

## How you reach the system

Say which setup you are using before you start.

- **ABAP MCP server (read or write).** Check every object the author names in DEV: does it
  exist, what fields does it have, where is it used. This skill never writes, so a read-only
  server is enough.
- **Files exported with abapGit.** Check the named objects in the export where they are there.
  List the ones you could not check, so the author or a developer confirms them.
- **No system access.** Work from the ticket text only, and mark every object check as "not
  verified".

A ticket arrives either straight from Jira (read-only token or MCP) or as pasted text or an
export. Never ask for production data to clarify a ticket.

## The rubric (10 points, gate at 8)

| # | Criterion | Points |
|---|---|---|
| 1 | Business goal and who benefits | 1 |
| 2 | Affected SAP objects named: tables, function modules, BAdIs, interfaces, transactions | 2 |
| 3 | Current behaviour and target behaviour | 1 |
| 4 | Acceptance criteria written as given / when / then | 2 |
| 5 | Test data and edge cases | 1 |
| 6 | Authorizations and personal data | 1 |
| 7 | Dependencies and side effects: interfaces, batch jobs, other transports | 1 |
| 8 | Out of scope | 1 |

Partial points are allowed for criteria 2 and 4 (1 of 2 when half is there). A criterion counts
only when the answer is specific enough that two developers would build the same thing.

## Workflow (the author decides when the spec is done)

**1. Read and pre-score.** Read the ticket and score it on the rubric as it stands. Show the
author the table with the current score, so they see the gap before the questions start.

**2. Grill, one question at a time.** Ask about the weakest criterion first. One question per
message, specific to this ticket, never a generic checklist dump. Good questions name things:
"Which company codes does this apply to?", "What should happen when the material has no plant
view?", "Is this field visible to users without authorization object F_BKPF_BUK?" Write the
answer into the draft spec as you go.

**3. Check the named objects.** For every table, function module, BAdI, class or interface the
author names, check it in the system or the export: exists or not, key fields, where-used. If an
object does not exist, or a BAdI has an active implementation already, tell the author; that
changes the spec.

**4. Write acceptance criteria with the author.** Each criterion is given / when / then, testable
in QAS with data the team can create. Include at least one negative case (what must not happen)
and one edge case (empty input, missing master data, a user without authorization).

**5. Score again, then STOP.** Score the draft on the rubric. At 8 or more, show the spec and ask
the author to confirm it is done. Below 8, list exactly what is missing per criterion and send it
back. Do not round up to get a ticket through.

## Rules

- The author owns the specification. You ask and write; they decide.
- Never invent a business rule to fill a gap. Mark it as an open question.
- Personal data: if the change touches names, addresses, bank details, HR or health data, the spec
  must say who may see it and whether it leaves the system. Missing means 0 points on criterion 6.
- Never put table contents, user names or customer data into the spec. Use invented test data.
- Keep the spec in the language of the ticket. Keep SAP object names exact (uppercase).
- Follow the team's CLAUDE.md for naming and release details.

## Output

A Markdown specification, ready to paste back into Jira:

1. Score table (criterion, points, one-line reason) and the total, e.g. `8.5 / 10 - ready`
2. Business goal and beneficiary
3. Affected objects, each marked verified / not verified
4. Current vs target behaviour
5. Acceptance criteria (given / when / then)
6. Test data and edge cases
7. Authorizations and personal data
8. Dependencies and side effects
9. Out of scope
10. Open questions (if any), each with who should answer it
