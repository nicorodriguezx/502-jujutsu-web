// ---------------------------------------------------------------------------
// Admin page: Schedule Entries
// ---------------------------------------------------------------------------
import { useState, useEffect } from "react";
import api from "../api";

const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const EMPTY = {
  program_id: "",
  day_of_week: 1,
  start_time: "09:00",
  end_time: "10:00",
  description: "",
  is_active: true,
};

export default function ScheduleEntries() {
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
    try {
      setItems(await api.get("/api/schedule-entries"));
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
      program_id: item.program_id,
      day_of_week: item.day_of_week,
      start_time: item.start_time?.slice(0, 5) || "09:00",
      end_time: item.end_time?.slice(0, 5) || "10:00",
      description: item.description || "",
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
      day_of_week: Number(form.day_of_week),
      description: form.description || null,
    };

    try {
      if (editingId) {
        await api.put(`/api/schedule-entries/${editingId}`, payload);
      } else {
        await api.post("/api/schedule-entries", payload);
      }
      resetForm();
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar esta entrada de horario?")) return;
    try {
      await api.del(`/api/schedule-entries/${id}`);
      if (editingId === id) resetForm();
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Horarios</h2>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-x-auto mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Día</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Programa</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activo</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{DAY_NAMES[s.day_of_week]}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {s.start_time?.slice(0, 5)} – {s.end_time?.slice(0, 5)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{s.program_name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{s.description || "—"}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-block w-2 h-2 rounded-full ${s.is_active ? "bg-green-500" : "bg-gray-300"}`} />
                </td>
                <td className="px-4 py-3 text-sm text-right space-x-3">
                  <button onClick={() => startEdit(s)} className="text-blue-600 hover:text-blue-800">Editar</button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-800">Eliminar</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-400">Sin horarios</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 space-y-4 max-w-2xl">
        <h3 className="text-lg font-semibold text-slate-800">
          {editingId ? "Editar horario" : "Nuevo horario"}
        </h3>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded border border-red-200">{error}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Programa</label>
            <select
              value={form.program_id}
              onChange={(e) => setForm({ ...form, program_id: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Seleccionar...</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Día</label>
            <select
              value={form.day_of_week}
              onChange={(e) => setForm({ ...form, day_of_week: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {DAY_NAMES.map((name, i) => (
                <option key={i} value={i}>{name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hora inicio</label>
            <input
              type="time"
              value={form.start_time}
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hora fin</label>
            <input
              type="time"
              value={form.end_time}
              onChange={(e) => setForm({ ...form, end_time: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción (opcional)</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="schedule_active"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="schedule_active" className="text-sm text-gray-700">Activo</label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            {editingId ? "Guardar cambios" : "Crear horario"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
