'use client';

import type React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar'; // Assuming sidebar is in ui
import { DesktopSidebar } from './navigation/DesktopSidebar';
import { MobileBottomNav } from './navigation/MobileBottomNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <DesktopSidebar />
        <main className="flex-1 lg:pl-[var(--sidebar-width)]">
          <div className="container mx-auto px-4 py-8 pb-24 lg:pb-8"> {/* Added padding-bottom for mobile nav */}
            {children}
          </div>
        </main>
        <MobileBottomNav />
      </div>
    </SidebarProvider>
  );
}
