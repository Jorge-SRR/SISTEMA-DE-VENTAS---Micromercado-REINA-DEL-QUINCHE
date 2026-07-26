"use client"

import { useMemo, useState } from "react"
import { Search, Plus, Package, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { useApp } from "@/lib/store"
import { formatCurrency, CATEGORIAS } from "@/lib/data"

export function ProductosView() {
  const { productos, addProducto, updateProducto, deleteProducto } = useApp()
  const [query, setQuery] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Form state
  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    categoria: CATEGORIAS[0] as string,
    precio: "",
    stock: "",
    stockMinimo: "",
  })
  const [formError, setFormError] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return productos
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.codigo.includes(q) ||
        p.categoria.toLowerCase().includes(q),
    )
  }, [query, productos])

  function openNew() {
    setEditingId(null)
    setForm({ codigo: "", nombre: "", categoria: CATEGORIAS[0], precio: "", stock: "", stockMinimo: "" })
    setFormError("")
    setModalOpen(true)
  }

  function openEdit(id: string) {
    const p = productos.find((x) => x.id === id)
    if (!p) return
    setEditingId(id)
    setForm({
      codigo: p.codigo,
      nombre: p.nombre,
      categoria: p.categoria,
      precio: String(p.precio),
      stock: String(p.stock),
      stockMinimo: String(p.stockMinimo),
    })
    setFormError("")
    setModalOpen(true)
  }

  function handleSave() {
    if (!form.nombre.trim() || !form.codigo.trim()) {
      setFormError("El nombre y código son obligatorios.")
      return
    }
    const precio = parseFloat(form.precio)
    const stock = parseInt(form.stock)
    const stockMinimo = parseInt(form.stockMinimo)
    if (isNaN(precio) || precio <= 0) {
      setFormError("Ingrese un precio válido mayor a 0.")
      return
    }
    if (isNaN(stock) || stock < 0) {
      setFormError("Ingrese un stock válido.")
      return
    }
    if (isNaN(stockMinimo) || stockMinimo < 0) {
      setFormError("Ingrese un stock mínimo válido.")
      return
    }

    const data = {
      codigo: form.codigo.trim(),
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      precio,
      stock,
      stockMinimo,
    }

    if (editingId) {
      updateProducto(editingId, data)
    } else {
      addProducto(data)
    }
    setModalOpen(false)
  }

  function handleDelete(id: string) {
    deleteProducto(id)
    setDeleteConfirm(null)
  }

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
        <Button className="gap-2" onClick={openNew}>
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
                <th className="px-5 py-3 text-center font-medium">Acciones</th>
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
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openEdit(p.id)}
                        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground"
                        aria-label="Editar"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(p.id)}
                        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {filtered.length} producto{filtered.length !== 1 && "s"} encontrado{filtered.length !== 1 && "s"}
      </p>

      {/* Modal crear/editar */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Editar producto" : "Nuevo producto"}
      >
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Código</label>
              <input
                value={form.codigo}
                onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Ej: 7861001"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Categoría</label>
              <select
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Nombre del producto</label>
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Ej: Arroz Flor 1kg"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Precio ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
                className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="0.00"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Stock</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="0"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Stock mínimo</label>
              <input
                type="number"
                min="0"
                value={form.stockMinimo}
                onChange={(e) => setForm({ ...form, stockMinimo: e.target.value })}
                className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="0"
              />
            </div>
          </div>

          {formError && <p className="text-sm text-destructive">{formError}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>{editingId ? "Guardar cambios" : "Crear producto"}</Button>
          </div>
        </div>
      </Modal>

      {/* Modal confirmar eliminación */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Eliminar producto">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
