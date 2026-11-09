---
name: reverse-engineer
description: 'Explain how existing SAP ABAP code works or why it fails, by finding the entry point (transaction, report, BAdI, user exit, RFC, batch job) and following the call chain, data flow and where-used, with a Mermaid diagram and evidence from the code.'
agent: agent
---
<!-- Generated from skills/reverse-engineer/SKILL.md by scripts/build-copilot.mjs. Edit the SKILL.md, then run the script. -->

# reverse-engineer

Answer "how does this work" and "why does this happen" with evidence from the code, not from
general SAP knowledge. Custom SAP systems are full of user exits, BAdIs, enhancements and copied
programs; a confident answer from memory is often wrong. Every claim in the answer points to a
program, include and line.

## When to use

- Before a change: understand what the existing code does and what depends on it
- A behaviour nobody can explain ("the price changes after save", "the job skips some orders")
- Inherited code with no documentation and no owner
- Input for bugfix, refactor, cds-rewrite or a spec-grill session

## When not to use

- Writing up an object for Confluence: use documentation
- Fixing what you found: use bugfix or refactor
- The question is about SAP standard behaviour with no custom code involved: say so and point to
  the SAP documentation or note instead of tracing

## How you reach the system

Say which setup you are using; it decides how far the trace can go.

- **ABAP MCP server (read is enough).** Follow the call chain and where-used across the whole
  DEV system: SE93 transaction to program, CALL FUNCTION, method calls, BAdI implementations,
  enhancement implementations, user exits, RFC destinations. This skill never writes.
- **Files exported with abapGit.** Follow the chain inside the exported package only. Every call
  that leaves the package is a dead end: list it as "outside the export" and ask for it.
- **Pasted snippets.** Work only with what was pasted. Say clearly which parts of the chain a
  person has to piece together in the system.

## Workflow

**1. Pin the question.** Restate it as one sentence with an observable behaviour: "Why does
field X on screen Y show value Z for document type A?" If it is vague, ask one question to sharpen
it.

**2. Find the entry point.** Transaction (SE93), report, BAdI or enhancement spot, user exit,
RFC-enabled function module, IDoc process code, batch job step (SM37) or workflow. Name it with
the program and include.

**3. Follow the chain.** Walk from the entry point to where the behaviour happens. Record each hop:
caller, callee, include and line, and what data passes. Include implicit hops that are easy to
miss: active BAdI implementations, implicit enhancements, user exits (CMOD/SMOD), update task
function modules, field symbols changed by reference.

**4. Draw the data flow.** One Mermaid diagram (sequence or flowchart) from entry point to the
behaviour. Keep it to the hops that matter, under about 15 nodes.

**5. For a "why" question, rank the causes.** List likely causes in order, each with the code
lines that support it and what would rule it out. Then STOP: a person confirms the cause in the
debugger (breakpoint at the lines you name) before anyone fixes anything.

## Rules

- Evidence or nothing. Every statement names the object and line it comes from. If you are
  inferring, say "inferred" and why.
- Never read table contents to answer the question. Structure (DDIC) and code are enough; if the
  answer depends on customizing values, ask a person to check them and tell you.
- Never change code, not even a "quick test". This skill is read-only.
- Stay in the customer namespace for the trace detail. For SAP standard code, name the hop and
  move on unless the question is about it.
- If the trace leaves what you can see (another system over RFC, a package outside the export),
  stop the chain there and say so.

## Output

1. The question in one sentence
2. Entry point
3. Call chain as a numbered list (object, include, line, what happens)
4. Mermaid diagram
5. For "why": ranked causes with evidence and the debugger breakpoints that confirm each one
6. Open ends: what you could not see and who could fill it in
