---
name: transport-release
description: Prepare an SAP transport for release, checking that nothing is missing (dependent DDIC, texts, message classes, customizing, objects locked in other transports, cross-transport dependencies) and writing the transport description, a QAS test plan, a PRD checklist and a rollback plan. AI prepares, people release and import. Use when someone says "prepare the transport", "is this transport complete", "check before release", "write the transport description", "what do we need for the go-live", "release notes for this change", "rollback plan", or a change in DEV is finished. Not for building the change (use implement), not for reviewing code quality (use code-review).
---

# transport-release

Get a finished change from DEV to production without the classic surprises: an import that fails
in QAS because a data element was in another transport, a missing text, a customizing entry
nobody recorded. This skill checks the transport, writes what the release needs, and stops.
Releasing the transport and importing it into QAS and production stay with people, following the
team's process (TMS, ChaRM or another).

## When to use

- A change in DEV is finished and reviewed
- Before a go-live, to check a set of transports and their order
- Writing the transport description and the release note for Jira

## When not to use

- The code is not finished or not reviewed: use implement and code-review first
- Emergency fixes directly in production: not supported, never

## How you reach the system

Say which setup you are using.

- **ABAP MCP server that can write (DEV only).** Read the transport and its objects. Add a
  missing object to the transport only after a person approves it. Never release.
- **Read-only ABAP MCP server.** Read the transport and its objects and report what is missing;
  a person adds objects in SE09/SE10 or ADT.
- **No transport access (files or a pasted object list).** Check the list a person gives you
  against the exported code and DDIC. Say clearly that the check covers only that list.

## Workflow

**1. Read the transport.** List the objects and tasks, the owner, the target system, and the
Jira ticket it belongs to.

**2. Check completeness.** For each object, check what it depends on and whether that is in this
transport, already in production, or somewhere else:
- DDIC: tables, structures, data elements, domains, table types, search helps, lock objects
- Texts: text elements, message classes and messages, translations if the team ships them
- Code: includes, classes, interfaces, function groups, enhancement and BAdI implementations
- CDS: view entities, access controls, metadata extensions, service definitions and bindings
- Customizing and other: customizing entries (in a customizing request), number ranges,
  authorization objects and roles, ICF services, background job variants
- Objects still locked in other open transports, and objects in `$TMP` that cannot travel
- Cross-transport dependencies: does this change need another transport imported first? Give the
  import order.

**3. Report gaps, then STOP.** List every gap with the fix ("add data element ZDE_X, now in local
object $TMP"). A person decides; with write access and approval you add objects to the transport.

**4. Write the release documents.**
- Transport description: ticket number, what changes for users, objects by type, test evidence
- QAS test plan: the acceptance criteria from the spec as test steps, plus regression checks for
  callers in the where-used list, with the roles to test with
- PRD checklist: import order, preconditions (other transports, customizing, jobs to stop and
  restart), post-import checks, who confirms
- Rollback plan: transports cannot be undone, so say what reverts the change. Usually a new
  transport with the previous version (from version management), plus any data or customizing
  that must be restored, and who decides to roll back

**5. Hand over.** A person releases the transport and drives the imports.

## Rules

- AI never releases a transport and never imports into QAS or production.
- DEV only. Never connect to QAS or production, not even to "check the import".
- Never read table contents. Customizing is checked by the existence of the entry in the
  transport, not by reading production values.
- One change per transport. If unrelated objects are inside, flag them.

## Output

1. Object list with dependency status (in this transport / already in PRD / missing / elsewhere)
2. Gaps and fixes
3. Transport description
4. QAS test plan
5. PRD checklist with import order
6. Rollback plan
