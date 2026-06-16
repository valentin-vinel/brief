"use client"

import { useState } from "react"
import Link from "next/link"
import { MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarNav } from "@/components/shared/sidebar-nav"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="flex items-center justify-between border-b bg-white px-4 py-3 lg:hidden">
      <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-zinc-900">
        Brief
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Ouvrir le menu" />}>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-4">
          <SheetHeader className="p-0">
            <SheetTitle>Brief</SheetTitle>
          </SheetHeader>
          <SidebarNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </header>
  )
}
