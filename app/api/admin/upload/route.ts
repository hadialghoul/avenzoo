import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function extensionFor(file: File) {
  if (extensions[file.type]) return extensions[file.type];
  const match = file.name.toLowerCase().match(/\.(jpe?g|png|webp|gif)$/);
  if (!match) return null;
  return match[1] === "jpeg" ? "jpg" : match[1];
}

function useVercelBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function isVercelProduction() {
  return process.env.VERCEL === "1";
}

async function uploadToBlob(file: File, filename: string): Promise<string> {
  const { put } = await import("@vercel/blob");
  const blob = await put(filename, file, { access: "public" });
  return blob.url;
}

async function uploadToLocal(file: File, filename: string): Promise<string> {
  const { mkdir, writeFile } = await import("fs/promises");
  const path = await import("path");
  const directory = path.join(process.cwd(), "public", "uploads");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${filename}`;
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  const form = await request.formData();
  const files = form.getAll("files").filter((item): item is File => item instanceof File && item.size > 0);
  if (!files.length) return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  if (files.length > 6) return NextResponse.json({ error: "Upload up to 6 images at a time." }, { status: 400 });

  if (!useVercelBlob() && isVercelProduction()) {
    return NextResponse.json(
      { error: "Image uploads are not configured. Please add BLOB_READ_WRITE_TOKEN to your Vercel environment variables." },
      { status: 503 }
    );
  }

  const urls: string[] = [];

  for (const file of files) {
    const extension = extensionFor(file);
    if (!extension) {
      return NextResponse.json({ error: "Use a JPG, PNG, or WebP image." }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Each image must be under 5 MB." }, { status: 400 });
    }
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

    try {
      if (useVercelBlob()) {
        urls.push(await uploadToBlob(file, filename));
      } else {
        urls.push(await uploadToLocal(file, filename));
      }
    } catch (err) {
      console.error("Upload failed:", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      
      if (message.includes("private") && message.includes("public access")) {
        return NextResponse.json(
          { error: "Your Vercel Blob store is set to private. Go to Vercel Dashboard → Storage → your store → Settings and enable public access for uploads." },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: `Failed to upload image: ${message}` },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ urls });
}
