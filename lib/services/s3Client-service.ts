import { S3Client } from "@aws-sdk/client-s3";
import { awsCredentialsProvider } from "@vercel/functions/oidc";
import { Config, Effect } from "effect";

export class S3ClientService extends Effect.Service<S3ClientService>()(
  "S3ClientService",
  {
    effect: Effect.gen(function* () {
      const region = yield* Config.string("AWS_REGION").pipe(
        Config.withDefault("us-east-1"),
      );
      const endpoint =
        process.env.AWS_S3_ENDPOINT_URL ?? process.env.AWS_ENDPOINT_URL;

      if (endpoint) {
        return new S3Client({
          region,
          endpoint,
          forcePathStyle: true,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "test",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "test",
          },
        });
      }

      const roleArn = process.env.AWS_ROLE_ARN;

      if (!roleArn) {
        return new S3Client({
          region,
        });
      }

      return new S3Client({
        region,
        credentials: awsCredentialsProvider({
          roleArn,
        }),
      });
    }),
  },
) { }
