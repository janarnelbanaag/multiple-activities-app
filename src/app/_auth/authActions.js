"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "../../../utils/supabase/server";

export async function login({ email, password }) {
    const supabase = await createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const credentials = {
        email,
        password,
    };

    const { data, error } = await supabase.auth.signInWithPassword(credentials);

    if (error) {
        console.error("Login error:", error.message);
        return { data: null, error };
    }

    return { data, error };
}

export async function signup({ email, password }) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        console.error("Signup error:", error.message);
        return { data: null, error };
    }

    const { user } = authData;
    const { error: dbError } = await supabase.from("users").insert({
        id: user.id,
        email,
        name,
        password, // can be hashed for security
    });

    if (dbError) {
        console.error("Database error:", dbError.message);
        return { data: null, error: dbError };
    }

    return { data, error };
}

export async function signout() {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Logout error:", error.message);
    }
}
