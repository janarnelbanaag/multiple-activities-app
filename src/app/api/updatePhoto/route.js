import { createClient } from "../../../../utils/supabase/server";

export async function PUT(request) {
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

    const { id, photo_name, new_file } = await request.json();

    try {
        // Fetch the existing photo record
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

        const oldPhotoUrl = existingPhoto.photo_url;
        const filePath = `photos/${user.id}/${Date.now()}_${photo_name}`;

        // Convert base64 to a buffer
        const fileBuffer = Buffer.from(new_file, "base64");

        // Upload the new photo
        const { data: storageData, error: uploadError } = await supabase.storage
            .from("photos")
            .upload(filePath, fileBuffer, { contentType: "image/jpeg" });

        if (uploadError) {
            return new Response(
                JSON.stringify({ error: "Failed to upload new photo" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        await supabase.storage.from("photos").remove([oldPhotoUrl]);

        // Update the database with new photo details
        const { data, error } = await supabase
            .from("photos")
            .update({ photo_name, photo_url: filePath })
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
