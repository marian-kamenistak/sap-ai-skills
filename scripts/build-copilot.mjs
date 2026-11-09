#!/usr/bin/env node
// Generates .github/prompts/<skill>.prompt.md from skills/<skill>/SKILL.md, so the Copilot prompt
// files never drift from the Claude Code skills. The SKILL.md files are the only source to edit.
//
//   node scripts/build-copilot.mjs           write the prompt files
//   node scripts/build-copilot.mjs --check   exit 1 if any prompt file is missing or out of date
//
// No dependencies. It also checks the SKILL.md frontmatter it relies on.

import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skillsDir = join(root, 'skills');
const promptsDir = join(root, '.github', 'prompts');
const check = process.argv.includes('--check');

function parse(file, dir) {
  const text = readFileSync(file, 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${file}: no YAML frontmatter`);
  const meta = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(': ');
    if (i < 1) throw new Error(`${file}: unexpected frontmatter line "${line}"`);
    meta[line.slice(0, i)] = line.slice(i + 2);
  }
  const { name, description } = meta;
  if (name !== dir) throw new Error(`${file}: name "${name}" does not match folder "${dir}"`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) throw new Error(`${file}: name is not kebab-case`);
  if (!description) throw new Error(`${file}: description missing`);
  if (description.length > 1024) throw new Error(`${file}: description over 1024 characters`);
  // Plain YAML scalars break on ": " and on a leading quote or indicator character.
  if (description.includes(': ') || /^["'&*!|>%@`{[]/.test(description)) {
    throw new Error(`${file}: description is not a safe plain YAML scalar`);
  }
  return { name, description, body: m[2].trimStart() };
}

const firstSentence = (s) => (s.match(/^(.*?\.)(\s|$)/) ?? [, s])[1];
const yamlQuote = (s) => `'${s.replace(/'/g, "''")}'`;

function render({ name, description, body }) {
  return [
    '---',
    `name: ${name}`,
    `description: ${yamlQuote(firstSentence(description))}`,
    'agent: agent',
    '---',
    `<!-- Generated from skills/${name}/SKILL.md by scripts/build-copilot.mjs. Edit the SKILL.md, then run the script. -->`,
    '',
    body.trimEnd(),
    '',
  ].join('\n');
}

const skills = readdirSync(skillsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

if (!existsSync(promptsDir)) mkdirSync(promptsDir, { recursive: true });

let drift = 0;
for (const dir of skills) {
  const skill = parse(join(skillsDir, dir, 'SKILL.md'), dir);
  const out = join(promptsDir, `${dir}.prompt.md`);
  const next = render(skill);
  const current = existsSync(out) ? readFileSync(out, 'utf8') : null;
  if (current === next) continue;
  if (check) {
    console.error(`out of date: .github/prompts/${dir}.prompt.md`);
    drift++;
  } else {
    writeFileSync(out, next);
    console.log(`wrote .github/prompts/${dir}.prompt.md`);
  }
}

const stale = readdirSync(promptsDir).filter(
  (f) => f.endsWith('.prompt.md') && !skills.includes(f.replace(/\.prompt\.md$/, '')),
);
for (const f of stale) {
  console.error(`no matching skill for .github/prompts/${f}; delete it`);
  drift++;
}

if (drift) process.exit(1);
console.log(`${skills.length} skills, prompt files ${check ? 'up to date' : 'built'}.`);
