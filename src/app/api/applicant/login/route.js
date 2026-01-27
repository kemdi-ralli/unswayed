import { NextResponse } from "next/server";

const BACKEND_URL = "https://unswayed.onrender.com/api";

export async function POST(request) {
  try {
    // Login uses JSON, not FormData
    const body = await request.json();
    console.log("Login proxy - Request body:", body);
    
    // Forward the request to the backend
    const response = await fetch(`${BACKEND_URL}/applicant/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("Login proxy - Backend response status:", response.status);
    console.log("Login proxy - Backend response headers:", Object.fromEntries(response.headers.entries()));

    // Handle both JSON and non-JSON responses
    let data;
    const responseContentType = response.headers.get("content-type");
    if (responseContentType && responseContentType.includes("application/json")) {
      data = await response.json();
      console.log("Login proxy - Backend response data:", data);
    } else {
      // If not JSON, try to parse as text and create error response
      const text = await response.text();
      console.log("Login proxy - Backend non-JSON response:", text);
      data = {
        status: "error",
        message: text || "Login failed",
        errors: response.status >= 400 ? { general: [text || "Login failed"] } : {}
      };
    }

    // Return the response with proper CORS headers
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("Login proxy error:", error);
    console.error("Login proxy error stack:", error.stack);
    return NextResponse.json(
      { 
        status: "error", 
        message: error.message || "Failed to process login request",
        errors: { general: [error.message || "Failed to process login request"] },
        debug: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
