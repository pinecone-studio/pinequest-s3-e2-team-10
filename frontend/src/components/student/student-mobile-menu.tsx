"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut, MoonStar, X, type LucideIcon } from "lucide-react";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { cn } from "@/lib/utils";

export type StudentNavItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
  iconPath?: string;
};

export function StudentMobileMenu(props: {
  isDark: boolean;
  isOpen: boolean;
  items: StudentNavItem[];
  onClose: () => void;
  onLogout?: () => void;
  pathname: string;
}) {
  const { isDark, isOpen, items, onClose, onLogout, pathname } = props;

  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Цэс хаах"
        onClick={onClose}
        className="fixed inset-0 z-[80] bg-[#0D1C35]/28 backdrop-blur-[6px] lg:hidden"
      />
      <div className="fixed inset-y-0 right-0 z-[90] w-[302px] max-w-[86vw] lg:hidden">
        <div
          className={cn(
            "flex h-full flex-col overflow-hidden border-l px-4 pb-5 pt-4 shadow-[-18px_0_50px_rgba(20,45,89,0.22)]",
            isDark
              ? "border-white/10 bg-[linear-gradient(180deg,rgba(14,25,58,0.98)_0%,rgba(11,20,46,0.98)_100%)]"
              : "border-[#D6E2F0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F6FAFF_100%)]",
          )}
        >
          <div className="flex items-center justify-between">
            <p className={cn("text-[12px] font-medium uppercase tracking-[0.16em]", isDark ? "text-[#9FB1CC]" : "text-[#8C9CB0]")}>Цэс</p>
            <button type="button" onClick={onClose} className={cn("flex h-9 w-9 items-center justify-center rounded-full", isDark ? "bg-white/6 text-[#d5def0]" : "bg-[#F4F8FD] text-[#4D5C70]")} aria-label="Цэс хаах"><X className="h-4 w-4" /></button>
          </div>
          <nav className="mt-5 grid gap-2">
            {items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`) || (item.href === "/student/exams" && pathname.startsWith("/student/reports/"));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex h-12 items-center gap-3 rounded-[18px] px-4 text-[14px] font-medium transition",
                    active
                      ? "bg-[linear-gradient(180deg,#5EB6FF_0%,#3CA6F5_100%)] text-white shadow-[0_10px_24px_rgba(76,170,242,0.28)]"
                      : isDark
                        ? "bg-white/5 text-[#d5def0]"
                        : "bg-[#F4F8FD] text-[#4D5C70]",
                  )}
                >
                  <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-[12px]", active ? "bg-white/18" : isDark ? "bg-white/6" : "bg-white")}>
                    {Icon ? (
                      <Icon className="h-4 w-4 shrink-0" />
                    ) : (
                      <Image
                        src={item.iconPath ?? ""}
                        alt=""
                        width={16}
                        height={16}
                        className={cn("h-4 w-4 shrink-0 object-contain", active && "brightness-0 invert")}
                      />
                    )}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className={cn("mt-4 rounded-[20px] border p-4", isDark ? "border-white/10 bg-white/5" : "border-[#DCE8F3] bg-white")}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={cn("flex h-10 w-10 items-center justify-center rounded-[14px]", isDark ? "bg-white/6 text-[#d5def0]" : "bg-[#F4F8FD] text-[#4D5C70]")}><MoonStar className="h-5 w-5" /></span>
                <div>
                  <p className={cn("text-[14px] font-medium", isDark ? "text-[#edf4ff]" : "text-[#243445]")}>Dark mode</p>
                  <p className={cn("text-[12px]", isDark ? "text-[#9FB1CC]" : "text-[#7B8898]")}>Theme солих</p>
                </div>
              </div>
              <ThemeToggleButton className="shrink-0" />
            </div>
          </div>
          <button type="button" onClick={() => { onClose(); onLogout?.(); }} className={cn("mt-auto flex h-12 items-center gap-3 rounded-[18px] px-4 text-[14px] font-medium transition", isDark ? "bg-[#FF5A53]/14 text-[#ffd8d6]" : "bg-[#FFF1EF] text-[#C53E38]")}>
            <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-[12px]", isDark ? "bg-[#FF5A53]/16" : "bg-white")}><LogOut className="h-4 w-4" /></span>
            <span>Exit</span>
          </button>
        </div>
      </div>
    </>
  );
}
