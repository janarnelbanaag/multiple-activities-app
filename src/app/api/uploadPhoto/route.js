import { createClient } from "../../../../utils/supabase/server";

export async function POST(request) {
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

    const { user_id, photo_name, file } = await request.json();

    if (user.id !== user_id) {
        return new Response(JSON.stringify({ error: "User mismatch" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const fileBuffer = Buffer.from(file, "base64");
        const filePath = `photos/${user.id}/${Date.now()}_${photo_name}`;

        const { error: storageError } = await supabase.storage
            .from("photos")
            .upload(filePath, fileBuffer, { contentType: "image/jpeg" });

        if (storageError) {
            return new Response(
                JSON.stringify({ error: storageError.message }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const { data: signedUrlData, error: signedUrlError } =
            await supabase.storage
                .from("photos")
                .createSignedUrl(filePath, 60 * 60);

        if (signedUrlError) {
            return new Response(
                JSON.stringify({ error: signedUrlError.message }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const { data: photoData, error: dbError } = await supabase
            .from("photos")
            .insert([
                {
                    user_id,
                    photo_url: filePath,
                    photo_name,
                },
            ])
            .select();

        if (dbError) {
            return new Response(JSON.stringify({ error: dbError.message }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ photo: photoData }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.error }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
