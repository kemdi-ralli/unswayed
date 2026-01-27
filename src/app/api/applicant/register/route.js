import { NextResponse } from "next/server";

const BACKEND_URL = "https://unswayed.onrender.com/api";

export async function POST(request) {
  try {
    // Get the content type to determine if it's FormData or JSON
    const contentType = request.headers.get("content-type") || "";
    
    let body;
    let headers = {
      "Accept": "application/json",
    };

    // Check if it's multipart/form-data (FormData)
    if (contentType.includes("multipart/form-data")) {
      // Handle FormData - read as FormData
      const formData = await request.formData();
      body = formData;
      // Don't set Content-Type header - fetch will set it with boundary automatically
    } else {
      // Handle JSON
      body = await request.json();
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(body);
    }
    
    // Forward the request to the backend
    const response = await fetch(`${BACKEND_URL}/applicant/register`, {
      method: "POST",
      headers,
      body: body,
    });

    // Handle both JSON and non-JSON responses
    let data;
    const responseContentType = response.headers.get("content-type");
    if (responseContentType && responseContentType.includes("application/json")) {
      data = await response.json();
    } else {
      // If not JSON, try to parse as text and create error response
      const text = await response.text();
      data = {
        status: "error",
        message: text || "Request failed",
        errors: response.status >= 400 ? { general: [text || "Request failed"] } : {}
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
    console.error("Proxy error:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: error.message || "Failed to process request",
        errors: { general: [error.message || "Failed to process request"] }
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
