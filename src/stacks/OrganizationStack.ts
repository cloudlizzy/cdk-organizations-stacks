import { Account, FeatureSet, Organization, OrganizationalUnit } from '@pepperize/cdk-organizations';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';


export interface OrganizationStackProps extends StackProps {
  organizationUnitName: string;
  accountName: string;
  accountEmail: string;
  env: {
    region: string;
    account: string;
  };
}

export class OrganizationStack extends Stack {
  constructor(scope: Construct, id: string, props: OrganizationStackProps) {
    super(scope, id, props);

    // define resources here...
    const organization = new Organization(this, 'Organization', {
      featureSet: FeatureSet.ALL,
    });

    // Create an organizational unit (OU)
    const organizationUnit = new OrganizationalUnit(this, 'OrganizationalUnit', {
      organizationalUnitName: props.organizationUnitName,
      parent: organization.root,
    });

    // Create an account
    const account = new Account(this, 'Account', {
      accountName: props.accountName,
      email: props.accountEmail,
      parent: organizationUnit,
    });

    if (account) {
    }
  }
}
