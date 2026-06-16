"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOutIcon } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [{ href: "/dashboard", label: "Dossiers" }]

type SidebarNavProps = {
  onNavigate?: () => void
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  function handleLogout() {
    onNavigate?.()
    logout()
  }

  return (
    <>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <Button variant="ghost" className="justify-start" onClick={handleLogout}>
        <LogOutIcon />
        Déconnexion
      </Button>
    </>
  )
}
