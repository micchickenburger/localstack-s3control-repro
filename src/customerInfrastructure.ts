import { S3AccessPoint } from '@cdktf/provider-aws/lib/s3-access-point';
import Stack from './stack';

const SITES_BUCKET_NAME = 'sites';

class CustomerInfrastructure extends Stack {
  constructor({ id }: { id: string}) {
    super(id);

    new S3AccessPoint(this, 'access-point', {
      name: 'test',
      bucket: SITES_BUCKET_NAME,
    });
  }
}

export default CustomerInfrastructure;
