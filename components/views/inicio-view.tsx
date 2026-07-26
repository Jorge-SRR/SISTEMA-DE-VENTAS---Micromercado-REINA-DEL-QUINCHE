"use client"

import { useMemo } from "react"
import { DollarSign, AlertTriangle, ShoppingBag, TrendingUp, ArrowRight } from "lucide-react"
import { useApp } from "@/lib/store"
import { formatCurrency } from "@/lib/data"

export function InicioView({ onNuevaVenta }: { onNuevaVenta: () => void }) {
  const { productos, compras, ventas } = useApp()

  // Ventas del día (hoy)
  const ventasDia = useMemo(() => {
    const hoy = new Date().toISOString().split("T")[0]
    return ventas
      .filter((v) => v.fecha.split("T")[0] === hoy)
      .reduce((acc, v) => acc + v.total, 0)
  }, [ventas])

  // Últimas 5 ventas
  const ventasRecientes = useMemo(() => {
    return ventas.slice(0, 5).map((v) => ({
      numero: v.numero,
      hora: new Date(v.fecha).toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
      items: v.items.reduce((a, i) => a + i.cantidad, 0),
      total: v.total,
    }))
  }, [ventas])

  const stockBajo = productos.filter((p) => p.stock <= p.stockMinimo)
  const totalCompras = compras.reduce((acc, c) => acc + c.total, 0)

  // Comparación con ayer (simplificada)
  const ventasAyer = useMemo(() => {
    const ayer = new Date()
    ayer.setDate(ayer.getDate() - 1)
    const ayerStr = ayer.toISOString().split("T")[0]
    return ventas
      .filter((v) => v.fecha.split("T")[0] === ayerStr)
      .reduce((acc, v) => acc + v.total, 0)
  }, [ventas])

  const pctCambio = ventasAyer > 0 ? Math.round(((ventasDia - ventasAyer) / ventasAyer) * 100) : 0

  const cards = [
    {
      label: "Ventas del Día",
      value: formatCurrency(ventasDia),
      hint: ventasAyer > 0 ? `${pctCambio >= 0 ? "+" : ""}${pctCambio}% vs. ayer` : `${ventas.length} ventas totales`,
      icon: DollarSign,
      tone: "text-primary bg-primary/10",
    },
    {
      label: "Productos con Stock Bajo",
      value: String(stockBajo.length),
      hint: "Requieren reposición",
      icon: AlertTriangle,
      tone: "text-amber-600 bg-amber-500/10",
    },
    {
      label: "Total Compras",
      value: formatCurrency(totalCompras),
      hint: `${compras.length} órdenes registradas`,
      icon: ShoppingBag,
      tone: "text-sky-600 bg-sky-500/10",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="group rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{c.label}</p>
                <p className="mt-2 font-display text-3xl font-bold text-foreground transition-colors group-hover:text-primary">{c.value}</p>
              </div>
              <span className={`flex size-10 items-center justify-center rounded-lg transition-transform duration-300 group-hover:rotate-3 ${c.tone}`}>
                <c.icon className="size-5" />
              </span>
            </div>
            <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="size-3.5 transition-transform group-hover:scale-110" />
              {c.hint}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Ventas recientes */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <h3 className="font-display text-sm font-semibold text-foreground">Ventas recientes</h3>
            <button
              onClick={onNuevaVenta}
              className="group flex items-center gap-1 text-xs font-medium text-primary transition-all hover:text-primary/80"
            >
              Nueva venta <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          {ventasRecientes.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
              <ShoppingBag className="size-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">Aún no hay ventas registradas.</p>
              <button
                onClick={onNuevaVenta}
                className="mt-1 text-sm font-medium text-primary transition hover:underline"
              >
                Realizar primera venta →
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-5 py-2 font-medium">Comprobante</th>
                  <th className="px-5 py-2 font-medium">Hora</th>
                  <th className="px-5 py-2 font-medium">Items</th>
                  <th className="px-5 py-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ventasRecientes.map((v) => (
                  <tr key={v.numero} className="transition-colors hover:bg-accent/80">
                    <td className="px-5 py-2.5 font-medium text-foreground">{v.numero}</td>
                    <td className="px-5 py-2.5 text-muted-foreground">{v.hora}</td>
                    <td className="px-5 py-2.5 text-muted-foreground">{v.items}</td>
                    <td className="px-5 py-2.5 text-right font-semibold text-foreground">
                      {formatCurrency(v.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Alertas de stock */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
            <AlertTriangle className="size-4 text-amber-600" />
            <h3 className="font-display text-sm font-semibold text-foreground">Reposición urgente</h3>
          </div>
          {stockBajo.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">Todos los productos están bien abastecidos. 🎉</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {stockBajo.map((p) => (
                <li key={p.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.nombre}</p>
                    <p className="text-xs text-muted-foreground">Mínimo: {p.stockMinimo} u.</p>
                  </div>
                  <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600">
                    {p.stock} u.
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
