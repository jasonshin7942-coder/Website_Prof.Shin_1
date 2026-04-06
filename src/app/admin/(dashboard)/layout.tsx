import AdminSidebar from '@/components/admin/AdminSidebar';
import ToastContainer from '@/components/admin/Toast';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64">
        <div className="p-8">
          {children}
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
