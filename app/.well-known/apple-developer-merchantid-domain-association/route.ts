import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  const verificationText = `{"version":1,"pspId":"1EDBF0FDBF5FA2065E29979C27D7CC7C95341B4E065BD8D8831658022009A572","createdOn":1749646752541}`;

  return new NextResponse(verificationText, {
    status: 200,
    headers: {
      // Strictly text/plain ensures the browser renders it
      "Content-Type": "text/plain", 
      // Explicitly tell browser to display inline, not attachment
      "Content-Disposition": "inline", 
    },
  });
}