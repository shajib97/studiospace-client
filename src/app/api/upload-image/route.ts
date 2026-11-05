import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const appURL = process.env.BETTER_AUTH_URL;
  const apiKey = process.env.IMGBB_API_KEY;

  if (!appURL || !apiKey) {
    return NextResponse.json(
      { message: "Image upload configuration is missing." },
      { status: 500 },
    );
  }

  if (request.headers.get("origin") !== new URL(appURL).origin) {
    return NextResponse.json(
      { message: "Request origin is not allowed." },
      { status: 403 },
    );
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json(
      { message: "Please log in to upload a photo." },
      { status: 401 },
    );
  }

  const formData = await request.formData().catch(() => null);
  const image = formData?.get("image");
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!(image instanceof File) || !allowedTypes.includes(image.type)) {
    return NextResponse.json(
      { message: "Choose a JPG, PNG, or WebP image." },
      { status: 400 },
    );
  }

  if (image.size === 0 || image.size > 4 * 1024 * 1024) {
    return NextResponse.json(
      { message: "Choose a nonempty image up to 4 MB." },
      { status: 400 },
    );
  }

  try {
    const uploadData = new FormData();
    uploadData.append("image", image);

    const uploadURL = new URL("https://api.imgbb.com/1/upload");
    uploadURL.searchParams.set("key", apiKey);

    const response = await fetch(uploadURL, {
      method: "POST",
      body: uploadData,
    });

    const result = await response.json();
    const imageUrl = result.data?.display_url;

    if (
      !response.ok ||
      !result.success ||
      typeof imageUrl !== "string" ||
      !imageUrl.startsWith("https://i.ibb.co/")
    ) {
      throw new Error("Image upload failed");
    }

    return NextResponse.json({ success: true, imageUrl });
  } catch {
    return NextResponse.json(
      { message: "Unable to upload the photo. Please try again." },
      { status: 502 },
    );
  }
}