export function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-accent text-xl font-bold text-brand-900">
        ₱
      </span>
      <div>
        <div className="font-bold text-white">KitaBooks</div>
        <div className="text-xs text-brand-800">PH Accounting Suite</div>
      </div>
    </div>
  )
}
