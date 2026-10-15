const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getGitData() {
  let commitHash = (process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || '').slice(0, 7);
  let commitCount = 0;
  let branch = process.env.VERCEL_GIT_COMMIT_REF || process.env.GITHUB_REF_NAME || '';
  let commitMessage = (process.env.VERCEL_GIT_COMMIT_MESSAGE || '').trim();
  let buildDate = new Date().toISOString().slice(0, 10);

  try {
    if (!commitHash) {
      commitHash = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    }
  } catch {
    commitHash = 'dev';
  }

  try {
    const countStr = execSync('git rev-list --count HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    commitCount = parseInt(countStr, 10) || 1;
  } catch {
    commitCount = 1;
  }

  try {
    if (!branch) {
      branch = execSync('git rev-parse --abbrev-ref HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    }
  } catch {
    branch = 'main';
  }

  try {
    if (!commitMessage) {
      commitMessage = execSync('git log -1 --format=%s', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    }
  } catch {
    commitMessage = 'Latest updates';
  }

  try {
    const gitDate = execSync('git log -1 --format=%cd --date=short', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    if (gitDate) buildDate = gitDate;
  } catch {
    // fallback
  }

  const version = `v1.0.${commitCount}`;

  return {
    version,
    commitHash,
    commitCount,
    branch,
    commitMessage,
    buildDate,
    buildTimestamp: new Date().toISOString(),
    repoUrl: 'https://github.com/jh-jazer/Alterjot',
    commitUrl: commitHash !== 'dev' ? `https://github.com/jh-jazer/Alterjot/commit/${commitHash}` : 'https://github.com/jh-jazer/Alterjot',
  };
}

const versionData = getGitData();
const targetPath = path.join(__dirname, '..', 'src', 'version.json');

fs.writeFileSync(targetPath, JSON.stringify(versionData, null, 2) + '\n', 'utf8');
console.log(`[Version Generator] Generated version.json: ${versionData.version} (${versionData.commitHash}) on branch ${versionData.branch}`);
