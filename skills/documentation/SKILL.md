---
name: documentation
description: Write technical documentation for an SAP ABAP object or package from the code itself, covering purpose, inputs and outputs, tables read and written, who calls it and what it calls, a Mermaid sequence diagram and known risks, as Markdown for Confluence or a Jira ticket. Use when someone asks to "document this class", "write docs for this Z program", "explain this package for the wiki", "write a technical spec from the code", "onboarding doc for this interface", "what does this function module do, written up", or after implement or transport-release. Not for answering a one-off "how does it work" question (use reverse-engineer), not for writing a functional specification (use spec-grill).
---

# documentation

Write the documentation the next developer needs, taken from the code, not from memory or old
specs. Every statement can be traced back to the source. What the code does not tell you, you
mark as an open question for the object owner instead of guessing.

## When to use

- A Z object or package with no documentation, before a handover or a change
- After a feature ships: the technical part of the Jira ticket or the Confluence page
- An interface (RFC, IDoc, OData, file) whose callers and data need to be on record

## When not to use

- A quick question about behaviour: use reverse-engineer
- A requirement that does not exist in code yet: use spec-grill
- SAP standard objects: link the SAP documentation instead

## How you reach the system

Say which setup you are using.

- **ABAP MCP server (read is enough).** Read the object, its includes, DDIC types and where-used
  live from DEV. This skill never writes to SAP.
- **Files exported with abapGit.** Document from the export. Callers outside the package are not
  visible; list them as "not checked" and ask.
- **Pasted code.** Document only what was pasted and say so at the top of the document.

## Workflow

**1. Read.** The object, everything it includes, the DDIC types it uses, and its where-used.

**2. Describe.**
- Purpose: one paragraph, in business terms first, then technical
- Entry points: transaction, report, method, function module, BAdI, RFC, job
- Inputs and outputs: parameters, selection screen, return values, exceptions, messages
- Data: tables and CDS views read, tables written (with the statement: INSERT, UPDATE, MODIFY,
  DELETE), update task or direct
- Calls: what it calls, and who calls it (where-used)
- Authorizations checked (authorization objects and fields)
- Configuration it depends on (customizing tables, TVARVC variables, constants)

**3. Draw it.** One Mermaid sequence diagram for the main path, from the entry point to the data
it writes. Keep it readable: under about 15 participants and messages.

**4. Risks and open questions.** Known risks visible in the code: missing error handling,
hard-coded values, performance on large volumes, dependencies on other systems. Open questions
for the owner: anything you inferred rather than read.

**5. STOP for confirmation.** The object owner reads the document and confirms or corrects it.
Mark it as confirmed only after that.

## Rules

- From the code only. If it is not in the code, it is an open question, not a statement.
- No table contents, no user names, no real customer or employee data in the document, not even
  as an example. Invent examples.
- Keep SAP object names exact and in uppercase so they can be searched.
- Write for a developer who joins next month: plain sentences, no internal jargon the team would
  need to explain.

## Output

Markdown, ready for Confluence or the Jira ticket:

1. Title (object name and one-line purpose), status: draft / confirmed by <owner>
2. Purpose
3. Entry points
4. Inputs and outputs
5. Data read and written
6. Calls and callers
7. Authorizations and configuration
8. Mermaid sequence diagram
9. Risks
10. Open questions
