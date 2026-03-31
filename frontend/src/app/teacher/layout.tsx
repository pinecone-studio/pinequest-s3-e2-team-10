"use client";

import { usePathname } from "next/navigation";
import {
  SidebarNav,
  TeacherHeader,
  teacherNavItems,
} from "@/components/teacher/teacher-layout-shell";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboardPage = pathname === "/teacher/dashboard";

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef6ff_0%,#f7fbff_100%)] text-foreground dark:bg-[linear-gradient(180deg,#050910_0%,#09111d_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col">
        <TeacherHeader />

        <div className="relative flex flex-1 overflow-hidden pb-4">
          {isDashboardPage ? (
            <>
              <aside className="absolute left-[30px] top-[228px] z-10">
                <SidebarNav navItems={teacherNavItems} pathname={pathname} />
              </aside>
              <main className="content-surface min-w-0 flex-1 overflow-x-hidden overflow-y-auto rounded-[2rem] px-[40px] pb-[24px] pr-[28px]">
                {children}
              </main>
            </>
          ) : (
            <>
              <aside className="shrink-0 pl-[30px] pr-[10px] pt-2">
                <SidebarNav navItems={teacherNavItems} pathname={pathname} />
              </aside>
              <main className="content-surface min-w-0 flex-1 overflow-x-hidden overflow-y-auto rounded-[2rem] px-[20px] pb-[24px] pr-[20px] sm:px-[24px] sm:pr-[24px] lg:px-[28px] lg:pr-[28px]">
                {children}
              </main>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
