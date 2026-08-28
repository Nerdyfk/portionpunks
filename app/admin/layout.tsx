'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  UserCheck,
  FileText,
  Settings,
  History,
  LogOut,
  Shield,
  ArrowUpRight,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Skip auth check if on login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        } else {
          router.push('/admin/login');
        }
      })
      .catch(() => {
        router.push('/admin/login');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1c212b] flex items-center justify-center font-pixel-display text-xs text-neon-green">
        <div className="animate-pulse">VERIFYING ADMIN SESSION...</div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Whitelist Board', href: '/admin/whitelist', icon: UserCheck },
    { name: 'Roadmap & Content', href: '/admin/roadmap', icon: FileText },
    { name: 'Site & Atmosphere', href: '/admin/settings', icon: Settings },
    { name: 'Activity Audit Logs', href: '/admin/logs', icon: History },
  ];

  return (
    <div className="min-h-screen bg-[#1c212b] text-white flex flex-col md:flex-row font-sans">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-charcoal-900 border-b md:border-b-0 md:border-r border-smoke-800 flex flex-col shrink-0">
        
        {/* Sidebar Brand Logo */}
        <div className="p-6 border-b border-smoke-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="font-pixel-heading text-sm text-white font-bold">
              <span>PORTION </span>
              <span className="text-neon-green">ADMIN</span>
            </div>
          </Link>
          <span className="px-2 py-0.5 text-[9px] font-pixel-display bg-neon-green/10 text-neon-green border border-neon-green/30 rounded-sm">
            v1.0
          </span>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 bg-charcoal-850 border-b border-smoke-800 flex items-center space-x-3">
            <div className="p-2 bg-neon-green/20 text-neon-green rounded-sm">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="font-pixel-display text-xs text-white font-bold truncate">
                {user.name || 'MASTER ADMIN'}
              </div>
              <div className="text-[10px] text-smoke-400 font-mono truncate">
                {user.email}
              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="p-4 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-sm font-pixel-display text-xs transition-colors ${
                  isActive
                    ? 'bg-neon-green/15 text-neon-green border-l-4 border-neon-green font-bold'
                    : 'text-smoke-300 hover:text-white hover:bg-charcoal-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-neon-green' : 'text-smoke-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-smoke-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 bg-charcoal-850 hover:bg-charcoal-800 border border-smoke-700 text-smoke-200 text-xs font-pixel-display rounded-sm transition-colors"
          >
            <span>VIEW PUBLIC SITE</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neon-green" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-pixel-display rounded-sm transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>LOGOUT SESSION</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-charcoal-900/80 backdrop-blur-md border-b border-smoke-800 px-6 py-3.5 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center space-x-2 text-xs font-pixel-display text-smoke-400">
            <span className="inline-block w-2 h-2 bg-neon-green rounded-full animate-ping" />
            <span>SYSTEM STATUS: <span className="text-neon-green">ONLINE</span></span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="font-pixel-display text-[10px] text-smoke-400">
              ROLE: <span className="text-neon-green font-bold">{user?.role || 'ADMIN'}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>

    </div>
  );
}
