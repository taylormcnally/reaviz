
const { parse } = require('semver');
const { execSync } = require('child_process');

(() => {
  const json = require('../package.json');

  // determine commit from either circle ci or last git commit
  let commit = process.env.CIRCLE_SHA1;
  if (!commit) {
    const lastCommit = execSync('git rev-parse HEAD');
    commit = lastCommit.toString().trim();
  }

  // shorten commit
  commit = commit.slice(0, 7);

  // construct new version from base version 2.0.0 to become 2.0.0+dev.shortsha
  const version = parse(json.version);
  const newVersion = `${version.major}.${version.minor}.${version.patch}-dev.master-${commit}`;
  console.info('publishing new version', newVersion);

  const script = `npm publish --access public --no-git-tag-version --new-version ${version} --tag dev`;
  const output = execSync(script);
  console.info(`Published Dev /r/n -> ${output}`);
})();
