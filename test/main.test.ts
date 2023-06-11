import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { OrganizationStack } from '../src/stacks/OrganizationStack';

test('Snapshot', () => {
  const app = new App();
  const stack = new OrganizationStack(app, 'test', {
    accountEmail: 'test@email.com',
    accountName: 'test',
    organizationUnitName: 'test',
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT as string,
      region: process.env.CDK_DEFAULT_REGION as string,
    },
  });

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});