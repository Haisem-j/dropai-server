declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_AUTH_TOKEN: string;
      NODE_ENV: "development" | "production";
      PORT?: string;
      PWD: string;
      OPENAI_API_KEY: string;
      STRIPE_KEY: string;
      CLIENT_URL: string;
      STRIPE_WEBHOOK_SEC: string;
      PRODUCTION_ENV: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
