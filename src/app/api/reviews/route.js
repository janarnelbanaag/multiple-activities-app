import { createClient } from "../../../../utils/supabase/server";

export async function POST(req) {
    const supabase = await createClient();

    const { photo_id, review } = await req.json();

    const { error } = await supabase
        .from("reviews")
        .insert([{ photo_id, review }]);

    if (error) return Response.json({ error: error.message }, { status: 500 });

    return Response.json({ message: "Review added successfully" });
}

export async function GET(req) {
    const supabase = await createClient();

    const { searchParams } = new URL(req.url);
    const photo_id = searchParams.get("photo_id");

    const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("photo_id", photo_id)
        .order("created_at", { ascending: false });

    if (error) return Response.json({ error: error.message }, { status: 500 });

    return Response.json(data);
}

export async function DELETE(req) {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const review_id = searchParams.get("review_id");

    const {
        data: { user },
    } = await supabase.auth.getUser();
    const user_id = user.id;

    const { data: review, error: reviewError } = await supabase
        .from("reviews")
        .select("user_id")
        .eq("id", review_id)
        .single();

    if (reviewError) {
        return Response.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.user_id !== user_id) {
        return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", review_id);

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ message: "Review deleted successfully" });
}

export async function PUT(req) {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const review_id = searchParams.get("review_id");
    const { review: newReviewText } = await req.json();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    const user_id = user.id;

    const { data: review, error: reviewError } = await supabase
        .from("reviews")
        .select("user_id")
        .eq("id", review_id)
        .single();

    if (reviewError) {
        return Response.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.user_id !== user_id) {
        return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { error } = await supabase
        .from("reviews")
        .update({ review: newReviewText })
        .eq("id", review_id);

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ message: "Review updated successfully" });
}
