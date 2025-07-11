import { useEffect, useState } from 'react';
import { Medication } from '@/types';
import medicationService from '@/services/medicationService';

export default function MedicationList() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Medication>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchMedications = async () => {
    setLoading(true);
    setError(null);
    try {
      const meds = await medicationService.getMedications();
      setMedications(meds);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await medicationService.updateMedication(editingId, form);
      } else {
        await medicationService.createMedication(form);
      }
      setForm({});
      setEditingId(null);
      fetchMedications();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEdit = (med: Medication) => {
    setForm(med);
    setEditingId(med.id);
  };

  const handleDelete = async (id: string) => {
    try {
      await medicationService.deleteMedication(id);
      fetchMedications();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Medications</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          className="border rounded px-2 py-1 w-full"
          name="name"
          placeholder="Name"
          value={form.name || ''}
          onChange={handleChange}
          required
        />
        <input
          className="border rounded px-2 py-1 w-full"
          name="dosage"
          placeholder="Dosage"
          value={form.dosage || ''}
          onChange={handleChange}
          required
        />
        <input
          className="border rounded px-2 py-1 w-full"
          name="frequency"
          placeholder="Frequency"
          value={form.frequency || ''}
          onChange={handleChange}
          required
        />
        <input
          className="border rounded px-2 py-1 w-full"
          name="startDate"
          type="date"
          placeholder="Start Date"
          value={form.startDate || ''}
          onChange={handleChange}
          required
        />
        <input
          className="border rounded px-2 py-1 w-full"
          name="endDate"
          type="date"
          placeholder="End Date"
          value={form.endDate || ''}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          {editingId ? 'Update' : 'Add'} Medication
        </button>
        {editingId && (
          <button
            type="button"
            className="ml-2 px-4 py-2 rounded border"
            onClick={() => { setForm({}); setEditingId(null); }}
          >
            Cancel
          </button>
        )}
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="space-y-2">
          {medications.map((med) => (
            <li key={med.id} className="border rounded p-2 flex justify-between items-center">
              <div>
                <div className="font-semibold">{med.name}</div>
                <div className="text-sm text-gray-600">{med.dosage} &bull; {med.frequency}</div>
                <div className="text-xs text-gray-500">
                  {med.startDate} {med.endDate ? `- ${med.endDate}` : ''}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => handleEdit(med)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => handleDelete(med.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 