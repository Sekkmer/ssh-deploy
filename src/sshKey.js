const { writeFileSync } = require('fs');
const { join } = require('path');

const {
  validateDir,
  validateFile
} = require('./helpers');

const {
  HOME
} = process.env;

const IDENTITY_FILE_NAME = 'id_github_ci';
const SSH_DIR = join(HOME || __dirname, '.ssh');

/**
 * @param {string} template - ssh config file template
 */
function makeConfig(template) {
  return template
    .replace('{TARGET}', 'DeployTarget')
    .replace('{IDENTITY_FILE}', join(SSH_DIR, IDENTITY_FILE_NAME));
}

/**
 * @param {string} config - ssh config file template
 * @param {string} key - ssh private key file
 */
const addSshConfig = (config, key) => {
  const identityPath = join(SSH_DIR, IDENTITY_FILE_NAME);
  const configPath = join(SSH_DIR, 'config');

  validateDir(SSH_DIR);
  validateFile(join(SSH_DIR, 'known_hosts'));

  try {
    writeFileSync(configPath, makeConfig(config), {
      encoding: 'utf8',
      mode: 0o600
    });
  } catch (e) {
    console.error('⚠️ writeFileSync error', configPath, e.message);
    process.abort();
  }

  console.log('✅ Ssh config added to `.ssh` dir ', configPath);

  try {
    writeFileSync(identityPath, key, {
      encoding: 'utf8',
      mode: 0o600
    });
  } catch (e) {
    console.error('⚠️ writeFileSync error', identityPath, e.message);
    process.abort();
  }

  console.log('✅ Ssh key added to `.ssh` dir ', identityPath);
};

module.exports = {
  addSshConfig
};
