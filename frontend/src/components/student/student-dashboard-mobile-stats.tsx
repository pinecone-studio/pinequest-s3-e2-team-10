"use client"

import Image from "next/image"

export type StudentMobileStatCard = {
  detail: string
  iconPath: string
  label: string
  value: string
}

export function StudentDashboardMobileStats(props: {
  items: StudentMobileStatCard[]
}) {
  const { items } = props

  if (items.length === 0) return null

  return (
    <div className="mt-4 grid w-[358px] max-w-full grid-cols-[167px_138px] justify-between gap-2 sm:hidden">
      {items.map((item) => (
        <div
          key={item.label}
          className={`flex h-[64px] items-center gap-1.5 rounded-[28px] border border-[#DCE8F3] bg-[#F3F9FF] px-2 py-4 shadow-[0_6px_20px_rgba(114,144,179,0.08)] dark:border-[rgba(224,225,226,0.08)] dark:bg-[linear-gradient(127deg,rgba(6,11,38,0.74)_28%,rgba(26,31,55,0.5)_91%)] ${item.label === "Энэ 7 хоногт" ? "w-[138px]" : "w-[167px]"}`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[#F3F9FF] dark:bg-[rgba(6,11,38,0.74)]">
            <Image
              src={item.iconPath}
              alt=""
              width={18}
              height={18}
              className="h-[18px] w-[18px] object-contain"
            />
          </div>
          <div className="min-w-0 space-y-px">
            <p className="truncate text-[11px] leading-3 text-[#7A8698] dark:text-[#9eacc3]">{item.label}</p>
            <div className="flex items-end gap-0.5">
              <p className="text-[16px] font-semibold leading-none text-[#39424E] dark:text-[#edf4ff]">{item.value}</p>
              <p className="truncate text-[11px] font-medium leading-none text-[#4A9DFF]">{item.detail}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
