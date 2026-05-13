import { NextResponse } from "next/server";
import db from "@/lib/db";

// 1. UPDATE A LINK (Replaces PUT /links/:id)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { url, published } = await req.json();
    await db.query(
      "UPDATE instagram_links SET url = ?, published = ? WHERE id = ?",
      [url, published ? 1 : 0, id]
    );
    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// 2. DELETE A LINK (Replaces DELETE /links/:id)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await db.query("DELETE FROM instagram_links WHERE id = ?", [id]);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}