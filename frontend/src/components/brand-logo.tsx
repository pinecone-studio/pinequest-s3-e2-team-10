"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

type BrandLogoProps = {
  className?: string
  imageClassName?: string
  textClassName?: string
}

export function BrandLogo({
  className,
  imageClassName,
  textClassName,
}: BrandLogoProps) {
  return (
    <span className={cn("inline-flex h-[50px] w-[190px] items-center gap-[8px]", className)}>
      <span className="relative h-[45.1px] w-[40.51px] shrink-0">
        <Image
          src="/edulphin-mark.svg"
          alt="Edulphin logo"
          fill
          sizes="40.51px"
          className={cn("object-contain", imageClassName)}
          priority
        />
      </span>

      <span className={cn("flex min-w-0 flex-1 flex-col leading-none", textClassName)}>
        <span className="text-[28px] font-light leading-[1] tracking-[0.02em] text-[#56B2FF]">
          EDULPHIN
        </span>
        <span className="mt-[6px] text-[9px] font-light uppercase leading-[1] tracking-[0.38em] text-[#72BBFF]">
          DIVE·INTO·LEARNING
        </span>
      </span>
    </span>
  )
}
