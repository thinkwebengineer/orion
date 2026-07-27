import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getProductReviews,
  createReview,
  recalculateProductRating,
} from "@/lib/reviews";

/**
 * GET /api/products/[id]/reviews
 *
 * Returns all reviews for a product, joined with user_profiles.
 * Ordered by most recent first.
 *
 * Returns: { reviews: ReviewWithUser[] }
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const reviews = await getProductReviews(id);

  return Response.json({ reviews }, { status: 200 });
}

/**
 * POST /api/products/[id]/reviews
 *
 * Creates a new review. Requires authentication.
 * Accepts: { rating: number, body: string }
 * Validates rating is 1-5 and body is non-empty.
 * After insert, recalculates the product's average rating and review count.
 *
 * Returns 201 with { review } on success.
 * Returns 400 for validation errors.
 * Returns 401 if not authenticated.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Check authentication using the server client (reads session from cookies)
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return Response.json({ error: "You must be signed in to leave a review" }, { status: 401 });
  }

  // Parse and validate the request body
  let body: { rating: number; body: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { rating, body: reviewBody } = body;

  if (typeof rating !== "number" || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return Response.json(
      { error: "Rating must be an integer between 1 and 5" },
      { status: 400 },
    );
  }

  if (!reviewBody || typeof reviewBody !== "string" || reviewBody.trim().length === 0) {
    return Response.json(
      { error: "Review body must be a non-empty string" },
      { status: 400 },
    );
  }

  // Insert the review using admin client (bypasses RLS for the insert)
  const review = await createReview(id, session.user.id, rating, reviewBody.trim());

  if (!review) {
    return Response.json({ error: "Failed to create review" }, { status: 500 });
  }

  // Recalculate the product's average rating and review count
  await recalculateProductRating(id);

  return Response.json({ review }, { status: 201 });
}
