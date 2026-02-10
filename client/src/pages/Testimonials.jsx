// ---------------------------------------------------------------------------
// Admin page: Testimonials
// ---------------------------------------------------------------------------
import { useState, useEffect } from "react";
import api from "../api";

const EMPTY = { student_name: "", content: "", photo_url: "", program_id: "", is_featured: false, display_order: 0, is_active: true };

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState({ ...EMPTY });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
    api.get("/api/programs").then(setPrograms).catch(console.error);
  }, []);

  async function fetchItems() {
    try { setItems(await api.get("/api/testimonials")); } catch (err) { console.error(err); }
  }

  function resetForm() { setForm({ ...EMPTY }); setEditingId(null); setError(null); }

  function startEdit(item) {
    setForm({
      student_name: item.student_name,
      content: item.content,
      photo_url: item.photo_url || "",
      program_id: item.program_id || "",
      is_featured: item.is_featured,
      display_order: item.display_order,
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
      photo_url: form.photo_url || null,
      program_id: form.program_id || null,
      display_order: Number(form.display_order),
    };
    try {
      if (editingId) {
        await api.put(`/api/testimonials/${editingId}`, payload);
      } else {
        await api.post("/api/testimonials", payload);
      }
      resetForm();
      fetchItems();
    } catch (err) { setError(err.message); }
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar este testimonio?")) return;
    try {
      await api.del(`/api/testimonials/${id}`);
      if (editingId === id) resetForm();
      fetchItems();
    } catch (err) { setError(err.message); }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Testimonios</h2>

      <div className="bg-white rounded-lg border overflow-x-auto mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orden</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estudiante</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Programa</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Testimonio</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destacado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activo</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500">{t.display_order}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{t.student_name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{t.program_name || "—"}</td>
                <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{t.content}</td>
                <td className="px-4 py-3 text-sm">
                  {t.is_featured ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Destacado</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-block w-2 h-2 rounded-full ${t.is_active ? "bg-green-500" : "bg-gray-300"}`} />
                </td>
                <td className="px-4 py-3 text-sm text-right space-x-3">
                  <button onClick={() => startEdit(t)} className="text-blue-600 hover:text-blue-800">Editar</button>
                  <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-800">Eliminar</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-400">Sin testimonios</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-4 sm:p-6 space-y-4 max-w-2xl">
        <h3 className="text-lg font-semibold text-slate-800">
          {editingId ? "Editar testimonio" : "Nuevo testimonio"}
        </h3>
        {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded border border-red-200">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del estudiante</label>
            <input type="text" value={form.student_name} onChange={(e) => setForm({ ...form, student_name: e.target.value })} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Programa (opcional)</label>
            <select value={form.program_id} onChange={(e) => setForm({ ...form, program_id: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
              <option value="">Sin programa</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">URL de foto</label>
            <input type="text" value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Orden</label>
            <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div className="flex items-center gap-4 pt-5">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="test_featured" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <label htmlFor="test_featured" className="text-sm text-gray-700">Destacado</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="test_active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <label htmlFor="test_active" className="text-sm text-gray-700">Activo</label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Testimonio</label>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
            {editingId ? "Guardar cambios" : "Crear testimonio"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">Cancelar</button>
          )}
        </div>
      </form>
    </div>
  );
}
