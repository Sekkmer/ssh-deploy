# ssh deployments

Deploy code with rsync over ssh, using NodeJS.

NodeJS version is more than a minute `faster` than simple Docker version.

This GitHub Action deploys specific directory from `GITHUB_WORKSPACE` to a folder on a server via rsync over ssh, using NodeJS.

This action would usually follow a build/test action which leaves deployable code in `GITHUB_WORKSPACE`, eg `dist`;

# Configuration

Pass configuration with `env` vars

##### 1. `SSH_PRIVATE_KEY` [required]

Private key part of an SSH key pair.
The public key part should be added to the `authorized_keys` file on the server that receives the deployment.

More info for SSH keys: https://www.ssh.com/ssh/public-key-authentication

The keys should be generated using the PEM format. You can use this command

```
ssh-keygen -m PEM -t rsa -b 4096
```

##### 2. `SSH_CONFIG` [required]

SSH config template file `{TARGET}` `{IDENTITY_FILE}` will be replaced

```
Host {TARGET}
    HostName example.com
    User deployer
    Port 22
    IdentityFile {IDENTITY_FILE}
```

##### 5. `ARGS` (optional, default '-rltgoDzvO')

For any initial/required rsync flags, eg: `-avzr --delete`

##### 6. `SOURCE` (optional, default '')

The source directory, path relative to `$GITHUB_WORKSPACE` root, eg: `dist/`

##### 7. `TARGET` (optional, default '')

The target directory

##### 8. `EXCLUDE` (optional, default '')

path to exclude separated by `,`, ie: `/dist/, /node_modules/`

# Usage

Use the latest version from Marketplace,eg: ssh-deploy@v2
or use the latest version from a branch, eg: ssh-deploy@main

```
  - name: Deploy to Staging server
    uses: Sekkmer/ssh-deploy@main
    env:
      SSH_PRIVATE_KEY: ${{ secrets.SERVER_SSH_KEY }}
      ARGS: "-rltgoDzvO"
      SOURCE: "dist/"
      SSH_CONFIG: ${{ secrets.SSH_CONFIG }}
      EXCLUDE: "/dist/, /node_modules/"
```

# Example usage in workflow

```
name: Node CI

on: [push]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v1
    - name: Install Node.js
      uses: actions/setup-node@v1
      with:
        node-version: '10.x'
    - name: Install npm dependencies
      run: npm install
    - name: Run build task
      run: npm run build --if-present
    - name: Deploy to Server
      uses: easingthemes/ssh-deploy@main
      env:
          SSH_PRIVATE_KEY: ${{ secrets.SERVER_SSH_KEY }}
          ARGS: "-rltgoDzvO --delete"
          SOURCE: "dist/"
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          TARGET: ${{ secrets.REMOTE_TARGET }}
          EXCLUDE: "/dist/, /node_modules/"
```

## Disclaimer

Check your keys. Check your deployment paths. And use at your own risk.
