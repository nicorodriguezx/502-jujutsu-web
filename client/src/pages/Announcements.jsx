// ---------------------------------------------------------------------------
// Admin page: Announcements
// ---------------------------------------------------------------------------
import { useState, useEffect } from "react";
import api from "../api";

const EMPTY = { title: "", body: "", published_at: "", is_active: true };

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ...EMPTY });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    try { setItems(await api.get("/api/announcements")); } catch (err) { console.error(err); }
  }

  function resetForm() { setForm({ ...EMPTY }); setEditingId(null); setError(null); }

  function startEdit(item) {
    setForm({
      title: item.title,
      body: item.body,
      published_at: item.published_at ? item.published_at.slice(0, 16) : "",
      is_active: item.is_active,
    });
    setEditingId(item.id);
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const payload = {
      ...form,
      published_at: form.published_at || null,
    };
    try {
      if (editingId) {
        await api.put(`/api/announcements/${editingId}`, payload);
      } else {
        await api.post("/api/announcements", payload);
      }
      resetForm();
      fetchItems();
    } catch (err) { setError(err.message); }
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar este anuncio?")) return;
    try {
      await api.del(`/api/announcements/${id}`);
      if (editingId === id) resetForm();
      fetchItems();
    } catch (err) { setError(err.message); }
  }

  function formatDate(iso) {
    if (!iso) return "Borrador";
    return new Date(iso).toLocaleString("es-GT", { dateStyle: "medium", timeStyle: "short" });
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Anuncios</h2>

      <div className="bg-white rounded-lg border overflow-x-auto mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Publicado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activo</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{a.title}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{formatDate(a.published_at)}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-block w-2 h-2 rounded-full ${a.is_active ? "bg-green-500" : "bg-gray-300"}`} />
                </td>
                <td className="px-4 py-3 text-sm text-right space-x-3">
                  <button onClick={() => startEdit(a)} className="text-blue-600 hover:text-blue-800">Editar</button>
                  <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:text-red-800">Eliminar</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-400">Sin anuncios</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 space-y-4 max-w-2xl">
        <h3 className="text-lg font-semibold text-slate-800">
          {editingId ? "Editar anuncio" : "Nuevo anuncio"}
        </h3>
        {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded border border-red-200">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700">Título</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cuerpo</label>
          <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required rows={5} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de publicación (vacío = borrador)</label>
            <input type="datetime-local" value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div className="flex items-center gap-2 pt-5">
            <input type="checkbox" id="ann_active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="ann_active" className="text-sm text-gray-700">Activo</label>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
            {editingId ? "Guardar cambios" : "Crear anuncio"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">Cancelar</button>
          )}
        </div>
      </form>
    </div>
  );
}
