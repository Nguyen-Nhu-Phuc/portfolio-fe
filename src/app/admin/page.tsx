import AdminPanel from "@/components/admin/AdminPanel";
import "@/styles/admin.css";

export const metadata = {
  title: "Admin — Portfolio",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminPanel />;
}
