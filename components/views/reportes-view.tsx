"use client"

import { useMemo } from "react"
import { useApp } from "@/lib/store"
import { formatCurrency } from "@/lib/data"

export function ReportesView() {
  const { ventas, productos } = useApp()

  // Calcular ventas por día de la semana (últimos 7 días)
  const ventasSemana = useMemo(() => {
    const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
    const ahora = new Date()
    const resultado: { dia: string; monto: number }[] = []

    for (let i = 6; i >= 0; i--) {
      const fecha = new Date(ahora)
      fecha.setDate(fecha.getDate() - i)
      const diaStr = dias[fecha.getDay()]
      const fechaStr = fecha.toISOString().split("T")[0]
      const montoDelDia = ventas
        .filter((v) => v.fecha.split("T")[0] === fechaStr)
        .reduce((acc, v) => acc + v.total, 0)
      resultado.push({ dia: diaStr, monto: Math.round(montoDelDia * 100) / 100 })
    }
    return resultado
  }, [ventas])

  // Top categorías basado en ventas reales
  const topCategorias = useMemo(() => {
    const catMap: Record<string, number> = {}
    let totalVendido = 0
    ventas.forEach((v) => {
      v.items.forEach((item) => {
        const prod = productos.find((p) => p.id === item.productoId)
        const cat = prod?.categoria ?? "Otros"
        const monto = item.precio * item.cantidad
        catMap[cat] = (catMap[cat] || 0) + monto
        totalVendido += monto
      })
    })
    if (totalVendido === 0) {
      // Datos placeholder si no hay ventas
      return [
        { nombre: "Abarrotes", pct: 34 },
        { nombre: "Bebidas", pct: 24 },
        { nombre: "Lácteos", pct: 18 },
        { nombre: "Limpieza", pct: 14 },
        { nombre: "Snacks", pct: 10 },
      ]
    }
    return Object.entries(catMap)
      .map(([nombre, monto]) => ({ nombre, pct: Math.round((monto / totalVendido) * 100) }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 5)
  }, [ventas, productos])

  const totalSemana = ventasSemana.reduce((acc, v) => acc + v.monto, 0)
  const maxMonto = Math.max(...ventasSemana.map((v) => v.monto), 1)

  // Métricas dinámicas
  const totalTransacciones = ventas.length
  const ticketPromedio = totalTransacciones > 0 ? ventas.reduce((acc, v) => acc + v.total, 0) / totalTransacciones : 0

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
            {formatCurrency(ticketPromedio)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Transacciones</p>
          <p className="mt-1.5 font-display text-2xl font-bold text-foreground">{totalTransacciones}</p>
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
                  style={{ height: `${(v.monto / maxMonto) * 100}%`, minHeight: v.monto > 0 ? "4px" : "2px" }}
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
