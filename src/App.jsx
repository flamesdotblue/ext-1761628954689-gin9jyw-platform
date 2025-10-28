import { useEffect, useMemo, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { PlusCircle } from 'lucide-react';
import HeroCover from './components/HeroCover';
import StudentForm from './components/StudentForm';
import StudentTable from './components/StudentTable';
import SettingsPanel from './components/SettingsPanel';
import { createBackend } from './utils/backend';

function App() {
  const [backendUrl, setBackendUrl] = useState(
    () => localStorage.getItem('sms.backendUrl') || ''
  );
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const api = useMemo(() => createBackend(backendUrl), [backendUrl]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await api.listStudents();
      setStudents(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [backendUrl]);

  const handleSubmit = async (payload) => {
    try {
      if (editing) {
        const updated = await api.updateStudent(editing.id, payload);
        setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        toast.success('Student updated');
      } else {
        const created = await api.addStudent(payload);
        setStudents((prev) => [created, ...prev]);
        toast.success('Student added');
      }
      setEditing(null);
    } catch (e) {
      console.error(e);
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    const ok = confirm('Delete this student?');
    if (!ok) return;
    try {
      await api.deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      toast.success('Student deleted');
    } catch (e) {
      console.error(e);
      toast.error('Delete failed');
    }
  };

  const filtered = students.filter((s) => {
    const q = query.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      String(s.grade || '').toLowerCase().includes(q) ||
      s.status?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <HeroCover onOpenSettings={() => setShowSettings(true)} />

      <main className="relative z-10 mx-auto -mt-24 max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-white/80 backdrop-blur shadow-sm">
          <div className="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Student Management</h2>
              <p className="text-sm text-neutral-500">
                Manage students synced with Google Sheets or use local storage.
              </p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <input
                  className="w-64 rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-0 transition placeholder:text-neutral-400 focus:border-neutral-400"
                  placeholder="Search by name, email, grade, status"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => setEditing(null)}
                className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white shadow hover:bg-neutral-800"
              >
                <PlusCircle size={18} /> Add New
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-neutral-50"
              >
                Settings
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <StudentForm
                key={editing?.id || 'new'}
                initial={editing}
                onSubmit={handleSubmit}
              />
            </div>
            <div className="lg:col-span-2">
              <StudentTable
                loading={loading}
                students={filtered}
                onEdit={setEditing}
                onDelete={handleDelete}
                onRefresh={fetchStudents}
              />
            </div>
          </div>
        </div>
      </main>

      <SettingsPanel
        open={showSettings}
        onClose={() => setShowSettings(false)}
        backendUrl={backendUrl}
        onSave={(url) => {
          localStorage.setItem('sms.backendUrl', url);
          setBackendUrl(url);
          toast.success('Settings saved');
        }}
      />

      <Toaster richColors closeButton />
    </div>
  );
}

export default App;
