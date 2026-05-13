// app/page.tsx
import AdminInstagramLinks from "../components/AdminInstagramLinks";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* This renders your entire Instagram Feed and Admin Dashboard */}
      <AdminInstagramLinks />
    </main>
  );
}
