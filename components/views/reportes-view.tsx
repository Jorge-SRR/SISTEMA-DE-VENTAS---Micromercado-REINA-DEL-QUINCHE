"use client"

import { formatCurrency } from "@/lib/data"

const ventasSemana = [
  { dia: "Lun", monto: 412 },
  { dia: "Mar", monto: 388 },
  { dia: "Mié", monto: 455 },
  { dia: "Jue", monto: 402 },
  { dia: "Vie", monto: 601 },
  { dia: "Sáb", monto: 742 },
  { dia: "Dom", monto: 486 },
]

const topCategorias = [
  { nombre: "Abarrotes", pct: 34 },
  { nombre: "Bebidas", pct: 24 },
  { nombre: "Lácteos", pct: 18 },
  { nombre: "Limpieza", pct: 14 },
  { nombre: "Snacks", pct: 10 },
]

export function ReportesView() {
  const maxMonto = Math.max(...ventasSemana.map((v) => v.monto))
  const totalSemana = ventasSemana.reduce((acc, v) => acc + v.monto, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Ventas de la semana</p>
          <p className="mt-1.5 font-display text-2xl font-bold text-foreground">
            {formatCurrency(totalSemana)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Ticket promedio</p>
          <p className="mt-1.5 font-display text-2xl font-bold text-foreground">
            {formatCurrency(11.4)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Transacciones</p>
          <p className="mt-1.5 font-display text-2xl font-bold text-foreground">301</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Bar chart semanal */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display text-sm font-semibold text-foreground">Ventas por día</h3>
          <div className="mt-6 flex h-56 items-end justify-between gap-3">
            {ventasSemana.map((v) => (
              <div key={v.dia} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">${v.monto}</span>
                <div
                  className="w-full rounded-t-md bg-primary transition-all"
                  style={{ height: `${(v.monto / maxMonto) * 100}%` }}
                />
                <span className="text-xs text-muted-foreground">{v.dia}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top categorías */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display text-sm font-semibold text-foreground">Ventas por categoría</h3>
          <ul className="mt-5 flex flex-col gap-4">
            {topCategorias.map((c) => (
              <li key={c.nombre}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-foreground">{c.nombre}</span>
                  <span className="font-medium text-muted-foreground">{c.pct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${c.pct}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
