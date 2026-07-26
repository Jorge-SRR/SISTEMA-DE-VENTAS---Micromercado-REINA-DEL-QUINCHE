"use client"

import { useMemo, useState } from "react"
import { Search, Plus, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { productos, formatCurrency } from "@/lib/data"

export function ProductosView() {
  const [query, setQuery] = useState("")
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return productos
    return productos.filter(
      (p) => p.nombre.toLowerCase().includes(q) || p.codigo.includes(q) || p.categoria.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, código o categoría..."
            className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          Nuevo producto
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Producto</th>
                <th className="px-5 py-3 font-medium">Código</th>
                <th className="px-5 py-3 font-medium">Categoría</th>
                <th className="px-5 py-3 text-right font-medium">Precio</th>
                <th className="px-5 py-3 text-right font-medium">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr key={p.id} className="transition hover:bg-accent/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Package className="size-4" />
                      </span>
                      <span className="font-medium text-foreground">{p.nombre}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{p.codigo}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                      {p.categoria}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-foreground">
                    {formatCurrency(p.precio)}
                  </td>
                  <td className="px-5 py-3 text-right text-foreground">{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {filtered.length} producto{filtered.length !== 1 && "s"} encontrado{filtered.length !== 1 && "s"}
      </p>
    </div>
  )
}
