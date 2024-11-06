import { AwsProvider } from '@cdktf/provider-aws/lib/provider';
import { TerraformStack } from 'cdktf';
import app from './app';

const REGION = process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION;
const ENDPOINT = 'http://localhost.localstack.cloud:4566';

export default class Stack extends TerraformStack {
  private awsProvider;

  constructor(id: string) {
    super(app, id);

    this.awsProvider = new AwsProvider(this, 'aws', {
      region: REGION,
      endpoints: [{
        s3Control: 'http://s3-control.localhost.localstack.cloud:4566',
        s3: 'http://s3.localhost.localstack.cloud:4566',
        sts: ENDPOINT,
      }],
  
      skipCredentialsValidation: true,
      skipMetadataApiCheck: 'true',
      skipRequestingAccountId: true,
    });
  }
}
