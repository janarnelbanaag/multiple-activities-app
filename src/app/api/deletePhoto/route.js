import { createClient } from "../../../../utils/supabase/server";

export async function DELETE(request) {
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

    const { id } = await request.json();

    try {
        const { data: existingPhoto, error: fetchError } = await supabase
            .from("photos")
            .select("photo_url")
            .eq("id", id)
            .single();

        if (fetchError || !existingPhoto) {
            return new Response(JSON.stringify({ error: "Photo not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const photoUrl = existingPhoto.photo_url;

        await supabase.storage.from("photos").remove([photoUrl]);

        const { data, error } = await supabase
            .from("photos")
            .delete()
            .eq("id", id);

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
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
