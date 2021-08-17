#!/usr/bin/env node
const nodeRsync = require('rsyncwrapper');

const { validateRsync, validateInputs } = require('./rsyncCli');
const { addSshConfig } = require('./sshKey');

const {
  SSH_CONFIG, SSH_PRIVATE_KEY,
  SOURCE, TARGET, ARGS, EXCLUDE,
  GITHUB_WORKSPACE
} = require('./inputs');

const defaultOptions = {
  ssh: true,
  sshCmdArgs: ['-o StrictHostKeyChecking=no'],
  recursive: true
};

console.log('[general] GITHUB_WORKSPACE: ', GITHUB_WORKSPACE);

const sshDeploy = (() => {
  const rsync = ({ src, dest, args, exclude }) => {
    console.log(`[Rsync] Starting Rsync Action: ${src} to ${dest}`);
    if (exclude) console.log(`[Rsync] exluding folders ${exclude}`);

    try {
      // RSYNC COMMAND
      nodeRsync({
        src, dest: `DeployTarget:${dest}`, args, excludeFirst: exclude, ...defaultOptions
      }, (error, stdout, stderr, cmd) => {
        if (error) {
          console.error('⚠️ [Rsync] error: ', error.message);
          console.log('⚠️ [Rsync] stderr: ', stderr);
          console.log('⚠️ [Rsync] stdout: ', stdout);
          console.log('⚠️ [Rsync] cmd: ', cmd);
          process.abort();
        } else {
          console.log('✅ [Rsync] finished.', stdout);
        }
      });
    } catch (err) {
      console.error('⚠️ [Rsync] command error: ', err.message, err.stack);
      process.abort();
    }
  };

  const init = ({ src, dest, args, config, privateKeyContent, exclude = [] }) => {
    validateRsync(() => {
      addSshConfig(config, privateKeyContent);
      rsync({ src, dest, args, exclude });
    });
  };

  return {
    init
  };
})();

const run = () => {
  validateInputs({ SSH_PRIVATE_KEY, SSH_CONFIG });

  sshDeploy.init({
    src: `${GITHUB_WORKSPACE}/${SOURCE || ''}`,
    dest: TARGET || '',
    args: ARGS ? [ARGS] : ['-rltgoDzvO'],
    config: SSH_CONFIG,
    privateKeyContent: SSH_PRIVATE_KEY,
    exclude: (EXCLUDE || '').split(',').map((item) => item.trim()) // split by comma and trim whitespace
  });
};

run();
