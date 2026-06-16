import Link from "next/link"
import { SidebarNav } from "@/components/shared/sidebar-nav"

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-white p-4 lg:flex">
      <Link
        href="/dashboard"
        className="mb-8 px-2 text-lg font-semibold tracking-tight text-zinc-900"
      >
        Brief
      </Link>

      <SidebarNav />
    </aside>
  )
}
