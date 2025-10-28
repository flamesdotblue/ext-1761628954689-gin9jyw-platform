import { useEffect, useMemo, useState } from 'react';
import { Save } from 'lucide-react';

const initialState = { name: '', email: '', grade: '', status: 'Active' };

export default function StudentForm({ initial, onSubmit }) {
  const [form, setForm] = useState(initial || initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initial || initialState);
  }, [initial]);

  const isEdit = useMemo(() => Boolean(initial?.id), [initial]);

  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = 'Name is required';
    if (!form.email?.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (form.grade !== '' && isNaN(Number(form.grade))) e.grade = 'Grade must be a number';
    if (!['Active', 'Inactive', 'Alumni'].includes(form.status)) e.status = 'Invalid status';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      grade: form.grade === '' ? '' : Number(form.grade),
      status: form.status,
    };
    onSubmit(payload);
  };

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold text-neutral-900">
        {isEdit ? 'Edit Student' : 'Add Student'}
      </h3>
      <p className="mb-4 mt-1 text-sm text-neutral-500">
        {isEdit ? 'Update the selected student details.' : 'Fill out the information to add a new student.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-neutral-400 ${errors.name ? 'border-red-400' : ''}`}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Jane Doe"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-neutral-400 ${errors.email ? 'border-red-400' : ''}`}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="jane@example.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Grade</label>
            <input
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-neutral-400 ${errors.grade ? 'border-red-400' : ''}`}
              value={form.grade}
              onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
              placeholder="e.g. 10"
            />
            {errors.grade && <p className="mt-1 text-xs text-red-500">{errors.grade}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-neutral-400 ${errors.status ? 'border-red-400' : ''}`}
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>Alumni</option>
            </select>
            {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status}</p>}
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-neutral-800"
        >
          <Save size={18} /> {isEdit ? 'Save Changes' : 'Add Student'}
        </button>
      </form>
    </div>
  );
}
