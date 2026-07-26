"use client"

import { useState } from "react"
import { Plus, Phone, User, Truck, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { useApp } from "@/lib/store"
import { CATEGORIAS } from "@/lib/data"

export function ProveedoresView() {
  const { proveedores, addProveedor, updateProveedor, deleteProveedor } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const [form, setForm] = useState({
    nombre: "",
    contacto: "",
    telefono: "",
    categoria: CATEGORIAS[0] as string,
  })
  const [formError, setFormError] = useState("")

  function openNew() {
    setEditingId(null)
    setForm({ nombre: "", contacto: "", telefono: "", categoria: CATEGORIAS[0] })
    setFormError("")
    setModalOpen(true)
  }

  function openEdit(id: string) {
    const p = proveedores.find((x) => x.id === id)
    if (!p) return
    setEditingId(id)
    setForm({ nombre: p.nombre, contacto: p.contacto, telefono: p.telefono, categoria: p.categoria })
    setFormError("")
    setModalOpen(true)
  }

  function handleSave() {
    if (!form.nombre.trim()) {
      setFormError("El nombre del proveedor es obligatorio.")
      return
    }
    const data = {
      nombre: form.nombre.trim(),
      contacto: form.contacto.trim(),
      telefono: form.telefono.trim(),
      categoria: form.categoria,
    }
    if (editingId) {
      updateProveedor(editingId, data)
    } else {
      addProveedor(data)
    }
    setModalOpen(false)
  }

  function handleDelete(id: string) {
    deleteProveedor(id)
    setDeleteConfirm(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{proveedores.length} proveedores activos</p>
        <Button className="gap-2" onClick={openNew}>
          <Plus className="size-4" />
          Nuevo proveedor
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {proveedores.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Truck className="size-5" />
              </span>
              <div className="flex items-center gap-1">
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                  {p.categoria}
                </span>
                <button
                  onClick={() => openEdit(p.id)}
                  className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground"
                  aria-label="Editar"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(p.id)}
                  className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Eliminar"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
            <h3 className="mt-4 font-display text-base font-semibold text-foreground">{p.nombre}</h3>
            <div className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <User className="size-4" />
                {p.contacto || "Sin contacto"}
              </span>
              <span className="flex items-center gap-2">
                <Phone className="size-4" />
                {p.telefono || "Sin teléfono"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal crear/editar */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Editar proveedor" : "Nuevo proveedor"}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Nombre de la empresa</label>
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Ej: Distribuidora Andina"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Persona de contacto</label>
              <input
                value={form.contacto}
                onChange={(e) => setForm({ ...form, contacto: e.target.value })}
                className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Ej: María Torres"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Teléfono</label>
              <input
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Ej: 099 812 4501"
              />
            </div>
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

          {formError && <p className="text-sm text-destructive">{formError}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>{editingId ? "Guardar cambios" : "Crear proveedor"}</Button>
          </div>
        </div>
      </Modal>

      {/* Modal confirmar eliminación */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Eliminar proveedor">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            ¿Estás seguro de que deseas eliminar este proveedor? Esta acción no se puede deshacer.
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
