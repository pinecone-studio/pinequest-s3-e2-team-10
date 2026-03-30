"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Bell,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Moon,
} from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { notifyStudentSessionChange, useStudentSession } from "@/hooks/use-student-session"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/student/dashboard", label: "Хянах самбар", icon: LayoutDashboard },
  { href: "/student/exams", label: "Шалгалтууд", icon: ClipboardList },
]

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { studentName } = useStudentSession()

  useEffect(() => {
    if (!studentName) {
      router.push("/student/login")
    }
  }, [router, studentName])

  const handleLogout = () => {
    localStorage.removeItem("studentId")
    localStorage.removeItem("studentName")
    localStorage.removeItem("studentClass")
    notifyStudentSessionChange()
    router.push("/")
  }

  if (!studentName) {
    return null
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(159.02deg,#0F123B_14.25%,#090D2E_56.45%,#020515_86.14%)] text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(42,92,255,0.38),rgba(10,18,55,0.14)_52%,transparent_78%)] blur-[136px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[linear-gradient(180deg,rgba(70,120,255,0.18)_0%,rgba(70,120,255,0.04)_55%,transparent_100%)]" />

      <header className="relative z-10">
        <div className="flex h-[82px] w-full items-center justify-between px-5 py-4 sm:px-6 lg:px-8 xl:px-10">
          <Link href="/student/dashboard" className="font-semibold">
            <BrandLogo
              className="gap-2"
              textClassName="text-base font-semibold text-[#F5FAFF]"
            />
          </Link>

          <nav className="flex h-[49px] items-center gap-2 rounded-full bg-[linear-gradient(111.84deg,rgba(6,11,38,0.94)_59.3%,rgba(26,31,55,0)_100%)] p-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href || pathname.startsWith(item.href + "/")

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex h-10 items-center justify-center gap-[6px] rounded-full px-4 text-sm font-medium",
                    active
                      ? "bg-[#001933] text-white shadow-[0px_3.5px_5.5px_rgba(0,0,0,0.02)]"
                      : "text-[#A4ADB5]",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="isolate flex h-6 items-center gap-2">
            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center rounded-full text-[#C2C9D0] transition hover:bg-[rgba(255,255,255,0.08)] hover:text-white"
              aria-label="Мэдэгдэл"
            >
              <Bell className="h-4 w-4 stroke-[1.75]" />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-6 w-6 items-center justify-center rounded-full text-[#C2C9D0] transition hover:bg-[rgba(255,255,255,0.08)] hover:text-white"
              aria-label="Гарах"
            >
              <LogOut className="h-4 w-4 stroke-[1.75]" />
            </button>
            <button
              type="button"
              className="relative h-6 w-[46px] overflow-hidden rounded-[21.2308px] bg-[#A2D1FD] shadow-[inset_0px_2.12308px_3.18462px_#72BBFF]"
              aria-label="Theme switch"
            >
              <span className="absolute inset-0 rounded-[21.2308px] bg-[linear-gradient(180deg,#E0FDFF_0%,#A2D1FD_100%)] opacity-90" />
              <span className="absolute left-[7px] top-[4px] h-[2px] w-[2px] rounded-full bg-[#DEE5F3]" />
              <span className="absolute left-[10px] top-[10px] h-[1px] w-[1px] rounded-full bg-[#DEE5F3]" />
              <span className="absolute left-[14px] top-[6px] h-[1.5px] w-[1.5px] rounded-full bg-[#DEE5F3]" />
              <span className="absolute right-[10px] top-[6px] h-[10px] w-[16px] rounded-full bg-white/95 blur-[0.2px]" />
              <span className="absolute right-[15px] top-[9px] h-[7px] w-[10px] rounded-full bg-white" />
              <span className="absolute right-[2px] top-[2px] z-10 h-5 w-5 rounded-full bg-[rgba(255,193,135,0.96)] shadow-[-0.88px_1.47px_1.17px_rgba(183,183,183,0.35),0px_0px_2.65px_rgba(255,193,135,0.6),inset_0px_-0.59px_1.17px_#FFA149,inset_0px_0.59px_1.17px_#FFD0A5]" />
              <Moon className="absolute left-[6px] top-[4px] h-4 w-4 text-[#C2C9D0]" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 min-h-[calc(100vh-82px)] w-full">
        {children}
      </main>
    </div>
  )
}
