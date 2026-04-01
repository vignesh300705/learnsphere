import React, { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
      
      {/* Sidebar */}
      <AppSidebar />

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Navbar */}
        <header className="h-16 sticky top-0 z-10 flex items-center justify-between px-6 md:px-8 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl">
          
          {/* Left */}
          <div className="flex flex-col">
            <h1 className="text-base md:text-lg font-semibold tracking-tight">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs text-zinc-500 capitalize">
              {user.role} dashboard
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Status */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Online
            </div>

            {/* Avatar */}
            <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
              {user.name?.charAt(0)}
            </div>
          </div>

        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-6 max-w-7xl mx-auto w-full animate-fade-in">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}