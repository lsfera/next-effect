import type { NextConfig } from "next";

const awsRegion = process.env.AWS_REGION ?? "us-east-1";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.S3_BUCKET_NAME}.s3.${awsRegion}.amazonaws.com`,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dummyimage.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
