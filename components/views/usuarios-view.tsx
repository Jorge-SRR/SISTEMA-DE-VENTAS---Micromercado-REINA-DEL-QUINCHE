"use client"

import { useState } from "react"
import { Plus, UserCircle, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { useApp } from "@/lib/store"

const rolTone: Record<string, string> = {
  Administrador: "bg-primary/10 text-primary",
  Cajero: "bg-sky-500/10 text-sky-600",
}

const roles = ["Administrador", "Cajero"] as const

export function UsuariosView() {
  const { usuarios, currentUser, addUsuario, updateUsuario, deleteUsuario, toggleUsuarioActivo } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const [form, setForm] = useState({
    nombre: "",
    usuario: "",
    password: "",
    rol: "Cajero" as "Administrador" | "Cajero",
  })
  const [formError, setFormError] = useState("")

  function openNew() {
    setEditingId(null)
    setForm({ nombre: "", usuario: "", password: "", rol: "Cajero" })
    setFormError("")
    setModalOpen(true)
  }

  function openEdit(id: string) {
    const u = usuarios.find((x) => x.id === id)
    if (!u) return
    setEditingId(id)
    setForm({ nombre: u.nombre, usuario: u.usuario, password: "", rol: u.rol })
    setFormError("")
    setModalOpen(true)
  }

  function handleSave() {
    if (!form.nombre.trim() || !form.usuario.trim()) {
      setFormError("Nombre y usuario son obligatorios.")
      return
    }
    if (!editingId && !form.password.trim()) {
      setFormError("La contraseña es obligatoria para nuevos usuarios.")
      return
    }
    // Verificar usuario único
    const existe = usuarios.find(
      (u) => u.usuario === form.usuario.trim() && u.id !== editingId,
    )
    if (existe) {
      setFormError("Ese nombre de usuario ya está en uso.")
      return
    }

    if (editingId) {
      const data: Record<string, unknown> = {
        nombre: form.nombre.trim(),
        usuario: form.usuario.trim(),
        rol: form.rol,
      }
      if (form.password.trim()) data.password = form.password.trim()
      updateUsuario(editingId, data)
    } else {
      addUsuario({
        nombre: form.nombre.trim(),
        usuario: form.usuario.trim(),
        password: form.password.trim(),
        rol: form.rol,
        activo: true,
      })
    }
    setModalOpen(false)
  }

  function handleDelete(id: string) {
    deleteUsuario(id)
    setDeleteConfirm(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{usuarios.length} usuarios registrados</p>
        <Button className="gap-2" onClick={openNew}>
          <Plus className="size-4" />
          Nuevo usuario
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Nombre</th>
                <th className="px-5 py-3 font-medium">Usuario</th>
                <th className="px-5 py-3 font-medium">Rol</th>
                <th className="px-5 py-3 text-center font-medium">Estado</th>
                <th className="px-5 py-3 text-center font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {usuarios.map((u) => (
                <tr key={u.id} className="transition hover:bg-accent/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <UserCircle className="size-8 text-muted-foreground" />
                      <span className="font-medium text-foreground">{u.nombre}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">@{u.usuario}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${rolTone[u.rol]}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => toggleUsuarioActivo(u.id)}
                      disabled={u.id === currentUser?.id}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                        u.activo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      } ${u.id === currentUser?.id ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:opacity-80"}`}
                    >
                      <span className={`size-1.5 rounded-full ${u.activo ? "bg-primary" : "bg-muted-foreground"}`} />
                      {u.activo ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openEdit(u.id)}
                        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground"
                        aria-label="Editar"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(u.id)}
                        disabled={u.id === currentUser?.id}
                        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-30"
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

      {/* Modal crear/editar */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Editar usuario" : "Nuevo usuario"}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Nombre completo</label>
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Ej: Carlos Mendoza"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Usuario</label>
              <input
                value={form.usuario}
                onChange={(e) => setForm({ ...form, usuario: e.target.value })}
                className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Ej: carlos.m"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Contraseña {editingId && <span className="text-muted-foreground">(dejar vacío para no cambiar)</span>}
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="••••••"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Rol</label>
            <select
              value={form.rol}
              onChange={(e) => setForm({ ...form, rol: e.target.value as typeof form.rol })}
              className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {formError && <p className="text-sm text-destructive">{formError}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>{editingId ? "Guardar cambios" : "Crear usuario"}</Button>
          </div>
        </div>
      </Modal>

      {/* Modal confirmar eliminación */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Eliminar usuario">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
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
