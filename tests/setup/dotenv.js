/**
 * Read .env files in unit tests
 */
import { config } from 'dotenv';

const env = config();
console.info('=====env=====', env.parsed);

import.meta.env = env.parsed;
