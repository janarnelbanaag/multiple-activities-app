import ProtectedRoute from "@/app/_components/ProtectedRoute";

export default function Layout({ children }) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
}
