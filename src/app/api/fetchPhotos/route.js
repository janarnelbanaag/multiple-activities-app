import { createClient } from "../../../../utils/supabase/client";

export async function GET(req) {
    const supabase = createClient();

    const { search = "", sort = "created_at" } = Object.fromEntries(
        new URL(req.url).searchParams
    );

    const { data, error } = await supabase
        .from("photos")
        .select("*")
        .ilike("photo_name", `%${search}%`)
        .order(sort, { ascending: true });

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
