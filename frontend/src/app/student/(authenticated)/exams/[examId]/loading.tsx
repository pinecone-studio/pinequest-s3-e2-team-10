export default function StudentExamDetailLoading() {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-full bg-sky-100 p-4 text-sky-700">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Шалгалтын мэдээллийг ачаалж байна</h1>
        <p className="max-w-md text-sm leading-6 text-slate-600">
          Түр хүлээнэ үү. Таны сонгосон шалгалтын дэлгэрэнгүй мэдээллийг бэлдэж байна.
        </p>
      </div>
    </div>
  )
}
