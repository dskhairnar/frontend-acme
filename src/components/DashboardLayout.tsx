
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  TrendingDown, 
  Package, 
  User, 
  LogOut,
  Bell,
  Settings
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Weight Progress', href: '/weight-progress', icon: TrendingDown },
    { name: 'Shipments', href: '/shipments', icon: Package },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-card shadow-minimal border-r border-border">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b border-border">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-lg font-bold text-primary-foreground">AC</span>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-foreground">Acme Corp</h1>
              <p className="text-sm text-muted-foreground">Patient Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className={cn('mr-3 h-5 w-5', isActive ? 'text-primary-foreground' : 'text-muted-foreground')} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center px-4 py-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-sm">
                <span className="text-sm font-medium text-primary-foreground">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64">
        {/* Top bar */}
        <header className="bg-card shadow-minimal border-b border-border">
          <div className="px-8 py-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground capitalize">
                {location.pathname.replace('/', '').replace('-', ' ') || 'Dashboard'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Welcome back, {user?.firstName}! Here's your health overview.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative hover:bg-accent">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
