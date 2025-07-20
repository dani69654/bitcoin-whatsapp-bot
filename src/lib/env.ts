import { config } from 'dotenv';
config();

const requireEnv = (env: string) => {
  const v = process.env[env];
  if (!v) {
    throw new Error(`Missing env variable ${env}`);
  }
  return v;
};

export const env = {
  waGroupName: requireEnv('WA_GROUP_NAME'),
};
