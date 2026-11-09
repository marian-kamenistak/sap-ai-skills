---
name: code-review
description: Review SAP ABAP code in a transport, package, diff or exported files, using ATC findings as the base plus a checklist for Clean ABAP, security (missing AUTHORITY-CHECK, SQL injection), performance on HANA (SELECT in loops, SELECT *, FOR ALL ENTRIES with an empty table) and the team's naming rules, with a severity and a proposed fix per finding. Use when someone asks to "review this transport", "review my ABAP", "check this code before release", "is this ready for QAS", "code review this diff", "what's wrong with this program", or before transport-release. Not for fixing the findings (the author decides; use refactor or implement), not for reviewing SAP standard code.
---

# code-review

Give the author a review they can act on: findings ordered by severity, each with the line, why it
matters and a proposed fix. ATC is the base because it is objective and the team already trusts
it; this skill adds what ATC usually misses: intent, readability, security holes that pass the
checks and HANA performance traps.

## When to use

- Before a transport goes to QAS
- A pull request or diff of ABAP files (abapGit workflow)
- A new developer's first changes, or code written by AI

## When not to use

- Fixing the findings: the author decides, then uses implement or refactor
- Understanding what code does: use reverse-engineer
- SAP standard objects

## How you reach the system

Say which setup you are using.

- **ABAP MCP server (read is enough).** Read the objects in the transport or package from DEV,
  run ATC with the team's check variant and use the findings as the base. Read where-used for
  changed public methods. Do not change any code.
- **Files exported with abapGit, or a diff.** Review the files. Without ATC, say so in the
  report, and run abaplint if the team uses it. Ask for called objects that are not in the files
  when a finding depends on them.

## Workflow

**1. Scope.** List the objects under review and what changed (new vs modified). For modified
objects, review the change and the code it touches, not the whole legacy program.

**2. ATC first.** Run ATC (or take the ATC result the author attached). Group the findings,
drop exact duplicates, and keep each with its check name.

**3. Read the change with the checklist.**
- Security: AUTHORITY-CHECK missing or its `sy-subrc` ignored; dynamic SQL or dynamic calls
  built from user input without `CL_ABAP_DYN_PRG`; hard-coded user names, clients or passwords
- Correctness: `sy-subrc` not checked after SELECT SINGLE, READ TABLE, CALL FUNCTION; FOR ALL
  ENTRIES without a guard for an empty driver table; FOR ALL ENTRIES removing duplicates the code
  needed; COMMIT WORK inside a BAdI or an update task; missing exception handling
- Performance on HANA: SELECT inside LOOP or nested SELECTs; SELECT * when a few fields are used;
  reading whole tables to filter in ABAP; nested LOOPs over standard tables where a sorted or
  hashed table fits; missing WHERE on large tables
- Clean ABAP: methods doing several things, unclear names, FORM routines in new code, obsolete
  statements, magic numbers, commented-out code, texts hard-coded instead of text elements
- Team rules: naming (Z/Y prefixes, class and variable names), package, release-specific syntax,
  everything the team's CLAUDE.md lists

**4. Rate each finding.** Severity: Blocker (security hole, data corruption, wrong result), Major
(performance on real volumes, missing error handling), Minor (readability, naming), Info (style
suggestion). Each finding has object, include and line, the problem in one sentence, why it
matters, and a proposed fix as code.

**5. Hand over.** The author decides what to fix. Do not change the code under review.

## Rules

- Evidence per finding: object and line. No vague "consider improving readability".
- Separate ATC findings from your own, so the team sees what the tool found and what it missed.
- Never read table contents to judge a finding.
- Do not pile on: if the same issue appears 20 times, report it once with the count and the list
  of lines.
- Praise is optional; one line on what is done well is enough.

## Output

Findings ordered by severity, ready to paste as a Jira comment:

1. Summary: objects reviewed, ATC variant used (or "ATC not run"), count per severity, a
   ready / not ready verdict
2. Findings table: severity, object, line, problem, fix
3. Proposed fixes as code for Blocker and Major findings
