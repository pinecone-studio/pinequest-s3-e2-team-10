import Link from "next/link";
import { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
};

type AppShellProps = {
  title: string;
  subtitle: string;
  badge: string;
  navItems: NavItem[];
  children: ReactNode;
};

export function AppShell({
  title,
  subtitle,
  badge,
  navItems,
  children,
}: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <header className="glass-panel mb-6 rounded-[28px] px-6 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <span className="inline-flex w-fit rounded-full bg-accent-soft px-3 py-1 font-mono text-xs uppercase tracking-[0.24em] text-accent">
              {badge}
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                {title}
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-soft">
                {subtitle}
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-border bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-accent hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
