// ---------------------------------------------------------------------------
// Admin page: Programs
// ---------------------------------------------------------------------------
import { useState, useEffect } from "react";
import api from "../api";
import { getToken } from "../api";

const EMPTY = {
  name: "",
  slug: "",
  subtitle: "",
  description: "",
  image_url: "",
  age_range_min: "",
  age_range_max: "",
  target_audience: "children",
  display_order: 0,
  is_active: true,
};

export default function Programs() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ...EMPTY });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      setItems(await api.get("/api/programs"));
    } catch (err) {
      console.error(err);
    }
  }

  function resetForm() {
    setForm({ ...EMPTY });
    setEditingId(null);
    setError(null);
  }

  function startEdit(item) {
    setForm({
      name: item.name,
      slug: item.slug,
      subtitle: item.subtitle || "",
      description: item.description,
      image_url: item.image_url || "",
      age_range_min: item.age_range_min ?? "",
      age_range_max: item.age_range_max ?? "",
      target_audience: item.target_audience,
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
      subtitle: form.subtitle || null,
      image_url: form.image_url || null,
      age_range_min: form.age_range_min === "" ? null : Number(form.age_range_min),
      age_range_max: form.age_range_max === "" ? null : Number(form.age_range_max),
      display_order: Number(form.display_order),
    };

    try {
      if (editingId) {
        await api.put(`/api/programs/${editingId}`, payload);
      } else {
        await api.post("/api/programs", payload);
      }
      resetForm();
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload/image?preset=program", {
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
      setForm({ ...form, image_url: data.url });
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar este programa? Se borrarán también sus horarios.")) return;
    try {
      await api.del(`/api/programs/${id}`);
      if (editingId === id) resetForm();
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  }

  function field(label, name, type = "text", rest = {}) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
          type={type}
          value={form[name]}
          onChange={(e) => setForm({ ...form, [name]: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          {...rest}
        />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Programas</h2>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-x-auto mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orden</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Audiencia</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Edades</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activo</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500">{p.display_order}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{p.slug}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{p.target_audience}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {p.age_range_min != null ? `${p.age_range_min}–${p.age_range_max}` : "—"}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-block w-2 h-2 rounded-full ${p.is_active ? "bg-green-500" : "bg-gray-300"}`} />
                </td>
                <td className="px-4 py-3 text-sm text-right space-x-3">
                  <button onClick={() => startEdit(p)} className="text-blue-600 hover:text-blue-800">Editar</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800">Eliminar</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-400">Sin programas</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-4 sm:p-6 space-y-4 max-w-2xl">
        <h3 className="text-lg font-semibold text-slate-800">
          {editingId ? "Editar programa" : "Nuevo programa"}
        </h3>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded border border-red-200">{error}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field("Nombre", "name", "text", { required: true })}
          {field("Slug", "slug", "text", { required: true })}
          {field("Subtítulo", "subtitle")}
          
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen del programa (opcional)
            </label>
            <div className="space-y-3">
              {/* File Upload */}
              <div>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                />
                {uploading && (
                  <p className="mt-1 text-sm text-blue-600">Subiendo y optimizando imagen...</p>
                )}
              </div>
              
              {/* Or URL Input */}
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
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://ejemplo.com/imagen-programa.jpg"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              
              {form.image_url && (
                <div className="mt-2">
                  <img 
                    src={form.image_url} 
                    alt="Preview" 
                    className="max-w-xs rounded border"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              La imagen se mostrará en la tarjeta del programa. Recomendado: 800x600px
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Audiencia</label>
            <select
              value={form.target_audience}
              onChange={(e) => setForm({ ...form, target_audience: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="children">children</option>
              <option value="teens">teens</option>
              <option value="women">women</option>
              <option value="adults">adults</option>
              <option value="professionals">professionals</option>
            </select>
          </div>

          {field("Edad mínima", "age_range_min", "number")}
          {field("Edad máxima", "age_range_max", "number")}
          {field("Orden", "display_order", "number")}

          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="is_active"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">Activo</label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            {editingId ? "Guardar cambios" : "Crear programa"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
