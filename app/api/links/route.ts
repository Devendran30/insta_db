import { NextResponse } from "next/server";
import db from "@/lib/db"; // Make sure your db.js is in the 'lib' folder

// 1. GET ALL LINKS (Replaces GET /links)
export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM instagram_links ORDER BY id DESC");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 });
  }
}

// 2. ADD A LINK (Replaces POST /links)
export async function POST(req: Request) {
  try {
    const { url, published } = await req.json();
    const [result]: any = await db.query(
      "INSERT INTO instagram_links (url, published) VALUES (?, ?)",
      [url, published ? 1 : 0]
    );
    return NextResponse.json({ id: result.insertId, message: "Link added" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add link" }, { status: 500 });
  }
}