"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { compras, formatCurrency } from "@/lib/data"

export function ComprasView() {
  const total = compras.reduce((acc, c) => acc + c.total, 0)
  const pendientes = compras.filter((c) => c.estado === "Pendiente").length

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total en compras</p>
          <p className="mt-1.5 font-display text-2xl font-bold text-foreground">{formatCurrency(total)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Órdenes registradas</p>
          <p className="mt-1.5 font-display text-2xl font-bold text-foreground">{compras.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Pendientes por recibir</p>
          <p className="mt-1.5 font-display text-2xl font-bold text-foreground">{pendientes}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-foreground">Órdenes de compra</h3>
        <Button className="gap-2">
          <Plus className="size-4" />
          Nueva compra
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Orden</th>
                <th className="px-5 py-3 font-medium">Proveedor</th>
                <th className="px-5 py-3 font-medium">Fecha</th>
                <th className="px-5 py-3 text-center font-medium">Items</th>
                <th className="px-5 py-3 text-right font-medium">Total</th>
                <th className="px-5 py-3 text-center font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {compras.map((c) => (
                <tr key={c.id} className="transition hover:bg-accent/50">
                  <td className="px-5 py-3 font-medium text-foreground">{c.id.toUpperCase()}</td>
                  <td className="px-5 py-3 text-foreground">{c.proveedor}</td>
                  <td className="px-5 py-3 text-muted-foreground">{c.fecha}</td>
                  <td className="px-5 py-3 text-center text-muted-foreground">{c.items}</td>
                  <td className="px-5 py-3 text-right font-semibold text-foreground">
                    {formatCurrency(c.total)}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        c.estado === "Recibida"
                          ? "bg-primary/10 text-primary"
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {c.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
