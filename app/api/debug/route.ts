import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    redis: {
      enabled: Boolean(process.env.UPSTASH_REDIS_REST_URL),
      urlSet: Boolean(process.env.UPSTASH_REDIS_REST_URL),
      tokenSet: Boolean(process.env.UPSTASH_REDIS_REST_TOKEN),
    },
    blob: {
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    },
    env: process.env.NODE_ENV,
    vercel: Boolean(process.env.VERCEL),
  });
}
