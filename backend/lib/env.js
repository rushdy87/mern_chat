import 'dotenv/config';
const env = process.env;

export const requireEnv = (key) => {
  const value = env[key];
  if (value === undefined || value === '') {
    throw new Error(`${key} is not defined in environment variables`);
  }
  return value;
};

export const envValue = (key, defaultValue = undefined) => {
  const value = env[key];
  return value === undefined || value === '' ? defaultValue : value;
};

export { env };
