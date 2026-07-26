"use client"

import { useState } from "react"
import { Plus, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { useApp } from "@/lib/store"
import { formatCurrency } from "@/lib/data"

export function ComprasView() {
  const { compras, proveedores, productos, addCompra, recibirCompra } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [recibirModal, setRecibirModal] = useState<string | null>(null)

  // Form para nueva compra
  const [form, setForm] = useState({
    proveedor: "",
    items: "",
    total: "",
  })
  const [formError, setFormError] = useState("")

  // Form para recibir compra (ajustar stock)
  const [stockAjustes, setStockAjustes] = useState<{ productoId: string; cantidad: number }[]>([])

  const total = compras.reduce((acc, c) => acc + c.total, 0)
  const pendientes = compras.filter((c) => c.estado === "Pendiente").length

  function openNew() {
    setForm({ proveedor: proveedores[0]?.nombre ?? "", items: "", total: "" })
    setFormError("")
    setModalOpen(true)
  }

  function handleSave() {
    if (!form.proveedor) {
      setFormError("Seleccione un proveedor.")
      return
    }
    const items = parseInt(form.items)
    const totalCompra = parseFloat(form.total)
    if (isNaN(items) || items <= 0) {
      setFormError("Ingrese una cantidad de items válida.")
      return
    }
    if (isNaN(totalCompra) || totalCompra <= 0) {
      setFormError("Ingrese un total válido.")
      return
    }
    addCompra({
      proveedor: form.proveedor,
      fecha: new Date().toISOString().split("T")[0],
      items,
      total: totalCompra,
      estado: "Pendiente",
    })
    setModalOpen(false)
  }

  function openRecibir(id: string) {
    // Preparar lista de productos para ajustar stock
    setStockAjustes(productos.slice(0, 5).map((p) => ({ productoId: p.id, cantidad: 0 })))
    setRecibirModal(id)
  }

  function handleRecibir() {
    if (!recibirModal) return
    const ajustesConCantidad = stockAjustes.filter((a) => a.cantidad > 0)
    recibirCompra(recibirModal, ajustesConCantidad)
    setRecibirModal(null)
  }

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
        <Button className="gap-2" onClick={openNew}>
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
                <th className="px-5 py-3 text-center font-medium">Acción</th>
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
                  <td className="px-5 py-3 text-center">
                    {c.estado === "Pendiente" && (
                      <button
                        onClick={() => openRecibir(c.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/20"
                      >
                        <CheckCircle2 className="size-3.5" />
                        Recibir
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal nueva compra */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nueva orden de compra">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Proveedor</label>
            <select
              value={form.proveedor}
              onChange={(e) => setForm({ ...form, proveedor: e.target.value })}
              className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {proveedores.map((p) => (
                <option key={p.id} value={p.nombre}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Cantidad de items</label>
              <input
                type="number"
                min="1"
                value={form.items}
                onChange={(e) => setForm({ ...form, items: e.target.value })}
                className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="0"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Total ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.total}
                onChange={(e) => setForm({ ...form, total: e.target.value })}
                className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="0.00"
              />
            </div>
          </div>

          {formError && <p className="text-sm text-destructive">{formError}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Registrar compra</Button>
          </div>
        </div>
      </Modal>

      {/* Modal recibir compra */}
      <Modal open={!!recibirModal} onClose={() => setRecibirModal(null)} title="Recibir mercadería" maxWidth="max-w-xl">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Ingrese la cantidad recibida para cada producto para actualizar el inventario.
          </p>
          <div className="flex flex-col gap-2">
            {productos.map((p) => {
              const ajuste = stockAjustes.find((a) => a.productoId === p.id)
              return (
                <div key={p.id} className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{p.nombre}</p>
                    <p className="text-xs text-muted-foreground">Stock actual: {p.stock}</p>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={ajuste?.cantidad ?? 0}
                    onChange={(e) => {
                      const cant = parseInt(e.target.value) || 0
                      setStockAjustes((prev) => {
                        const exists = prev.find((a) => a.productoId === p.id)
                        if (exists) {
                          return prev.map((a) => (a.productoId === p.id ? { ...a, cantidad: cant } : a))
                        }
                        return [...prev, { productoId: p.id, cantidad: cant }]
                      })
                    }}
                    className="w-20 rounded-lg border border-input bg-background px-2 py-1.5 text-center text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )
            })}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setRecibirModal(null)}>
              Cancelar
            </Button>
            <Button onClick={handleRecibir}>Confirmar recepción</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
