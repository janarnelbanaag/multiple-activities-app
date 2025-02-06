import { createClient } from "../../../../utils/supabase/client";

export async function DELETE(request) {
    const supabase = createClient();

    try {
        const { id } = await request.json();

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
