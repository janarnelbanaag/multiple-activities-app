"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function deleteUser(userId) {
    const cookieStore = cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SERVICE_KEY, // This is not safe to expose but since it is only for assessment purposes, I'm just gonna use it here.
        {
            cookies: {
                get(name) {
                    return cookieStore.get(name)?.value;
                },
                set(name, value, options) {
                    cookieStore.set({ name, value, ...options });
                },
                remove(name) {
                    cookieStore.delete(name);
                },
            },
        }
    );

    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
        console.error("Error deleting user:", error);
        return { success: false, error: error.message };
    }

    return { success: true };
}
