import { NextResponse } from "next/server";
import db from "@/lib/db";

// 1. GET ALL LINKS
export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM instagram_links ORDER BY id DESC");
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ 
      error: "Database GET Error", 
      details: error.message 
    }, { status: 500 });
  }
}

// 2. ADD A LINK
export async function POST(req: Request) {
  try {
    const { url, published } = await req.json();
    const [result]: any = await db.query(
      "INSERT INTO instagram_links (url, published) VALUES (?, ?)",
      [url, published ? 1 : 0]
    );
    return NextResponse.json({ id: result.insertId, message: "Link added" });
  } catch (error: any) {
    return NextResponse.json({ 
      error: "Database POST Error", 
      details: error.message 
    }, { status: 500 });
  }
}