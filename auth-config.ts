import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, emailOTP } from "better-auth/plugins";

const placeholderDatabase = undefined as unknown as Parameters<
  typeof drizzleAdapter
>[0];

export const auth = betterAuth({
  database: drizzleAdapter(placeholderDatabase, {
    provider: "pg",
    usePlural: true,
  }),

  socialProviders: {
    google: {
      clientId: "placeholder",
      clientSecret: "placeholder",
    },
  },

  plugins: [
    admin(),
    emailOTP({
      async sendVerificationOTP() {},
    }),
  ],

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
        input: false,
      },
      firstName: {
        type: "string",
        required: false,
      },
      lastName: {
        type: "string",
        required: false,
      },
      submissionCount: {
        type: "number",
        required: true,
        defaultValue: 0,
        input: false,
      },
    },
  },
});
