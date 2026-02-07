// ---------------------------------------------------------------------------
// Admin page: Admin Users
// ---------------------------------------------------------------------------
import { useState, useEffect } from "react";
import api from "../api";

const EMPTY = { email: "", password: "", full_name: "", is_active: true };

export default function AdminUsers() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ...EMPTY });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    try { setItems(await api.get("/api/admin-users")); } catch (err) { console.error(err); }
  }

  function resetForm() { setForm({ ...EMPTY }); setEditingId(null); setError(null); }

  function startEdit(item) {
    setForm({
      email: item.email,
      password: "",
      full_name: item.full_name,
      is_active: item.is_active,
    });
    setEditingId(item.id);
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const payload = { ...form };
    // On edit, only send password if user typed a new one
    if (editingId && !payload.password) {
      delete payload.password;
    }

    try {
      if (editingId) {
        await api.put(`/api/admin-users/${editingId}`, payload);
      } else {
        if (!form.password) {
          setError("La contraseña es requerida para nuevos usuarios");
          return;
        }
        await api.post("/api/admin-users", payload);
      }
      resetForm();
      fetchItems();
    } catch (err) { setError(err.message); }
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar este administrador?")) return;
    try {
      await api.del(`/api/admin-users/${id}`);
      if (editingId === id) resetForm();
      fetchItems();
    } catch (err) { setError(err.message); }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Administradores</h2>

      <div className="bg-white rounded-lg border overflow-x-auto mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activo</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{u.full_name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-block w-2 h-2 rounded-full ${u.is_active ? "bg-green-500" : "bg-gray-300"}`} />
                </td>
                <td className="px-4 py-3 text-sm text-right space-x-3">
                  <button onClick={() => startEdit(u)} className="text-blue-600 hover:text-blue-800">Editar</button>
                  <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-800">Eliminar</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-400">Sin administradores</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 space-y-4 max-w-2xl">
        <h3 className="text-lg font-semibold text-slate-800">
          {editingId ? "Editar administrador" : "Nuevo administrador"}
        </h3>
        {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded border border-red-200">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
            <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {editingId ? "Nueva contraseña (dejar vacío para mantener)" : "Contraseña"}
            </label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div className="flex items-center gap-2 pt-5">
            <input type="checkbox" id="admin_active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="admin_active" className="text-sm text-gray-700">Activo</label>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
            {editingId ? "Guardar cambios" : "Crear administrador"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">Cancelar</button>
          )}
        </div>
      </form>
    </div>
  );
}
