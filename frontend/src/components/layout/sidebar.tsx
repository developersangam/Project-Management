'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "../../lib/utils"
import { Home, Users, FolderOpen, BarChart3, Settings, ChevronLeft, Zap } from "lucide-react"

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Organizations', href: '/organizations', icon: Users },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
]

const bottomNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
]

export const Sidebar: React.FC = () => {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <div className={cn(
      "bg-[color:var(--card)] border-r border-[color:var(--border)] h-full flex flex-col transition-all duration-300 relative",
      collapsed ? "w-20" : "w-72"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-[color:var(--border)]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[color:var(--foreground)]">JiraClone</h2>
              <p className="text-xs text-[color:var(--muted-foreground)]">Management</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg bg-[color:var(--secondary)]/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 ml-auto group"
        >
          <ChevronLeft className={cn(
            "w-4 h-4 transition-transform duration-300 group-hover:scale-125",
            collapsed && "rotate-180"
          )} />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4">
        {!collapsed && (
          <div className="text-xs font-semibold text-[color:var(--muted-foreground)] uppercase tracking-wider mb-4 px-2">
            Menu
          </div>
        )}
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname.includes(item.href)
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] hover:bg-[color:var(--secondary)]"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className={cn(
                    "w-4 h-4 flex-shrink-0 transition-all duration-200",
                    isActive ? "text-primary-foreground" : "group-hover:scale-110"
                  )} />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                  {isActive && !collapsed && (
                    <div className="absolute right-0 w-1 h-8 bg-primary rounded-l-full" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 py-4 border-t border-[color:var(--border)]">
        <ul className="space-y-2">
          {bottomNavigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] hover:bg-[color:var(--secondary)]"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className={cn(
                    "w-4 h-4 flex-shrink-0 transition-all duration-200",
                    isActive ? "text-primary-foreground" : "group-hover:scale-110"
                  )} />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="px-5 py-4 border-t border-[color:var(--border)] text-center">
          <p className="text-xs text-[color:var(--muted-foreground)] leading-relaxed">
            <span className="block font-semibold text-[color:var(--foreground)] mb-1">v1.0.0</span>
            © 2026 JiraClone
          </p>
        </div>
      )}
    </div>
  )
}