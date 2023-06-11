import { awscdk, github } from 'projen';
import { GithubCredentials } from 'projen/lib/github';
import { error } from 'projen/lib/logging';

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.79.1',
  defaultReleaseBranch: 'main',
  name: 'cdk-organizations-stacks',
  projenrcTs: true,
  buildWorkflow: true,
  workflowBootstrapSteps: [
    {
      name: 'configure aws credentials',
      uses: 'aws-actions/configure-aws-credentials@v1',
      with: {
        'role-to-assume': 'arn:aws:iam::${{ secrets.AWS_PROJEN_BUILD_ACCOUNT_ID }}:role/GitHubActions',
        'role-duration-seconds': 900,
        'aws-region': '${{ secrets.AWS_PROJEN_BUILD_REGION }}',
        'role-skip-session-tagging': true,
        'role-session-name': 'GitHubActions',
      },
    },
    {
      uses: 'actions/setup-node@v3',
      with: {
        'node-version': '18.x',
      },
    },
    {
      name: 'install dependencies',
      run: 'npm install --global yarn',
    },
  ],
  pullRequestTemplate: false,
  githubOptions: {
    pullRequestLint: true,
  },
  depsUpgrade: true,
  depsUpgradeOptions: {
    workflowOptions: {
      projenCredentials: GithubCredentials.fromApp({
        permissions: {
          pullRequests: github.workflows.AppPermission.WRITE,
          contents: github.workflows.AppPermission.WRITE,
          workflows: github.workflows.AppPermission.WRITE,
        },
      }),
    },
  },
  deps: [
    '@pepperize/cdk-organizations',
  ],
  context: {
    '@aws-cdk/core:bootstrapQualifier': 'orgs',
  },
  gitignore: [
    '*.env',
  ],
  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});

project.eslint?.addRules({
  'import/no-extraneous-dependencies': [error, 1],
});

project.jest?.addTestMatch('**/?(*.)@(spec|test).[tj]s?(x)');

project.github!.tryFindWorkflow('build')!.file!.addOverride('jobs.build.permissions.id-token', 'write');
project.github!.tryFindWorkflow('upgrade')!.file!.addOverride('jobs.upgrade.permissions.id-token', 'write');


project.synth();