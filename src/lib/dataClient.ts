import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

// Singleton data client used app-wide
export const dataClient = generateClient<Schema>();

