# SAP AI skills

10 skills that take an SAP ABAP change from a Jira ticket to a released transport with AI, one
skill per stage of the development cycle. They work in Claude Code as a plugin and in GitHub
Copilot as prompt files.

Each skill is a written procedure: when to use it, the steps, where it stops and waits for a
person, the rules, and what it hands back. The AI does the reading, writing and checking. People
approve the spec, choose the design, confirm the cause of a bug, review the diff and release the
transport.

## The 10 skills, in the order a change goes through them

| # | Stage | Skill | What it does |
|---|---|---|---|
| 1 | Specify | `spec-grill` | Asks the ticket author questions until the spec scores 8/10 or more, otherwise sends it back |
| 2 | Understand | `reverse-engineer` | Explains how existing code works or why it fails, with a call chain and a diagram |
| 3 | Build | `implement` | Two technical options, tests for each acceptance criterion, code, activation, checks |
| 4 | Test | `test-case` | ABAP Unit tests with test doubles, plus manual test scenarios for QAS |
| 5 | Review | `code-review` | ATC findings plus Clean ABAP, security and HANA performance checks, ordered by severity |
| 6 | Improve | `refactor` | Characterization tests first, then small steps; behaviour stays the same |
| 7 | Modernize | `cds-rewrite` | Moves data logic from ABAP into CDS views, proves the output is unchanged, measures runtime |
| 8 | Document | `documentation` | Docs for Confluence or Jira, written from the code, with a Mermaid diagram |
| 9 | Release | `transport-release` | Checks the transport is complete, writes the QAS test plan, PRD checklist and rollback plan |
| 10 | Run and fix | `bugfix` | From a short dump to the confirmed cause, a failing test, then the smallest fix |

A bug found in production starts the cycle again at Specify.

The spec-grill rubric, 10 points with the gate at 8: business goal and who benefits (1), affected
SAP objects named (2), current vs target behaviour (1), acceptance criteria as given/when/then (2),
test data and edge cases (1), authorizations and personal data (1), dependencies and side effects
(1), out of scope (1).

## Three ways to connect AI to SAP

Every skill says what it does in each of these setups, because the same skill does more or less
depending on what the AI can reach:

1. **An ABAP MCP server that can write, on DEV only.** AI reads the code live, writes into
   allowed packages, activates, runs ATC and ABAP Unit, and assigns the transport.
2. **A read-only ABAP MCP server.** AI reads live and runs the checks. A person pastes the code
   into ADT and activates it.
3. **Files exported with abapGit.** No MCP. AI works on the exported package; a person moves the
   code into SAP and runs the checks.

## Install in Claude Code

Inside a Claude Code session:

```
/plugin marketplace add marian-kamenistak/sap-ai-skills
/plugin install sap-abap@sap-ai-skills
```

Or from your shell:

```
claude plugin marketplace add marian-kamenistak/sap-ai-skills
claude plugin install sap-abap@sap-ai-skills
```

Claude picks the right skill from what you ask ("this report dumps with ITAB_DUPLICATE_KEY, fix
it"). You can also call one by name: `/sap-abap:spec-grill`, `/sap-abap:bugfix` and so on.

Then copy [`templates/CLAUDE.md`](templates/CLAUDE.md) into the root of your team repository and
fill it in: your release, Z/Y naming, the packages AI may write to, your ATC variant, and what must
never go to AI.

## Use with GitHub Copilot

Copy the `.github/` folder of this repository into your own repository:

- `.github/copilot-instructions.md` holds the shared rules (DEV only, no table contents, people
  release transports). Edit the `<...>` parts for your team.
- `.github/prompts/<skill>.prompt.md` holds the 10 procedures. In Copilot Chat, type `/` and the
  skill name, for example `/spec-grill`.

Copilot can also read `SKILL.md` files as agent skills from `.github/skills/` or `.claude/skills/`
in your repository. If your Copilot version supports skills, copy the `skills/` folder there
instead of using the prompt files.

Where this works, as of November 2026:

| Where | Custom instructions | Prompt files | Skills |
|---|---|---|---|
| VS Code | yes | yes | yes, agent mode |
| Visual Studio, JetBrains IDEs | yes | yes | yes, agent mode |
| Eclipse (Copilot for Eclipse) | yes | see below | see below |

Eclipse is where most ABAP developers work, so be careful here. GitHub's documentation lists
repository custom instructions as supported in Eclipse, but lists prompt files only for VS Code,
Visual Studio and JetBrains IDEs. The Copilot for Eclipse changelog says otherwise: version 0.18.0
added "skills and prompt files" and 0.21.0 made skills generally available, read from
`.github/skills/` or `.claude/skills/`. I haven't tested the prompt files in Eclipse yet. If they
don't show up, use the skills folder or paste the procedure into the chat.

The prompt files are generated from the skills, so both tools follow the same procedure. After you
change a `SKILL.md`, run:

```
node scripts/build-copilot.mjs          # rewrite .github/prompts/
node scripts/build-copilot.mjs --check  # fail if a prompt file is out of date
```

## Setting up the ABAP MCP server

SAP ships its own MCP server inside Eclipse with ADT 3.60 or newer. It runs on the developer's
laptop, works on releases from 7.31, and you can restrict it to the DEV project and to chosen
packages. See SAP Help: [Enabling the ADT MCP Server](https://help.sap.com/docs/abap-ai/generative-ai-in-abap-cloud/enabling-adt-mcp-server-6f6e72852b9746ffbe083d5a818fbbec).

- **Copilot in Eclipse** connects to it directly.
- **Claude Code** needs the community add-on [arc1](https://github.com/arc-mcp/arc1-adt-abap-mcp-ext)
  to read source code through it, or a community MCP server that talks to the ADT services of DEV
  directly (for example vibing-steampunk or mcp-abap-adt). Most community servers need release
  7.50 or newer.
- **No MCP allowed?** Install [abapGit](https://docs.abapgit.org/) on DEV, export the package to
  files and let AI work on those.

Whichever route you take, block the MCP tools that read table contents.

## How far can your team get?

Whether you get the full cycle or copy-paste into a chat depends on your IDE, your SAP release,
what IT allows and which AI tool you use. A short test scores your setup from 1 to 10 and gives
you the install steps for it: https://www.engineeringleaders.io/academy/sap-skills

## Safety rules

These are built into every skill:

- **DEV only.** AI never connects to QAS or production.
- **No data.** No production data, no personal data, no table contents, not even from DEV. Code
  and DDIC are enough. Tests use invented data.
- **A person approves.** Each skill stops at its gates: the spec score, the technical option, the
  design, the cause of a bug, the diff.
- **People release transports.** AI may create a transport and assign objects to it. Releasing it
  and importing into QAS and production stay with people and follow your process.
- **Customer namespace only.** No changes to SAP standard objects.

## Sources for the formats used

- Claude Code plugins and marketplaces: https://code.claude.com/docs/en/plugin-marketplaces and
  https://code.claude.com/docs/en/plugins-reference
- Copilot custom instructions support by IDE: https://docs.github.com/en/copilot/reference/custom-instructions-support
- Copilot prompt files: https://docs.github.com/en/copilot/tutorials/customization-library/prompt-files/your-first-prompt-file
  and https://code.visualstudio.com/docs/copilot/customization/prompt-files
- Copilot agent skills: https://docs.github.com/en/copilot/concepts/agents/about-agent-skills
- Copilot for Eclipse: https://github.com/microsoft/copilot-for-eclipse (README and CHANGELOG)

## License

MIT. See [LICENSE](LICENSE).
