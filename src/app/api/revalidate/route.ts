import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { clearCache } from "@/lib/notion";

export async function GET(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get("secret");

    if (secret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    clearCache();
    revalidatePath("/");
    revalidatePath("/posts/[slug]", "page");
    revalidatePath("/category/[slug]", "page");

    return NextResponse.json({ revalidated: true, timestamp: new Date().toISOString() });
}
