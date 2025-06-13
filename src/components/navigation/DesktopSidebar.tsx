import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, Landmark, ListChecks, Settings, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { href: '/', label: 'Homepage', icon: Home },
  { href: '/projects', label: 'Projects', icon: Briefcase },
  { href: '/finance', label: 'Finance', icon: Landmark },
  { href: '/tasks', label: 'Tasks', icon: ListChecks },
];

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left" className="hidden lg:flex flex-col fixed inset-y-0 z-50">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          {/* Placeholder for a logo or app name */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
          <h1 className="text-xl font-bold text-primary font-headline">ProjectFlow</h1>
        </Link>
      </SidebarHeader>
      <Separator />
      <SidebarContent className="flex-1">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  variant="default"
                  className={cn(
                    'w-full justify-start',
                    pathname === item.href ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'hover:bg-muted/50'
                  )}
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator />
      <SidebarFooter className="p-4 space-y-1">
        <ThemeToggle />
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-5 w-5" />
          Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <UserCircle className="mr-2 h-5 w-5" />
          Profile
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
