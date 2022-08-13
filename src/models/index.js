// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { PolicyHome, PolicyCar, Files, FileType, Client } = initSchema(schema);

export {
  PolicyHome,
  PolicyCar,
  Files,
  FileType,
  Client
};