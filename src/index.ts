import CustomerInfrastructure from './customerInfrastructure';
import app from './app';

const handler = async (action: string) => {
  const infrastructure = new CustomerInfrastructure({ id: 'test' });

  switch (action) {
    case 'plan': await app.plan(infrastructure); break;
    case 'apply': await app.apply(infrastructure); break;
    case 'destroy': await app.destroy(infrastructure); break;
    default:
  }
};

const action = process.argv[2]?.toLowerCase();

switch (action) {
  case 'plan': case 'apply': case 'destroy': break;
  default: throw new Error('Invalid action');
}
handler(action);
