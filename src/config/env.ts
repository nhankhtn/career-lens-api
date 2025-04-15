interface IConfigEnv {
  BASE_URL: string;
  PORT: number;
  NODE_ENV: string;
  JWT_SECRET: string;
  JWT_EXPIRE_IN: string;
  DATABASE_URL: string;
}

const configEnv: IConfigEnv = {
  BASE_URL: process.env.BASE_URL || `http://localhost:8080`,
  PORT: Number(process.env.PORT) || 8080,
  NODE_ENV: process.env.NODE_ENV || "development",

  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRE_IN: process.env.JWT_EXPIRE_IN || "1d",

  DATABASE_URL: process.env.DATABASE_URL || "",
};

export default configEnv;
