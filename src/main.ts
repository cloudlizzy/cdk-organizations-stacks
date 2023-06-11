import { App } from 'aws-cdk-lib';
import { OrganizationStack, OrganizationStackProps } from './stacks/OrganizationStack';


// for development, use account/region from cdk cli
const props: OrganizationStackProps = {
  accountEmail: process.env.ACCOUNT_EMAIL ?? 'test@email.com',
  accountName: process.env.ACCOUNT_NAME ?? 'test',
  organizationUnitName: process.env.ORGANIZATION_UNIT_NAME ?? 'test',
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT as string,
    region: process.env.CDK_DEFAULT_REGION as string,
  },
};

const app = new App();

new OrganizationStack(app, 'OrganizationStack', props);

app.synth();