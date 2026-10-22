// Rewrites the block between REPOS:START / REPOS:END in README.md with
// live tables: most starred, recently pushed, most active (last 90 days).
// Needs Node 18+ and GITHUB_TOKEN. On any API failure the README is left untouched.
import { readFile, writeFile } from "node:fs/promises";

const OWNER = "ryyansafar";
const EXCLUDE = new Set([
  "ryyansafar",
  "ryyansafar.github.io",
  "w3schools-test.github.io",
  "hello-world",
  "git_test",
  "rybo-learns-flask",
  "too-lazy-to-write-homework-inator",
  "Tic-Tac-Toe",
]);
const WINDOW_DAYS = 90;
const START = "<!-- REPOS:START -->";
const END = "<!-- REPOS:END -->";

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "profile-readme-updater",
  ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
};

async function api(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}

const link = (r) => `[${r.name}](${r.html_url})`;
const desc = (r) => (r.description ?? "").replace(/\|/g, "/").slice(0, 90) || "-";
const table = (rows, cols) =>
  ["| Repo | " + cols[0] + " | About |", "|---|---|---|", ...rows.map((r) => `| ${link(r)} | ${cols[1](r)} | ${desc(r)} |`)].join("\n");

async function commitCount(name, since) {
  const commits = await api(`/repos/${OWNER}/${name}/commits?author=${OWNER}&since=${since}&per_page=100`);
  return commits.length;
}

async function main() {
  const all = await api(`/users/${OWNER}/repos?per_page=100&type=owner`);
  const repos = all.filter((r) => !r.fork && !r.archived && !r.private && !EXCLUDE.has(r.name));

  const starred = [...repos].filter((r) => r.stargazers_count > 0)
    .sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 3);
  const recent = [...repos].sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at)).slice(0, 4);

  const since = new Date(Date.now() - WINDOW_DAYS * 864e5).toISOString();
  const candidates = recent.concat(starred).filter((r, i, a) => a.findIndex((x) => x.name === r.name) === i);
  const counted = await Promise.all(candidates.map(async (r) => ({ ...r, commits: await commitCount(r.name, since) })));
  const active = counted.filter((r) => r.commits > 0).sort((a, b) => b.commits - a.commits).slice(0, 3);

  const day = (r) => r.pushed_at.slice(0, 10);
  const sections = [
    starred.length && `**Most starred**\n\n${table(starred, ["Stars", (r) => r.stargazers_count])}`,
    `**Recently pushed**\n\n${table(recent, ["Last push", day])}`,
    active.length && `**Most active, last ${WINDOW_DAYS} days**\n\n${table(active, ["Commits", (r) => r.commits])}`,
  ].filter(Boolean);

  const block = `${START}\n\n${sections.join("\n\n")}\n\n_Auto-generated daily from the GitHub API._\n\n${END}`;
  const readme = await readFile("README.md", "utf8");
  const s = readme.indexOf(START);
  const e = readme.indexOf(END);
  if (s === -1 || e === -1) throw new Error("README markers not found");
  await writeFile("README.md", readme.slice(0, s) + block + readme.slice(e + END.length));
}

main().catch((err) => {
  console.error("Update skipped:", err.message);
  process.exit(0);
});
