"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { useApp } from "@/lib/store"
import { formatCurrency } from "@/lib/data"

function estado(stock: number, minimo: number) {
  if (stock <= minimo) return { label: "Bajo", tone: "bg-destructive/10 text-destructive" }
  if (stock <= minimo * 2) return { label: "Medio", tone: "bg-amber-500/10 text-amber-600" }
  return { label: "Óptimo", tone: "bg-primary/10 text-primary" }
}

export function InventarioView() {
  const { productos, ajustarStock } = useApp()
  const [ajusteModal, setAjusteModal] = useState<string | null>(null)
  const [nuevoStock, setNuevoStock] = useState("")

  const valorTotal = productos.reduce((acc, p) => acc + p.precio * p.stock, 0)
  const unidades = productos.reduce((acc, p) => acc + p.stock, 0)
  const bajos = productos.filter((p) => p.stock <= p.stockMinimo).length

  const resumen = [
    { label: "Valor del inventario", value: formatCurrency(valorTotal) },
    { label: "Unidades en stock", value: unidades.toLocaleString("es-EC") },
    { label: "Productos en alerta", value: String(bajos) },
  ]

  function openAjuste(id: string) {
    const p = productos.find((x) => x.id === id)
    if (!p) return
    setNuevoStock(String(p.stock))
    setAjusteModal(id)
  }

  function handleAjuste() {
    if (!ajusteModal) return
    const stock = parseInt(nuevoStock)
    if (isNaN(stock) || stock < 0) return
    ajustarStock(ajusteModal, stock)
    setAjusteModal(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {resumen.map((r) => (
          <div key={r.label} className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{r.label}</p>
            <p className="mt-1.5 font-display text-2xl font-bold text-foreground">{r.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Producto</th>
                <th className="px-5 py-3 font-medium">Categoría</th>
                <th className="px-5 py-3 text-center font-medium">Stock actual</th>
                <th className="px-5 py-3 text-center font-medium">Mínimo</th>
                <th className="px-5 py-3 text-center font-medium">Estado</th>
                <th className="px-5 py-3 text-center font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {productos.map((p) => {
                const e = estado(p.stock, p.stockMinimo)
                return (
                  <tr key={p.id} className="transition hover:bg-accent/50">
                    <td className="px-5 py-3 font-medium text-foreground">{p.nombre}</td>
                    <td className="px-5 py-3 text-muted-foreground">{p.categoria}</td>
                    <td className="px-5 py-3 text-center font-semibold text-foreground">{p.stock}</td>
                    <td className="px-5 py-3 text-center text-muted-foreground">{p.stockMinimo}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${e.tone}`}>
                        {e.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => openAjuste(p.id)}
                        className="rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-medium text-secondary-foreground transition hover:bg-secondary/80"
                      >
                        Ajustar stock
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal ajustar stock */}
      <Modal open={!!ajusteModal} onClose={() => setAjusteModal(null)} title="Ajustar stock">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Producto: <span className="font-medium text-foreground">{productos.find((p) => p.id === ajusteModal)?.nombre}</span>
          </p>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Nuevo stock</label>
            <input
              type="number"
              min="0"
              value={nuevoStock}
              onChange={(e) => setNuevoStock(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setAjusteModal(null)}>
              Cancelar
            </Button>
            <Button onClick={handleAjuste}>Guardar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
