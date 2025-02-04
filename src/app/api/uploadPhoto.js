import supabase from "../../lib/supabase";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { user_id, photo_name, file } = req.body;

        const fileBuffer = Buffer.from(file, "base64");

        const filePath = `photos/${Date.now()}_${photo_name}`;

        const { data, error: storageError } = await supabase.storage
            .from("photos")
            .upload(filePath, fileBuffer, { contentType: "image/jpeg" });

        if (storageError) {
            return res.status(400).json({ error: storageError.message });
        }

        const fileUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${data.path}`;

        const { data: photoData, error: dbError } = await supabase
            .from("photos")
            .insert([{ user_id, photo_name, photo_url: fileUrl }]);

        if (dbError) {
            return res.status(400).json({ error: dbError.message });
        }

        res.status(200).json({ photo: photoData });
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
