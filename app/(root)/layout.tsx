import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";

export default function RootNestedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      {/* This ensures the layout covers the entire viewport */}
      <div className="flex flex-col min-h-screen w-full">
        {/* Full-width header */}
        <AppHeader />

        {/* Sidebar + main content */}
        <div className="flex flex-1 w-full overflow-hidden">
          <AppSidebar />

          {/* Main content scrolls, sidebar stays fixed */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
