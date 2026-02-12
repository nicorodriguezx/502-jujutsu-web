// ---------------------------------------------------------------------------
// Admin page: Site Content (key-value text blocks)
// ---------------------------------------------------------------------------
import { useState, useEffect } from "react";
import api from "../api";
import { getToken } from "../api";

// Keys that hold image URLs for modalidad cards
const MODALIDAD_IMAGE_KEYS = [
  { key: "modalidad_grupal_image_url", label: "Imagen — Clases Grupales" },
  { key: "modalidad_privada_image_url", label: "Imagen — Clases Privadas" },
];

export default function SiteContent() {
  const [items, setItems] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [editText, setEditText] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newText, setNewText] = useState("");
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(null); // key currently uploading

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    try { setItems(await api.get("/api/site-content")); } catch (err) { console.error(err); }
  }

  function startEdit(item) {
    setEditingKey(item.section_key);
    setEditText(item.content_text);
    setError(null);
  }

  function cancelEdit() {
    setEditingKey(null);
    setEditText("");
    setError(null);
  }

  async function saveEdit(key) {
    setError(null);
    try {
      await api.put(`/api/site-content/${key}`, { content_text: editText });
      cancelEdit();
      fetchItems();
    } catch (err) { setError(err.message); }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);
    if (!newKey || !newText) return;
    try {
      await api.put(`/api/site-content/${newKey}`, { content_text: newText });
      setNewKey("");
      setNewText("");
      fetchItems();
    } catch (err) { setError(err.message); }
  }

  async function handleDelete(key) {
    if (!confirm(`¿Eliminar "${key}"?`)) return;
    try {
      await api.del(`/api/site-content/${key}`);
      fetchItems();
    } catch (err) { setError(err.message); }
  }

  // Get current value for a site_content key
  function getValueForKey(sectionKey) {
    const item = items.find((i) => i.section_key === sectionKey);
    return item ? item.content_text : "";
  }

  // Upload image for a modalidad card and save its URL to site_content
  async function handleModalidadImageUpload(e, sectionKey) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(sectionKey);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload/image?preset=program", {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();
      // Save the URL into site_content
      await api.put(`/api/site-content/${sectionKey}`, { content_text: data.url });
      fetchItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(null);
    }
  }

  // Remove image for a modalidad card
  async function handleModalidadImageRemove(sectionKey) {
    setError(null);
    try {
      await api.put(`/api/site-content/${sectionKey}`, { content_text: "" });
      fetchItems();
    } catch (err) { setError(err.message); }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Contenido del Sitio</h2>

      {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded border border-red-200 mb-4">{error}</div>}

      {/* ── Modalidad Image Uploads ──────────────────────────────── */}
      <div className="bg-white rounded-lg border p-4 sm:p-6 mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-1">
          Modalidad de Entrenamiento — Imágenes
        </h3>
        <p className="text-sm text-gray-500 mb-5">
          Sube una imagen para cada tarjeta de modalidad. Recomendado: 1200×600 px.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {MODALIDAD_IMAGE_KEYS.map(({ key, label }) => {
            const currentUrl = getValueForKey(key);
            const isUploading = uploading === key;
            return (
              <div key={key} className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">{label}</label>

                {/* Preview */}
                {currentUrl ? (
                  <div className="relative group">
                    <img
                      src={currentUrl}
                      alt={label}
                      className="w-full h-40 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => handleModalidadImageRemove(key)}
                      className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Quitar
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-40 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-400">
                    Sin imagen
                  </div>
                )}

                {/* File input */}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={(e) => handleModalidadImageUpload(e, key)}
                  disabled={isUploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                />
                {isUploading && (
                  <p className="text-sm text-blue-600">Subiendo y optimizando imagen...</p>
                )}

                {/* Manual URL input */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-gray-500">o ingresa URL</span>
                  </div>
                </div>
                <input
                  type="text"
                  key={currentUrl}
                  defaultValue={currentUrl}
                  onBlur={async (e) => {
                    const val = e.target.value.trim();
                    if (val !== currentUrl) {
                      try {
                        await api.put(`/api/site-content/${key}`, { content_text: val });
                        fetchItems();
                      } catch (err) { setError(err.message); }
                    }
                  }}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Existing entries */}
      <div className="space-y-3 mb-8">
        {items.map((item) => (
          <div key={item.section_key} className="bg-white rounded-lg border p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono font-medium text-blue-700">{item.section_key}</p>
                {editingKey === item.section_key ? (
                  <div className="mt-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={4}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => saveEdit(item.section_key)} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700">Guardar</button>
                      <button onClick={cancelEdit} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-200">Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{item.content_text}</p>
                )}
              </div>
              {editingKey !== item.section_key && (
                <div className="flex gap-3 flex-shrink-0">
                  <button onClick={() => startEdit(item)} className="text-sm text-blue-600 hover:text-blue-800">Editar</button>
                  <button onClick={() => handleDelete(item.section_key)} className="text-sm text-red-600 hover:text-red-800">Eliminar</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-gray-400">Sin contenido</p>
        )}
      </div>

      {/* New entry */}
      <form onSubmit={handleCreate} className="bg-white rounded-lg border p-4 sm:p-6 space-y-4 max-w-2xl">
        <h3 className="text-lg font-semibold text-slate-800">Nueva entrada</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">Clave (section_key)</label>
          <input type="text" value={newKey} onChange={(e) => setNewKey(e.target.value)} required placeholder="hero_headline" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contenido</label>
          <textarea value={newText} onChange={(e) => setNewText(e.target.value)} required rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
          Crear entrada
        </button>
      </form>
    </div>
  );
}
