import { NextResponse } from "next/server";

/**
 * University Search API Route
 * 
 * Searches for universities worldwide using the Hipolabs University API
 * 
 * Query Parameters:
 * - q: Search query (minimum 2 characters)
 * 
 * Response Format:
 * [
 *   { "name": "Harvard University", "country": "United States" },
 *   { "name": "Oxford University", "country": "United Kingdom" }
 * ]
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    // Validation
    if (!q || q.length < 2) {
      return NextResponse.json([]);
    }

    // Call external university API
    const response = await fetch(
      `http://universities.hipolabs.com/search?name=${encodeURIComponent(q)}`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`University API returned ${response.status}`);
    }

    const data = await response.json();

    // Transform and limit results to top 10
    const universities = data.slice(0, 10).map((u) => ({
      name: u.name,
      country: u.country,
    }));

    return NextResponse.json(universities);
  } catch (error) {
    console.error("University search error:", error);
    
    // Return empty array on error (graceful degradation)
    // Component will show fallback TextField
    return NextResponse.json([], { status: 200 });
  }
}
