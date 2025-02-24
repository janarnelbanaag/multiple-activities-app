import { createClient } from "../../../../utils/supabase/server";

export async function GET(request) {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    const {
        search = "",
        sort = "created_at",
        category = "photos",
        id = "",
    } = Object.fromEntries(new URL(request.url).searchParams);

    let query = supabase.from(category).select("*");

    if (category == "photos") {
        query = query.ilike("photo_name", `%${search}%`).eq("user_id", user.id);
    }

    if (id) {
        query = query.eq("id", id);
    }

    const { data, error } = await query.order(sort, { ascending: true });

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const photosWithUrls = await Promise.all(
        data.map(async (photo) => {
            const { data: signedUrlData, error: signedUrlError } =
                await supabase.storage
                    .from("photos")
                    .createSignedUrl(photo.photo_url, 60 * 60);

            if (signedUrlError) {
                return {
                    ...photo,
                    photo_url: null,
                    error: signedUrlError.message,
                };
            }

            return {
                ...photo,
                photo_url: signedUrlData.signedUrl,
            };
        })
    );

    return new Response(JSON.stringify(photosWithUrls), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
