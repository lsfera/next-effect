import { SESClient } from "@aws-sdk/client-ses";
import { awsCredentialsProvider } from "@vercel/functions/oidc";
import { Config, Effect } from "effect";

export class SesClientService extends Effect.Service<SesClientService>()(
  "SesClient",
  {
    effect: Effect.gen(function* () {
      const region = yield* Config.string("AWS_REGION").pipe(
        Config.withDefault("us-east-1"),
      );
      const endpoint =
        process.env.AWS_SES_ENDPOINT_URL ?? process.env.AWS_ENDPOINT_URL;

      if (endpoint) {
        return new SESClient({
          region,
          endpoint,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "test",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "test",
          },
        });
      }

      const roleArn = process.env.AWS_ROLE_ARN;

      if (!roleArn) {
        return new SESClient({
          region,
        });
      }

      return new SESClient({
        region,
        credentials: awsCredentialsProvider({
          roleArn,
        }),
      });
    }),
  },
) { }
