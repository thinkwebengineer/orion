import { createAdminClient } from "@/lib/supabase/admin";

export interface ReviewRow {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  body: string;
  created_at: string;
}

export interface ReviewWithUser extends ReviewRow {
  user_name: string;
}

/**
 * Fetch all reviews for a product, joined with user_profiles for the reviewer name.
 * Ordered by most recent first.
 */
export async function getProductReviews(
  productId: string,
): Promise<ReviewWithUser[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      id,
      product_id,
      user_id,
      rating,
      body,
      created_at,
      user_profiles!inner ( full_name )
    `,
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    product_id: row.product_id as string,
    user_id: row.user_id as string,
    rating: row.rating as number,
    body: row.body as string,
    created_at: row.created_at as string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user_name: (row as any).user_profiles?.full_name ?? "Anonymous",
  }));
}

/**
 * Insert a new review.
 */
export async function createReview(
  productId: string,
  userId: string,
  rating: number,
  body: string,
): Promise<ReviewRow | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      product_id: productId,
      user_id: userId,
      rating,
      body,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating review:", error);
    return null;
  }

  return data as ReviewRow;
}

/**
 * Recalculate the product's average rating and review count, then update the products table.
 */
export async function recalculateProductRating(
  productId: string,
): Promise<void> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId);

  if (error) {
    console.error("Error fetching ratings for recalculation:", error);
    return;
  }

  const ratings = (data ?? []).map((r: { rating: number }) => r.rating);
  const reviewCount = ratings.length;
  const rating = reviewCount > 0
    ? Math.round((ratings.reduce((a, b) => a + b, 0) / reviewCount) * 10) / 10
    : 0;

  const { error: updateError } = await supabase
    .from("products")
    .update({ rating, review_count: reviewCount })
    .eq("id", productId);

  if (updateError) {
    console.error("Error updating product rating:", updateError);
  }
}
