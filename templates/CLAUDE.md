# <Team name> SAP ABAP development

Copy this file into the root of your team repository and fill in every `<...>`. Claude Code reads
it at the start of every session. For GitHub Copilot, put the same rules into
`.github/copilot-instructions.md`.

## Our system

- Development system: `<SID>`, client `<nnn>`. This is the only system AI may connect to.
- Release: `<S/4HANA 2023 / ECC 6.0 EhP8 on SAP_BASIS 7.50 / ...>`
- Language features: use only syntax our release supports. `define view entity` needs SAP_BASIS
  7.55 or newer; below that, use classic `define view`.
- How AI reaches the system: `<ABAP MCP server with write / read-only MCP server / abapGit export>`
- Transport route: `<DEV -> QAS -> PRD through TMS / ChaRM>`

## Naming

- Customer namespace: `<Z / Y / /COMPANY/>`. Never create or change objects outside it.
- Packages AI may write to: `<ZPKG_SALES_EXT, ZPKG_FI_REPORTS>`. Nothing else.
- Classes `<ZCL_>`, interfaces `<ZIF_>`, exceptions `<ZCX_>`, CDS interface views `<ZI_>`,
  consumption views `<ZC_>`, test classes `<LTCL_>`
- Variables: `<our prefix rules, or "no Hungarian prefixes, per Clean ABAP">`

## Code style

- Clean ABAP: https://github.com/SAP/styleguides/blob/main/clean-abap/CleanABAP.md
- ATC check variant: `<variant name>`. Code is ready for review only with zero priority 1 and 2
  findings.
- Every new class has ABAP Unit tests. Use `CL_OSQL_TEST_ENVIRONMENT` for database access.
- `<Anything else: logging framework, message class, exception strategy>`

## What must never go to AI

- Production data of any kind, and no connection to QAS or production systems
- Personal data: names, addresses, bank details, HR, health, customer and employee records
- Table contents, also from DEV. Code and DDIC (table structures) are enough.
- Passwords, tokens, RFC destination credentials
- Short dumps and logs only after personal data is removed from variable values

## How we work with AI

- DEV only. AI never connects to QAS or production.
- A person approves every gate the skills stop at: the spec score, the technical option, the
  design, the cause of a bug, the diff.
- AI may create a transport and assign objects to it. Transports are released by people, and
  imports into QAS and production follow our process.
- One change per transport.
- Tickets: `<Jira project key>`. Every change starts from a specification scored 8/10 or more
  (spec-grill).

## Contacts

- Code owner for questions AI cannot answer: `<role, not a personal name>`
- Basis (transports, ADT services, system access): `<team or channel>`
