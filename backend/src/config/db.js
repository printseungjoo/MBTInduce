import dotenv from "dotenv";

dotenv.config();

export function getDbConfig() {
  return {
    url: process.env.DATABASE_URL || "",
  };
}

