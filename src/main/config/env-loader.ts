import dotenv from 'dotenv';

const stage = process.env.STAGE || 'dev';
dotenv.config({ path: `.env.${stage}` });

const requiredVariables = ['SWAPI_BASE_URL', 'DB_TABLE', 'AWS_REGION'] as const;

requiredVariables.forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(`Variable de entorno no definida: ${variable}`);
  }
});

const config = {
  SWAPI_BASE_URL: process.env.SWAPI_BASE_URL as string,
  DB_TABLE: process.env.DB_TABLE as string,
  AWS_REGION: process.env.AWS_REGION as string,
};

export default config;
