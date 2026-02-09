// ---------------------------------------------------------------------------
// Admin page: Gallery Images
// ---------------------------------------------------------------------------
import { useState, useEffect } from "react";
import api from "../api";
import { getToken } from "../api";

const CATEGORIES = ["training", "facilities", "events", "instructors", "students", "hero"];
const EMPTY = { url: "", alt_text: "", caption: "", category: "training", display_order: 0, is_active: true };

export default function GalleryImages() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ...EMPTY });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState("url"); // "url" or "file"

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    try { setItems(await api.get("/api/gallery-images")); } catch (err) { console.error(err); }
  }

  function resetForm() { 
    setForm({ ...EMPTY }); 
    setEditingId(null); 
    setError(null);
    setUploadMode("url");
  }

  function startEdit(item) {
    setForm({
      url: item.url,
      alt_text: item.alt_text,
      caption: item.caption || "",
      category: item.category,
      display_order: item.display_order,
      is_active: item.is_active,
    });
    setEditingId(item.id);
    setError(null);
    setUploadMode("url");
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      // Use appropriate preset based on category
      const preset = form.category === "hero" ? "hero" : "gallery";
      
      const response = await fetch(`/api/upload/image?preset=${preset}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();
      setForm({ ...form, url: data.url });
      setUploadMode("url");
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const payload = { ...form, caption: form.caption || null, display_order: Number(form.display_order) };
    try {
      if (editingId) {
        await api.put(`/api/gallery-images/${editingId}`, payload);
      } else {
        await api.post("/api/gallery-images", payload);
      }
      resetForm();
      fetchItems();
    } catch (err) { setError(err.message); }
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar esta imagen?")) return;
    try {
      await api.del(`/api/gallery-images/${id}`);
      if (editingId === id) resetForm();
      fetchItems();
    } catch (err) { setError(err.message); }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Galería</h2>

      <div className="bg-white rounded-lg border overflow-x-auto mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orden</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preview</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alt text</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activo</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((img) => (
              <tr key={img.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500">{img.display_order}</td>
                <td className="px-4 py-3">
                  {img.url ? (
                    <img src={img.url} alt={img.alt_text} className="h-10 w-14 object-cover rounded" />
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">{img.alt_text}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{img.category}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-block w-2 h-2 rounded-full ${img.is_active ? "bg-green-500" : "bg-gray-300"}`} />
                </td>
                <td className="px-4 py-3 text-sm text-right space-x-3">
                  <button onClick={() => startEdit(img)} className="text-blue-600 hover:text-blue-800">Editar</button>
                  <button onClick={() => handleDelete(img.id)} className="text-red-600 hover:text-red-800">Eliminar</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-400">Sin imágenes</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 space-y-4 max-w-2xl">
        <h3 className="text-lg font-semibold text-slate-800">
          {editingId ? "Editar imagen" : "Nueva imagen"}
        </h3>
        {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded border border-red-200">{error}</div>}

        {/* Upload Mode Toggle */}
        <div className="flex gap-2 border-b pb-3">
          <button
            type="button"
            onClick={() => setUploadMode("file")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              uploadMode === "file"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Subir archivo
          </button>
          <button
            type="button"
            onClick={() => setUploadMode("url")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              uploadMode === "url"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            URL externa
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Image Upload/URL Input */}
          {uploadMode === "file" ? (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subir imagen (se convertirá a WebP)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleFileUpload}
                disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
              />
              {uploading && (
                <p className="mt-2 text-sm text-blue-600">Subiendo y optimizando imagen...</p>
              )}
              {form.url && !uploading && (
                <div className="mt-2">
                  <p className="text-sm text-green-600 mb-2">✓ Imagen subida exitosamente</p>
                  <img src={form.url} alt="Preview" className="max-w-xs rounded border" />
                </div>
              )}
            </div>
          ) : (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">URL de imagen</label>
              <input 
                type="text" 
                value={form.url} 
                onChange={(e) => setForm({ ...form, url: e.target.value })} 
                required 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" 
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Texto alt</label>
            <input type="text" value={form.alt_text} onChange={(e) => setForm({ ...form, alt_text: e.target.value })} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Leyenda</label>
            <input type="text" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Orden</label>
            <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div className="flex items-center gap-2 pt-5">
            <input type="checkbox" id="gal_active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="gal_active" className="text-sm text-gray-700">Activo</label>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={uploading || !form.url} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {editingId ? "Guardar cambios" : "Crear imagen"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">Cancelar</button>
          )}
        </div>
      </form>
    </div>
  );
}
