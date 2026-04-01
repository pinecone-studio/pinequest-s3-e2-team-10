"use client"

import type { FormEvent } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Class } from "@/lib/mock-data-types"

export type TeacherStudentRegistrationFormState = {
  birthDate: string
  classLabel: string
  email: string
  guardianPhone: string
  name: string
  registerNumber: string
  school: string
  studentCode: string
}

export function TeacherStudentRegistrationDialog(props: {
  classData: Class
  form: TeacherStudentRegistrationFormState
  isOpen: boolean
  isSubmitting: boolean
  nextStudentCode: string
  onChange: (next: TeacherStudentRegistrationFormState) => void
  onClose: () => void
  onDemo: () => void
  onOpenChange: (open: boolean) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  const { classData, form, isOpen, isSubmitting, nextStudentCode, onChange, onClose, onDemo, onOpenChange, onSubmit } = props

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent className="w-[566px] max-w-[calc(100%-2rem)] rounded-[24px] border border-[#dfe6f2] bg-white p-0 shadow-[0_28px_90px_rgba(32,45,73,0.18)] dark:border-[rgba(224,225,226,0.08)] dark:bg-[linear-gradient(127deg,rgba(6,11,38,0.92)_18%,rgba(12,18,44,0.86)_58%,rgba(26,31,55,0.72)_100%)] dark:shadow-[0_28px_90px_rgba(2,6,23,0.55)] dark:backdrop-blur-xl" showCloseButton={false}>
        <form className="space-y-5 p-5" onSubmit={onSubmit}>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <DialogTitle className="text-[20px] font-semibold leading-none text-[#4a5672] dark:text-[#e6f2ff]">Сурагчийн бүртгэл</DialogTitle>
              <DialogDescription className="text-[13px] leading-[18px] text-[#8892a7] dark:text-[#aeb8d2]">&quot;Сурагчийн дэлгэрэнгүй мэдээлэл оруулна уу&quot;</DialogDescription>
            </div>
            <button aria-label="Хаах" className="rounded-full p-1 text-[#8e98ae] transition hover:bg-[#f3f6fb] dark:text-[#c2c9d0] dark:hover:bg-white/10" onClick={onClose} type="button">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <Field label="Овог/Нэр" placeholder="Тэнгис Оюунболд" value={form.name} onChange={(value) => onChange({ ...form, name: sanitizeMongolianName(value) })} />
            <Field label="Регистр" placeholder="УК0695432" value={form.registerNumber} onChange={(value) => onChange({ ...form, registerNumber: sanitizeRegisterNumber(value) })} />
            <Field label="Төрсөн огноо" type="date" value={form.birthDate} onChange={(value) => onChange({ ...form, birthDate: value })} />
            <Field label="Сургууль" placeholder="141-р сургууль" value={form.school} onChange={(value) => onChange({ ...form, school: value })} />
            <Field label="Анги бүлэг" placeholder={classData.name} value={form.classLabel} onChange={(value) => onChange({ ...form, classLabel: value })} />
            <Field label="Сурагчийн код / ID" placeholder={nextStudentCode} value={form.studentCode} onChange={(value) => onChange({ ...form, studentCode: value })} />
            <Field label="Утас \\ Асран хамгаалагчийн утас" placeholder="99112233" value={form.guardianPhone} onChange={(value) => onChange({ ...form, guardianPhone: sanitizeDigits(value) })} />
            <Field label="Имэйл" placeholder="student@school.com" type="email" value={form.email} onChange={(value) => onChange({ ...form, email: value })} />
          </div>

          <div className="flex justify-end">
            <div className="flex items-center gap-2">
              <Button className="h-[30px] rounded-full border border-[#d8e2f2] bg-white px-4 text-[13px] font-medium text-[#6f7c95] hover:bg-[#f5f8fd] dark:border-[rgba(224,225,226,0.08)] dark:bg-[linear-gradient(161deg,rgba(6,11,38,0.94)_59%,rgba(26,31,55,0)_100%)] dark:text-[#c2c9d0] dark:hover:bg-[linear-gradient(161deg,rgba(6,11,38,0.94)_59%,rgba(26,31,55,0)_100%)] dark:hover:text-[#c2c9d0]" onClick={onDemo} type="button" variant="outline">Demo</Button>
              <Button className="h-[30px] rounded-full bg-[#6c9dff] px-4 text-[13px] font-medium text-white hover:bg-[#5e91fb] dark:bg-[#1864fb] dark:hover:bg-[#2b73ff]" disabled={isSubmitting || !form.name || !form.studentCode || !form.email} type="submit">
                {isSubmitting ? "Бүртгэж байна" : "Бүртгэх"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Field(props: { label: string; onChange: (value: string) => void; placeholder?: string; type?: string; value: string }) {
  const { label, onChange, placeholder, type = "text", value } = props
  return (
    <div className="space-y-1.5">
      <Label className="text-[12px] font-semibold text-[#687490] dark:text-[#c2c9d0]">{label}</Label>
      <Input className="h-[32px] rounded-[12px] border-[#e2e7f0] bg-white px-3 text-[13px] text-[#59657f] shadow-none placeholder:text-[#bcc5d6] dark:border-[rgba(72,94,149,0.24)] dark:bg-[radial-gradient(62%_1.5px_at_50%_0%,rgba(167,182,214,0.16)_0%,rgba(167,182,214,0.06)_42%,rgba(167,182,214,0)_100%),radial-gradient(62%_1.5px_at_50%_100%,rgba(167,182,214,0.14)_0%,rgba(167,182,214,0.05)_42%,rgba(167,182,214,0)_100%),linear-gradient(180deg,#0d163f_0%,#0a1236_100%)] dark:text-[#f0f3f5] dark:placeholder:text-[#89939c] dark:shadow-[inset_0_0_8px_rgba(55,82,138,0.05)]" onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type={type} value={value} />
    </div>
  )
}

export function sanitizeMongolianName(value: string) {
  return value.replace(/[^А-ЯЁӨҮа-яёөү\s]/g, "")
}

export function sanitizeDigits(value: string) {
  return value.replace(/\D/g, "")
}

export function sanitizeRegisterNumber(value: string) {
  const normalized = value.toUpperCase().replace(/[^А-ЯЁӨҮа-яёөү0-9]/g, "")
  const letters = normalized.replace(/[^А-ЯЁӨҮ]/g, "").slice(0, 2)
  const digits = normalized.replace(/\D/g, "").slice(0, 8)
  return `${letters}${digits}`
}

export function isValidRegisterNumber(value: string) {
  return /^[А-ЯЁӨҮ]{2}\d+$/.test(value)
}
