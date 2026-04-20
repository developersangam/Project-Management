import * as React from "react";
import { Sidebar } from "./sidebar";
import { PrivateHeader } from "./PrivateHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PrivateHeader />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
