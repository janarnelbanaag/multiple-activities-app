import { redirect } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";

export default function ProtectedRoute({ user, children }) {
    if (!user) {
        redirect("/");
    }

    return <div className="max-w-4xl mx-auto p-4">{children}</div>;
}
