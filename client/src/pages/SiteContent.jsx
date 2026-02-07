// ---------------------------------------------------------------------------
// Admin page: Site Content (key-value text blocks)
// ---------------------------------------------------------------------------
import { useState, useEffect } from "react";
import api from "../api";

export default function SiteContent() {
  const [items, setItems] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [editText, setEditText] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newText, setNewText] = useState("");
  const [error, setError] = useState(null);

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

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Contenido del Sitio</h2>

      {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded border border-red-200 mb-4">{error}</div>}

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
      <form onSubmit={handleCreate} className="bg-white rounded-lg border p-6 space-y-4 max-w-2xl">
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
