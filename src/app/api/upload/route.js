import { NextResponse } from "next/server";
import { uploadFile } from "@/utils/upload";


export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume"); 

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const result = await uploadFile(file);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



