// ---------------------------------------------------------------------------
// Admin page: Gallery Images + Site Section Images
// ---------------------------------------------------------------------------
import { useState, useEffect } from "react";
import api from "../api";
import { getToken } from "../api";

const EMPTY = { url: "", alt_text: "", caption: "", display_order: 0, is_active: true };

// All special images managed via site_content key-value store.
// Each entry has a URL key, an alt-text key, a label, and a description.
const SITE_IMAGE_FIELDS = [
  {
    urlKey: "hero_image_url",
    altKey: "hero_image_alt",
    label: "Imagen Hero (Principal)",
    description: "Imagen de fondo de la sección principal del sitio",
  },
  {
    urlKey: "quienes_somos_team_photo_url",
    altKey: "quienes_somos_team_photo_alt",
    label: "Foto del Equipo (Quiénes Somos)",
    description: "Foto del equipo que aparece junto al texto de Quiénes Somos",
  },
  {
    urlKey: "divider_metodologia_quienes_url",
    altKey: "divider_metodologia_quienes_alt",
    label: "Divisor: Metodología → Quiénes Somos",
    description: "Foto de equipo o grupo",
  },
  {
    urlKey: "divider_quienes_programas_url",
    altKey: "divider_quienes_programas_alt",
    label: "Divisor: Quiénes Somos → Programas",
    description: "Imagen entre secciones Quiénes Somos y Programas",
  },
  {
    urlKey: "divider_modalidad_filosofia_url",
    altKey: "divider_modalidad_filosofia_alt",
    label: "Divisor: Modalidad → Código 753",
    description: "Imagen filosófica o meditativa",
  },
  {
    urlKey: "divider_horarios_mercancia_url",
    altKey: "divider_horarios_mercancia_alt",
    label: "Divisor: Horarios → Mercancía",
    description: "Energía grupal de entrenamiento",
  },
];

export default function GalleryImages() {
  // --- Gallery images (table) state ---
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ...EMPTY });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState("url");

  // --- Site images (site_content) state ---
  const [siteValues, setSiteValues] = useState({});
  const [siteSaving, setSiteSaving] = useState({});
  const [siteSaved, setSiteSaved] = useState({});
  const [siteError, setSiteError] = useState(null);

  useEffect(() => {
    fetchItems();
    fetchSiteImages();
  }, []);

  // ── Gallery images CRUD ────────────────────────────────────────────
  async function fetchItems() {
    try {
      setItems(await api.get("/api/gallery-images"));
    } catch (err) {
      console.error(err);
    }
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
      const response = await fetch("/api/upload/image?preset=gallery", {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
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
    const payload = {
      ...form,
      caption: form.caption || null,
      display_order: Number(form.display_order),
      category: "general",
    };
    try {
      if (editingId) {
        await api.put(`/api/gallery-images/${editingId}`, payload);
      } else {
        await api.post("/api/gallery-images", payload);
      }
      resetForm();
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar esta imagen?")) return;
    try {
      await api.del(`/api/gallery-images/${id}`);
      if (editingId === id) resetForm();
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  }

  // ── Site images (site_content) helpers ──────────────────────────────
  async function fetchSiteImages() {
    try {
      const items = await api.get("/api/site-content");
      const map = {};
      for (const item of items) map[item.section_key] = item.content_text;
      setSiteValues(map);
    } catch (err) {
      console.error(err);
    }
  }

  function handleSiteChange(key, value) {
    setSiteValues((prev) => ({ ...prev, [key]: value }));
    setSiteSaved((prev) => ({ ...prev, [key]: false }));
  }

  async function handleSiteSave(keys) {
    setSiteError(null);
    for (const key of keys)
      setSiteSaving((prev) => ({ ...prev, [key]: true }));
    try {
      for (const key of keys) {
        await api.put(`/api/site-content/${key}`, {
          content_text: siteValues[key] || "",
        });
        setSiteSaved((prev) => ({ ...prev, [key]: true }));
      }
      setTimeout(() => {
        for (const key of keys)
          setSiteSaved((prev) => ({ ...prev, [key]: false }));
      }, 3000);
    } catch (err) {
      setSiteError(`Error guardando: ${err.message}`);
    } finally {
      for (const key of keys)
        setSiteSaving((prev) => ({ ...prev, [key]: false }));
    }
  }

  async function handleSiteUpload(field, e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSiteSaving((prev) => ({ ...prev, [`${field.urlKey}_upload`]: true }));
    setSiteError(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch("/api/upload/image?preset=hero", {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }
      const data = await response.json();
      handleSiteChange(field.urlKey, data.url);
    } catch (err) {
      setSiteError(err.message);
    } finally {
      setSiteSaving((prev) => ({
        ...prev,
        [`${field.urlKey}_upload`]: false,
      }));
    }
  }

  async function handleSiteRemove(field) {
    if (!confirm("¿Eliminar esta imagen? Se guardará vacío.")) return;
    handleSiteChange(field.urlKey, "");
    handleSiteChange(field.altKey, "");
    await handleSiteSave([field.urlKey, field.altKey]);
  }

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div>
      {/* ============================================================= */}
      {/* SITE SECTION IMAGES                                            */}
      {/* ============================================================= */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-slate-800">
          Imágenes del Sitio
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Imagen principal (hero), foto del equipo, y divisores entre
          secciones. Recomendado: fotos de alta resolución (1920px mínimo de
          ancho).
        </p>
      </div>

      {siteError && (
        <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded border border-red-200 mb-4">
          {siteError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {SITE_IMAGE_FIELDS.map((field) => {
          const url = siteValues[field.urlKey] || "";
          const alt = siteValues[field.altKey] || "";
          const isUploading = siteSaving[`${field.urlKey}_upload`];

          return (
            <div
              key={field.urlKey}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <div className="bg-slate-50 border-b border-gray-200 px-4 py-3 sm:px-5">
                <h4 className="text-sm font-semibold text-slate-800">
                  {field.label}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {field.description}
                </p>
              </div>
              <div className="p-4 sm:p-5 space-y-3">
                {/* Preview */}
                {url && (
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 h-36">
                    <img
                      src={url}
                      alt={alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
                  </div>
                )}

                {/* Upload */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Subir imagen
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={(e) => handleSiteUpload(field, e)}
                    disabled={isUploading}
                    className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                  />
                  {isUploading && (
                    <p className="mt-1 text-xs text-blue-600">
                      Subiendo y optimizando...
                    </p>
                  )}
                </div>

                {/* URL */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    URL de imagen
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) =>
                      handleSiteChange(field.urlKey, e.target.value)
                    }
                    placeholder="https://..."
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  />
                </div>

                {/* Alt */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Texto alternativo
                  </label>
                  <input
                    type="text"
                    value={alt}
                    onChange={(e) =>
                      handleSiteChange(field.altKey, e.target.value)
                    }
                    placeholder="Descripción de la imagen..."
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  />
                </div>

                {/* Save / Remove */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      handleSiteSave([field.urlKey, field.altKey])
                    }
                    disabled={siteSaving[field.urlKey]}
                    className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-xs font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {siteSaving[field.urlKey] ? "Guardando..." : "Guardar"}
                  </button>
                  {url && (
                    <button
                      onClick={() => handleSiteRemove(field)}
                      disabled={siteSaving[field.urlKey]}
                      className="bg-red-50 text-red-600 px-4 py-1.5 rounded-md text-xs font-medium hover:bg-red-100 disabled:opacity-50 transition-colors"
                    >
                      Quitar imagen
                    </button>
                  )}
                  {siteSaved[field.urlKey] && (
                    <span className="text-xs text-green-600">✓ Guardado</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================= */}
      {/* GALLERY IMAGES TABLE                                           */}
      {/* ============================================================= */}
      <h2 className="text-xl font-bold text-slate-800 mb-6">
        Galería General
      </h2>

      <div className="bg-white rounded-lg border overflow-x-auto mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Orden
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Preview
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Alt text
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Activo
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((img) => (
              <tr key={img.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500">
                  {img.display_order}
                </td>
                <td className="px-4 py-3">
                  {img.url ? (
                    <img
                      src={img.url}
                      alt={img.alt_text}
                      className="h-10 w-14 object-cover rounded"
                    />
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                  {img.alt_text}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      img.is_active ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                </td>
                <td className="px-4 py-3 text-sm text-right space-x-3">
                  <button
                    onClick={() => startEdit(img)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm text-gray-400"
                >
                  Sin imágenes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Gallery image form (no category field) */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border p-4 sm:p-6 space-y-4 max-w-2xl"
      >
        <h3 className="text-lg font-semibold text-slate-800">
          {editingId ? "Editar imagen" : "Nueva imagen"}
        </h3>
        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded border border-red-200">
            {error}
          </div>
        )}

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
                <p className="mt-2 text-sm text-blue-600">
                  Subiendo y optimizando imagen...
                </p>
              )}
              {form.url && !uploading && (
                <div className="mt-2">
                  <p className="text-sm text-green-600 mb-2">
                    ✓ Imagen subida exitosamente
                  </p>
                  <img
                    src={form.url}
                    alt="Preview"
                    className="max-w-xs rounded border"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                URL de imagen
              </label>
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
            <label className="block text-sm font-medium text-gray-700">
              Texto alt
            </label>
            <input
              type="text"
              value={form.alt_text}
              onChange={(e) => setForm({ ...form, alt_text: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Leyenda
            </label>
            <input
              type="text"
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Orden
            </label>
            <input
              type="number"
              value={form.display_order}
              onChange={(e) =>
                setForm({ ...form, display_order: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="gal_active"
              checked={form.is_active}
              onChange={(e) =>
                setForm({ ...form, is_active: e.target.checked })
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="gal_active" className="text-sm text-gray-700">
              Activo
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={uploading || !form.url}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingId ? "Guardar cambios" : "Crear imagen"}
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
