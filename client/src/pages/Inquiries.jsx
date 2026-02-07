// ---------------------------------------------------------------------------
// Admin page: Inquiries
// ---------------------------------------------------------------------------
import { useState, useEffect } from "react";
import api from "../api";

const STATUSES = ["new", "contacted", "enrolled", "closed"];
const STATUS_COLORS = {
  new: "bg-yellow-100 text-yellow-800",
  contacted: "bg-blue-100 text-blue-800",
  enrolled: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
};

const EMPTY = { full_name: "", phone: "", email: "", message: "", source: "whatsapp" };

export default function Inquiries() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ...EMPTY });
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState("new");
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => { fetchItems(); }, [filterStatus]);

  async function fetchItems() {
    try {
      const url = filterStatus
        ? `/api/inquiries?status=${filterStatus}`
        : "/api/inquiries";
      setItems(await api.get(url));
    } catch (err) { console.error(err); }
  }

  function resetForm() { setForm({ ...EMPTY }); setEditingId(null); setEditStatus("new"); setError(null); }

  function startEdit(item) {
    setForm({
      full_name: item.full_name,
      phone: item.phone || "",
      email: item.email || "",
      message: item.message || "",
      source: item.source,
    });
    setEditStatus(item.status);
    setEditingId(item.id);
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const payload = {
      ...form,
      phone: form.phone || null,
      email: form.email || null,
      message: form.message || null,
      status: editStatus,
    };
    try {
      if (editingId) {
        await api.put(`/api/inquiries/${editingId}`, payload);
      } else {
        await api.post("/api/inquiries", payload);
      }
      resetForm();
      fetchItems();
    } catch (err) { setError(err.message); }
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar esta consulta?")) return;
    try {
      await api.del(`/api/inquiries/${id}`);
      if (editingId === id) resetForm();
      fetchItems();
    } catch (err) { setError(err.message); }
  }

  async function quickStatus(id, status) {
    try {
      await api.put(`/api/inquiries/${id}`, { status });
      fetchItems();
    } catch (err) { setError(err.message); }
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleString("es-GT", { dateStyle: "medium", timeStyle: "short" });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">Consultas</h2>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Todos</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-lg border overflow-x-auto mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fuente</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((inq) => (
              <tr key={inq.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500">{formatDate(inq.created_at)}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{inq.full_name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{inq.phone || "—"}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{inq.source}</td>
                <td className="px-4 py-3 text-sm">
                  <select
                    value={inq.status}
                    onChange={(e) => quickStatus(inq.id, e.target.value)}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${STATUS_COLORS[inq.status] || ""}`}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-sm text-right space-x-3">
                  <button onClick={() => startEdit(inq)} className="text-blue-600 hover:text-blue-800">Editar</button>
                  <button onClick={() => handleDelete(inq.id)} className="text-red-600 hover:text-red-800">Eliminar</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-400">Sin consultas</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 space-y-4 max-w-2xl">
        <h3 className="text-lg font-semibold text-slate-800">
          {editingId ? "Editar consulta" : "Nueva consulta"}
        </h3>
        {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded border border-red-200">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fuente</label>
            <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
              <option value="whatsapp">whatsapp</option>
              <option value="contact_form">contact_form</option>
            </select>
          </div>
          {editingId && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mensaje</label>
          <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
            {editingId ? "Guardar cambios" : "Crear consulta"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">Cancelar</button>
          )}
        </div>
      </form>
    </div>
  );
}
