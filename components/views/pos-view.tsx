"use client"

import { useMemo, useRef, useState } from "react"
import { Search, Plus, Minus, Trash2, FileText, ShoppingCart, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/store"
import { formatCurrency, IVA, type Producto } from "@/lib/data"

type CartItem = {
  producto: Producto
  cantidad: number
}

export function PosView() {
  const { productos, registrarVenta, currentUser } = useApp()
  const [query, setQuery] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [feedback, setFeedback] = useState("")
  const [stockError, setStockError] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)

  const resultados = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return productos
      .filter((p) => p.nombre.toLowerCase().includes(q) || p.codigo.includes(q))
      .slice(0, 6)
  }, [query, productos])

  const subtotal = cart.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0)
  const iva = subtotal * IVA
  const total = subtotal + iva

  function addProducto(p: Producto) {
    setStockError("")
    setCart((prev) => {
      const existing = prev.find((i) => i.producto.id === p.id)
      if (existing) {
        // Verificar stock
        if (existing.cantidad + 1 > p.stock) {
          setStockError(`Stock insuficiente de "${p.nombre}". Disponible: ${p.stock}`)
          return prev
        }
        return prev.map((i) =>
          i.producto.id === p.id ? { ...i, cantidad: i.cantidad + 1 } : i,
        )
      }
      if (p.stock <= 0) {
        setStockError(`"${p.nombre}" no tiene stock disponible.`)
        return prev
      }
      return [...prev, { producto: p, cantidad: 1 }]
    })
    setQuery("")
    searchRef.current?.focus()
  }

  function updateCantidad(id: string, delta: number) {
    setStockError("")
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.producto.id !== id) return i
          const newCant = i.cantidad + delta
          if (delta > 0) {
            const prod = productos.find((p) => p.id === id)
            if (prod && newCant > prod.stock) {
              setStockError(`Stock insuficiente de "${prod.nombre}". Disponible: ${prod.stock}`)
              return i
            }
          }
          return { ...i, cantidad: Math.max(0, newCant) }
        })
        .filter((i) => i.cantidad > 0),
    )
  }

  function removeItem(id: string) {
    setCart((prev) => prev.filter((i) => i.producto.id !== id))
    setStockError("")
  }

  async function completarVenta() {
    if (cart.length === 0) return

    // Verificar stock antes de procesar
    for (const item of cart) {
      const prod = productos.find((p) => p.id === item.producto.id)
      if (!prod || prod.stock < item.cantidad) {
        setStockError(`Stock insuficiente de "${item.producto.nombre}".`)
        return
      }
    }

    // Registrar venta en el store (descuenta stock automáticamente)
    const items = cart.map((i) => ({
      productoId: i.producto.id,
      nombre: i.producto.nombre,
      precio: i.producto.precio,
      cantidad: i.cantidad,
    }))

    const venta = await registrarVenta(items, currentUser?.nombre ?? "Cajero")

    if (!venta) {
      setStockError("Error al registrar la venta en la base de datos.")
      return
    }

    // Generar PDF del comprobante
    const { default: jsPDF } = await import("jspdf")
    const doc = new jsPDF({ unit: "mm", format: [80, 200] })
    const fecha = new Date().toLocaleString("es-EC")

    let y = 10
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.text("REINA DEL QUINCHE", 40, y, { align: "center" })
    y += 5
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.text("Micromercado · RUC 1790012345001", 40, y, { align: "center" })
    y += 4
    doc.text("Comprobante de Venta", 40, y, { align: "center" })
    y += 6
    doc.text(`No: ${venta.numero}`, 6, y)
    y += 4
    doc.text(`Fecha: ${fecha}`, 6, y)
    y += 4
    doc.text(`Cajero: ${currentUser?.nombre ?? "N/A"}`, 6, y)
    y += 4
    doc.text("--------------------------------", 6, y)
    y += 5

    doc.setFont("helvetica", "bold")
    doc.text("Producto", 6, y)
    doc.text("Cant", 50, y)
    doc.text("Total", 74, y, { align: "right" })
    y += 3
    doc.setFont("helvetica", "normal")
    doc.text("--------------------------------", 6, y)
    y += 5

    cart.forEach((i) => {
      const name = i.producto.nombre.length > 26 ? i.producto.nombre.slice(0, 26) : i.producto.nombre
      doc.text(name, 6, y)
      doc.text(String(i.cantidad), 52, y)
      doc.text(formatCurrency(i.producto.precio * i.cantidad), 74, y, { align: "right" })
      y += 5
    })

    doc.text("--------------------------------", 6, y)
    y += 5
    doc.text("Subtotal:", 6, y)
    doc.text(formatCurrency(subtotal), 74, y, { align: "right" })
    y += 4
    doc.text(`IVA (${(IVA * 100).toFixed(0)}%):`, 6, y)
    doc.text(formatCurrency(iva), 74, y, { align: "right" })
    y += 5
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.text("TOTAL:", 6, y)
    doc.text(formatCurrency(total), 74, y, { align: "right" })
    y += 8
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.text("¡Gracias por su compra!", 40, y, { align: "center" })

    doc.save(`comprobante-${venta.numero}.pdf`)

    setFeedback(`Venta ${venta.numero} completada · ${formatCurrency(venta.total)}`)
    setCart([])
    setStockError("")
    setTimeout(() => setFeedback(""), 4000)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      {/* Buscador + resultados */}
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <label htmlFor="buscar" className="mb-2 block text-sm font-medium text-foreground">
            Buscar producto
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="buscar"
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nombre o código de barras..."
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {resultados.length > 0 && (
            <ul className="mt-3 flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border">
              {resultados.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => addProducto(p)}
                    className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-accent"
                  >
                    <span>
                      <span className="block text-sm font-medium text-foreground">{p.nombre}</span>
                      <span className="block text-xs text-muted-foreground">
                        {p.categoria} · Cód. {p.codigo} · Stock: {p.stock}
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {formatCurrency(p.precio)}
                      </span>
                      <Plus className="size-4 text-primary" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Accesos rápidos */}
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-3 text-sm font-medium text-foreground">Productos frecuentes</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {productos.slice(0, 6).map((p) => (
              <button
                key={p.id}
                onClick={() => addProducto(p)}
                className="flex flex-col items-start gap-1 rounded-lg border border-border bg-background p-3 text-left transition hover:border-primary hover:bg-accent"
              >
                <span className="line-clamp-1 text-sm font-medium text-foreground">{p.nombre}</span>
                <span className="text-xs font-semibold text-primary">{formatCurrency(p.precio)}</span>
                <span className="text-xs text-muted-foreground">Stock: {p.stock}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Carrito */}
      <div className="flex flex-col rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <ShoppingCart className="size-4 text-primary" />
          <h3 className="font-display text-sm font-semibold text-foreground">Detalle de la venta</h3>
          {cart.length > 0 && (
            <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {cart.reduce((a, i) => a + i.cantidad, 0)} items
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
              <ShoppingCart className="size-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Agrega productos para iniciar la venta.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {cart.map((i) => (
                <li key={i.producto.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{i.producto.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(i.producto.precio)} c/u
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateCantidad(i.producto.id, -1)}
                      className="flex size-6 items-center justify-center rounded-md border border-border text-foreground transition hover:bg-accent"
                      aria-label="Disminuir"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{i.cantidad}</span>
                    <button
                      onClick={() => updateCantidad(i.producto.id, 1)}
                      className="flex size-6 items-center justify-center rounded-md border border-border text-foreground transition hover:bg-accent"
                      aria-label="Aumentar"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                  <span className="w-16 text-right text-sm font-semibold text-foreground">
                    {formatCurrency(i.producto.precio * i.cantidad)}
                  </span>
                  <button
                    onClick={() => removeItem(i.producto.id)}
                    className="text-muted-foreground transition hover:text-destructive"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-border p-4">
          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>IVA ({(IVA * 100).toFixed(0)}%)</span>
              <span>{formatCurrency(iva)}</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-border pt-2 text-base font-bold text-foreground">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {stockError && (
            <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
              <AlertCircle className="size-3.5 shrink-0" />
              {stockError}
            </p>
          )}

          {feedback && (
            <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary">
              {feedback}
            </p>
          )}

          <div className="mt-3 flex gap-2">
            {cart.length > 0 && (
              <Button
                variant="outline"
                onClick={() => { setCart([]); setStockError("") }}
                className="h-12 gap-1.5 px-3"
                aria-label="Cancelar venta"
              >
                <X className="size-4" />
              </Button>
            )}
            <Button
              onClick={completarVenta}
              disabled={cart.length === 0}
              className="h-12 flex-1 gap-2 text-sm font-semibold"
            >
              <FileText className="size-4" />
              Completar Venta y Emitir Comprobante (PDF)
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
