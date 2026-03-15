import { sendSignInOtpEmail } from "@/lib/send-otp-email";
import { DbClientService } from "@/lib/services/dbClient-service";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, emailOTP } from "better-auth/plugins";
import { Config, Effect } from "effect";

const adminEmailsConfig = Config.array(Config.string(), "ADMIN_EMAILS").pipe(
  Config.withDefault([]),
  Config.map((emails) => emails.map((email) => email.trim().toLowerCase())),
);

function getLocalTrustedOrigins(baseUrl: string): string[] {
  const defaults = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
  ];

  return Array.from(new Set([baseUrl, ...defaults]));
}

export class AuthService extends Effect.Service<AuthService>()("AuthService", {
  effect: Effect.gen(function* () {
    const db = yield* DbClientService;

    const adminEmails = yield* adminEmailsConfig;
    const baseUrl =
      process.env.BETTER_AUTH_URL ??
      process.env.NEXT_PUBLIC_BASE_URL ??
      "http://localhost:3000";
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const socialProviders =
      googleClientId && googleClientSecret
        ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            prompt: "select_account" as const,
            mapProfileToUser: (profile: {
              given_name?: string;
              family_name?: string;
            }) => {
              return {
                firstName: profile.given_name,
                lastName: profile.family_name,
              };
            },
          },
        }
        : undefined;

    const auth = betterAuth({
      baseURL: baseUrl,
      trustedOrigins: getLocalTrustedOrigins(baseUrl),
      database: drizzleAdapter(db, { provider: "pg", usePlural: true }),
      socialProviders,
      plugins: [
        admin(),
        emailOTP({
          async sendVerificationOTP({ email, otp }) {
            const { serverRuntime } = await import("@/lib/server-runtime");
            await serverRuntime.runPromise(sendSignInOtpEmail(email, otp));
          },
          otpLength: 6,
          expiresIn: 300, // 5 minutes
          allowedAttempts: 3,
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
      databaseHooks: {
        user: {
          create: {
            before: async (user) => {
              const normalizedUserEmail = user.email.trim().toLowerCase();
              const role = adminEmails.includes(normalizedUserEmail)
                ? "admin"
                : "user";
              return {
                data: {
                  ...user,
                  role,
                },
              };
            },
          },
        },
      },
    });
    return auth;
  }),
  dependencies: [DbClientService.Default],
}) { }

export type AuthType = {
  user: typeof AuthService.Service.$Infer.Session.user | null;
  session: typeof AuthService.Service.$Infer.Session.session | null;
};

export type User = typeof AuthService.Service.$Infer.Session.user | null;
export type Session = typeof AuthService.Service.$Infer.Session.session | null;
export type SessionPayload = {
  session: Session;
  user: User;
} | null;
