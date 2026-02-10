// ---------------------------------------------------------------------------
// Admin page: Quiénes Somos content management
// Manages the "About Us", Mission, Methodology/Código 753 content keys,
// and visual section divider images.
// ---------------------------------------------------------------------------
import { useState, useEffect } from "react";
import api from "../api";
import { getToken } from "../api";

const DIVIDER_FIELDS = [
  {
    urlKey: "divider_hero_metodologia_url",
    altKey: "divider_hero_metodologia_alt",
    label: "Hero → Metodología",
    description: "Acción intensa de entrenamiento. Se muestra entre la sección principal y Metodología.",
    preset: "hero",
  },
  {
    urlKey: "divider_metodologia_quienes_url",
    altKey: "divider_metodologia_quienes_alt",
    label: "Metodología → Quiénes Somos",
    description: "Foto de equipo o grupo. Se muestra entre Metodología y Quiénes Somos.",
    preset: "hero",
  },
  {
    urlKey: "divider_modalidad_filosofia_url",
    altKey: "divider_modalidad_filosofia_alt",
    label: "Modalidad → Código 753",
    description: "Imagen filosófica o meditativa. Se muestra entre Modalidad y Código 753.",
    preset: "hero",
  },
  {
    urlKey: "divider_horarios_mercancia_url",
    altKey: "divider_horarios_mercancia_alt",
    label: "Horarios → Mercancía",
    description: "Energía grupal de entrenamiento. Se muestra entre Horarios y Mercancía.",
    preset: "hero",
  },
];

const CONTENT_SECTIONS = [
  {
    title: "Quiénes Somos",
    description: "Información sobre la academia que aparece en la sección principal.",
    fields: [
      { key: "quienes_somos_headline", label: "Título de la sección", type: "text", placeholder: "Quiénes Somos" },
      { key: "quienes_somos_description", label: "Descripción (historia y quiénes somos)", type: "textarea", rows: 8, placeholder: "Texto principal sobre la academia..." },
      { key: "quienes_somos_team_photo_url", label: "URL de foto del equipo (opcional)", type: "text", placeholder: "https://..." },
    ],
  },
  {
    title: "Misión",
    description: "Texto de misión que aparece destacado en la sección Quiénes Somos.",
    fields: [
      { key: "quienes_somos_mision_headline", label: "Título de Misión", type: "text", placeholder: "Nuestra Misión" },
      { key: "quienes_somos_mision", label: "Texto de la misión", type: "textarea", rows: 6, placeholder: "Nuestra misión es..." },
    ],
  },
  {
    title: "Propósito",
    description: "Texto de propósito que aparece destacado en la sección Quiénes Somos.",
    fields: [
      { key: "quienes_somos_proposito_headline", label: "Título de Propósito", type: "text", placeholder: "Nuestro Propósito" },
      { key: "quienes_somos_proposito", label: "Texto del propósito", type: "textarea", rows: 8, placeholder: "Nuestro propósito es..." },
    ],
  },
  {
    title: "Metodología Valente Brothers™",
    description: "Descripción de la metodología que aparece en su propia sección.",
    fields: [
      { key: "methodology_headline", label: "Título de la sección", type: "text", placeholder: "Metodología Valente Brothers™" },
      { key: "methodology", label: "Descripción de la metodología", type: "textarea", rows: 5, placeholder: "Todos los programas siguen..." },
    ],
  },
  {
    title: "Código 753™",
    description: "Filosofía de vida: los 3 componentes del ser humano.",
    fields: [
      { key: "codigo_753_intro", label: "Introducción al Código 753", type: "textarea", rows: 4, placeholder: "La filosofía está resumida en el Código 753..." },
      { key: "codigo_753_spiritual_label", label: "Etiqueta componente 7", type: "text", placeholder: "Espiritual" },
      { key: "codigo_753_spiritual_description", label: "Descripción componente 7", type: "text", placeholder: 'El "7" representa la parte Espiritual...' },
      { key: "codigo_753_spiritual", label: "Virtudes (separadas por coma)", type: "text", placeholder: "Rectitud, Coraje, Benevolencia, Respeto, Honestidad, Honor, Lealtad" },
      { key: "codigo_753_physical_label", label: "Etiqueta componente 5", type: "text", placeholder: "Físico" },
      { key: "codigo_753_physical_description", label: "Descripción componente 5", type: "text", placeholder: 'El "5" representa la parte física...' },
      { key: "codigo_753_physical", label: "Elementos (separados por coma)", type: "text", placeholder: "Ejercicio, Nutrición, Descanso, Higiene, Positivismo" },
      { key: "codigo_753_mental_label", label: "Etiqueta componente 3", type: "text", placeholder: "Mental" },
      { key: "codigo_753_mental_description", label: "Descripción componente 3", type: "text", placeholder: 'El "3" representa la parte mental...' },
      { key: "codigo_753_mental", label: "Estados (separados por coma)", type: "text", placeholder: "Conciencia, Balance emocional, Adaptabilidad" },
    ],
  },
];

// Sub-component for each divider image field (upload + URL + preview)
function DividerImageField({ field, values, onChange, onSave, saving, saved }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch(`/api/upload/image?preset=${field.preset}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }
      const data = await response.json();
      onChange(field.urlKey, data.url);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  }

  const url = values[field.urlKey] || "";
  const alt = values[field.altKey] || "";

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-slate-50 border-b border-gray-200 px-5 py-3">
        <h4 className="text-sm font-semibold text-slate-800">{field.label}</h4>
        <p className="text-xs text-slate-500 mt-0.5">{field.description}</p>
      </div>
      <div className="p-5 space-y-4">
        {/* Image preview */}
        {url && (
          <div className="relative rounded-lg overflow-hidden bg-gray-100 h-40">
            <img
              src={url}
              alt={alt}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
          </div>
        )}

        {/* File Upload */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Subir imagen</label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleFileUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          />
          {uploading && <p className="mt-1 text-xs text-blue-600">Subiendo y optimizando...</p>}
          {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
        </div>

        {/* URL input */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">URL de imagen</label>
          <input
            type="text"
            value={url}
            onChange={(e) => onChange(field.urlKey, e.target.value)}
            placeholder="https://..."
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Alt text */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Texto alternativo</label>
          <input
            type="text"
            value={alt}
            onChange={(e) => onChange(field.altKey, e.target.value)}
            placeholder="Descripción de la imagen..."
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Save buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSave([field.urlKey, field.altKey])}
            disabled={saving[field.urlKey]}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-xs font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving[field.urlKey] ? "Guardando..." : "Guardar"}
          </button>
          {saved[field.urlKey] && (
            <span className="text-xs text-green-600">✓ Guardado</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function QuienesSomos() {
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState({});
  const [saved, setSaved] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    try {
      const items = await api.get("/api/site-content");
      const map = {};
      for (const item of items) {
        map[item.section_key] = item.content_text;
      }
      setValues(map);
    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear saved indicator when editing
    setSaved((prev) => ({ ...prev, [key]: false }));
  }

  async function handleSave(key) {
    setError(null);
    setSaving((prev) => ({ ...prev, [key]: true }));
    try {
      await api.put(`/api/site-content/${key}`, { content_text: values[key] || "" });
      setSaved((prev) => ({ ...prev, [key]: true }));
      // Clear saved indicator after 3 seconds
      setTimeout(() => setSaved((prev) => ({ ...prev, [key]: false })), 3000);
    } catch (err) {
      setError(`Error guardando "${key}": ${err.message}`);
    } finally {
      setSaving((prev) => ({ ...prev, [key]: false }));
    }
  }

  async function handleSaveSection(fields) {
    setError(null);
    const keys = fields.map((f) => f.key);
    for (const key of keys) {
      setSaving((prev) => ({ ...prev, [key]: true }));
    }
    try {
      for (const key of keys) {
        await api.put(`/api/site-content/${key}`, { content_text: values[key] || "" });
        setSaved((prev) => ({ ...prev, [key]: true }));
      }
      // Clear all saved indicators after 3 seconds
      setTimeout(() => {
        for (const key of keys) {
          setSaved((prev) => ({ ...prev, [key]: false }));
        }
      }, 3000);
    } catch (err) {
      setError(`Error guardando sección: ${err.message}`);
    } finally {
      for (const key of keys) {
        setSaving((prev) => ({ ...prev, [key]: false }));
      }
    }
  }

  async function handleSaveDivider(keys) {
    setError(null);
    for (const key of keys) {
      setSaving((prev) => ({ ...prev, [key]: true }));
    }
    try {
      for (const key of keys) {
        await api.put(`/api/site-content/${key}`, { content_text: values[key] || "" });
        setSaved((prev) => ({ ...prev, [key]: true }));
      }
      setTimeout(() => {
        for (const key of keys) {
          setSaved((prev) => ({ ...prev, [key]: false }));
        }
      }, 3000);
    } catch (err) {
      setError(`Error guardando divisor: ${err.message}`);
    } finally {
      for (const key of keys) {
        setSaving((prev) => ({ ...prev, [key]: false }));
      }
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800">Quiénes Somos & Metodología</h2>
        <p className="text-sm text-slate-500 mt-1">
          Gestiona el contenido de las secciones "Quiénes Somos", "Misión", "Metodología" y "Código 753".
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200 mb-6">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {CONTENT_SECTIONS.map((section) => (
          <div key={section.title} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Section Header */}
            <div className="bg-slate-50 border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-800">{section.title}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{section.description}</p>
            </div>

            {/* Fields */}
            <div className="p-6 space-y-5">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{field.label}</span>
                    <span className="text-xs font-mono text-gray-400">{field.key}</span>
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={values[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      rows={field.rows || 4}
                      placeholder={field.placeholder}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  )}
                  {/* Individual save button with feedback */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <button
                      onClick={() => handleSave(field.key)}
                      disabled={saving[field.key]}
                      className="text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                    >
                      {saving[field.key] ? "Guardando..." : "Guardar campo"}
                    </button>
                    {saved[field.key] && (
                      <span className="text-xs text-green-600">✓ Guardado</span>
                    )}
                  </div>
                </div>
              ))}

              {/* Save All Section Button */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleSaveSection(section.fields)}
                  className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Guardar toda la sección "{section.title}"
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================================================================= */}
      {/* DIVISORES VISUALES                                                */}
      {/* ================================================================= */}
      <div className="mt-12 mb-8">
        <h2 className="text-xl font-bold text-slate-800">Divisores Visuales</h2>
        <p className="text-sm text-slate-500 mt-1">
          Imágenes de ancho completo que se muestran entre secciones del sitio para crear un efecto visual más atractivo.
          Recomendado: fotos panorámicas de alta calidad (1920x600px mínimo).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {DIVIDER_FIELDS.map((field) => (
          <DividerImageField
            key={field.urlKey}
            field={field}
            values={values}
            onChange={handleChange}
            onSave={handleSaveDivider}
            saving={saving}
            saved={saved}
          />
        ))}
      </div>
    </div>
  );
}
