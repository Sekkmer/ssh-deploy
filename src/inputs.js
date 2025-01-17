const inputNames = [
  'SSH_CONFIG',
  'SSH_PRIVATE_KEY',
  'SOURCE',
  'TARGET',
  'ARGS',
  'EXCLUDE'
];

const inputs = {
  GITHUB_WORKSPACE: process.env.GITHUB_WORKSPACE
};
// Get inputs from ENV or WITH workflow settings
inputNames.forEach((input) => {
  inputs[input] = process.env[input] || process.env[`INPUT_${input}`];
});

module.exports = inputs;
