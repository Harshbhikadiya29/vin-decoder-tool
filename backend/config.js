const dotenv = require('dotenv');
const env = process.env.NODE_ENV || 'development';
switch (env) {
  case 'development':
    dotenv.config({ path: '.env.development' });
    break;
  case 'test':
    dotenv.config({ path: '.env.test' });
    break;
  case 'staging':
    dotenv.config({ path: '.env.staging' });
    break;
  case 'production':
    dotenv.config();
    break;
  default:
    throw new Error(`Unknown environment: ${env}`);
}