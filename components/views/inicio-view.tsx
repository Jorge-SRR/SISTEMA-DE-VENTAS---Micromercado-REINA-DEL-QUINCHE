"use client"

import { DollarSign, AlertTriangle, ShoppingBag, TrendingUp, ArrowRight } from "lucide-react"
import { productos, compras, formatCurrency } from "@/lib/data"

const ventasRecientes = [
  { numero: "V-004521", hora: "10:42", items: 5, total: 12.85 },
  { numero: "V-004520", hora: "10:31", items: 2, total: 3.6 },
  { numero: "V-004519", hora: "10:18", items: 8, total: 24.4 },
  { numero: "V-004518", hora: "09:57", items: 1, total: 6.4 },
  { numero: "V-004517", hora: "09:45", items: 4, total: 9.15 },
]

export function InicioView({ onNuevaVenta }: { onNuevaVenta: () => void }) {
  const ventasDia = 486.35
  const stockBajo = productos.filter((p) => p.stock <= p.stockMinimo)
  const totalCompras = compras.reduce((acc, c) => acc + c.total, 0)

  const cards = [
    {
      label: "Ventas del Día",
      value: formatCurrency(ventasDia),
      hint: "+12% vs. ayer",
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
          <div key={c.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{c.label}</p>
                <p className="mt-2 font-display text-3xl font-bold text-foreground">{c.value}</p>
              </div>
              <span className={`flex size-10 items-center justify-center rounded-lg ${c.tone}`}>
                <c.icon className="size-5" />
              </span>
            </div>
            <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="size-3.5" />
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
              className="flex items-center gap-1 text-xs font-medium text-primary transition hover:gap-1.5"
            >
              Nueva venta <ArrowRight className="size-3.5" />
            </button>
          </div>
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
                <tr key={v.numero} className="transition hover:bg-accent/50">
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
        </div>

        {/* Alertas de stock */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
            <AlertTriangle className="size-4 text-amber-600" />
            <h3 className="font-display text-sm font-semibold text-foreground">Reposición urgente</h3>
          </div>
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
        </div>
      </div>
    </div>
  )
}
