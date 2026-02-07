// ---------------------------------------------------------------------------
// Admin page: Merchandise
// ---------------------------------------------------------------------------
import { useState, useEffect } from "react";
import api from "../api";

const CATEGORIES = ["kimono", "equipment", "apparel", "general"];
const EMPTY = { name: "", slug: "", description: "", price: "", image_url: "", category: "general", is_available: true, display_order: 0 };

export default function Merchandise() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ...EMPTY });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    try { setItems(await api.get("/api/merchandise")); } catch (err) { console.error(err); }
  }

  function resetForm() { setForm({ ...EMPTY }); setEditingId(null); setError(null); }

  function startEdit(item) {
    setForm({
      name: item.name,
      slug: item.slug,
      description: item.description || "",
      price: item.price ?? "",
      image_url: item.image_url || "",
      category: item.category,
      is_available: item.is_available,
      display_order: item.display_order,
    });
    setEditingId(item.id);
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const payload = {
      ...form,
      description: form.description || null,
      price: form.price === "" ? null : Number(form.price),
      image_url: form.image_url || null,
      display_order: Number(form.display_order),
    };
    try {
      if (editingId) {
        await api.put(`/api/merchandise/${editingId}`, payload);
      } else {
        await api.post("/api/merchandise", payload);
      }
      resetForm();
      fetchItems();
    } catch (err) { setError(err.message); }
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await api.del(`/api/merchandise/${id}`);
      if (editingId === id) resetForm();
      fetchItems();
    } catch (err) { setError(err.message); }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Mercancía</h2>

      <div className="bg-white rounded-lg border overflow-x-auto mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orden</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preview</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disponible</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500">{m.display_order}</td>
                <td className="px-4 py-3">
                  {m.image_url ? (
                    <img src={m.image_url} alt={m.name} className="h-10 w-14 object-cover rounded" />
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{m.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{m.category}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{m.price != null ? `Q${m.price}` : "—"}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-block w-2 h-2 rounded-full ${m.is_available ? "bg-green-500" : "bg-gray-300"}`} />
                </td>
                <td className="px-4 py-3 text-sm text-right space-x-3">
                  <button onClick={() => startEdit(m)} className="text-blue-600 hover:text-blue-800">Editar</button>
                  <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:text-red-800">Eliminar</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-400">Sin productos</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 space-y-4 max-w-2xl">
        <h3 className="text-lg font-semibold text-slate-800">
          {editingId ? "Editar producto" : "Nuevo producto"}
        </h3>
        {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded border border-red-200">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Slug</label>
            <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Precio (Q)</label>
            <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">URL de imagen</label>
            <input type="text" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Orden</label>
            <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div className="flex items-center gap-2 pt-5">
            <input type="checkbox" id="merch_available" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="merch_available" className="text-sm text-gray-700">Disponible</label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
            {editingId ? "Guardar cambios" : "Crear producto"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">Cancelar</button>
          )}
        </div>
      </form>
    </div>
  );
}
