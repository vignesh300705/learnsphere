import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Brain,
  Users,
  Settings,
  LogOut,
  GraduationCap,
  FileText,
  Trophy,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const studentLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/courses", label: "My Courses", icon: BookOpen },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/quizzes", label: "Quizzes", icon: FileText },
  { to: "/recommendations", label: "For You", icon: Brain },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

const instructorLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/courses", label: "Courses", icon: BookOpen },
  { to: "/instructor-analytics", label: "Analytics", icon: BarChart3 },
  { to: "/students", label: "Students", icon: Users },
];

const adminLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/analytics", label: "Platform Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "instructor"
      ? instructorLinks
      : studentLinks;

  return (
    <aside
      className={cn(
        "h-screen flex flex-col transition-all duration-300 backdrop-blur-xl",
        "bg-white/70 dark:bg-zinc-900/70 border-r border-zinc-200/60 dark:border-zinc-800/60",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md">
            <GraduationCap className="h-5 w-5" />
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold tracking-tight">
              LearnSphere
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-indigo-600" />
                )}

                <link.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition",
                    isActive
                      ? "text-indigo-600"
                      : "group-hover:scale-110"
                  )}
                />

                {!collapsed && <span>{link.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-3 space-y-2 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-3">
        
        {/* Theme */}
        <button
          onClick={toggle}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm w-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          {!collapsed && (
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          )}
        </button>

        {/* Collapse */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm w-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
          {!collapsed && <span>Collapse</span>}
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm w-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition"
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* User */}
      {!collapsed && user && (
        <div className="border-t border-zinc-200/60 dark:border-zinc-800/60 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow">
            {user.name?.charAt(0)}
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">{user.name}</span>
            <span className="text-xs text-zinc-500 capitalize">
              {user.role}
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}