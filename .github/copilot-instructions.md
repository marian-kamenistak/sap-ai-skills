# SAP ABAP development rules

These rules apply to every chat and every prompt file in this repository. The prompt files in
`.github/prompts/` (`/spec-grill`, `/implement`, `/bugfix` and the rest) carry the step-by-step
procedures. Edit the `<...>` parts for your team.

## The system

- Work only against the development system (DEV). Never connect to QAS or production.
- Release: `<your release>`. Use only syntax it supports. `define view entity` needs SAP_BASIS
  7.55 or newer.
- Customer namespace: `<Z / Y>`. Never change SAP standard objects; use the enhancement framework
  where a change is needed.
- Write only to these packages: `<allowed packages>`.

## How you reach the code

Say at the start which setup you are using, because it decides what you can do:

- An ABAP MCP server that can write (DEV only): read, change, activate, run ATC and ABAP Unit.
- A read-only ABAP MCP server: read and run checks; a person pastes and activates the code.
- Files exported with abapGit: work on the files; a person moves the code into SAP and runs the
  checks.

## Never

- Never read or ask for table contents, production data or personal data (names, addresses,
  bank, HR or health data). Code and DDIC are enough. Invent test data.
- Never put passwords, tokens or credentials into code, files or chat.
- Never release a transport or import into QAS or production. AI may create a transport and
  assign objects; people release it.

## Always

- Stop and ask a person at every approval gate in the procedure: spec score, technical option,
  design, cause of a bug, the diff.
- Back every claim about the code with the object and line it comes from.
- Follow Clean ABAP: https://github.com/SAP/styleguides/blob/main/clean-abap/CleanABAP.md
- New code gets ABAP Unit tests, with `CL_OSQL_TEST_ENVIRONMENT` for database access.
- One change per transport.
