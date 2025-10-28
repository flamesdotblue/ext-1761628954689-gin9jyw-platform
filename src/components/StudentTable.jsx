import { Edit, RefreshCw, Trash2 } from 'lucide-react';

export default function StudentTable({ loading, students, onEdit, onDelete, onRefresh }) {
  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="text-base font-semibold">Students</h3>
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-neutral-50"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y">
          <thead className="bg-neutral-50">
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Grade</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-neutral-500">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && students.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-neutral-500">
                  No students found
                </td>
              </tr>
            )}
            {!loading && students.map((s) => (
              <tr key={s.id} className="hover:bg-neutral-50/60">
                <Td>{s.name}</Td>
                <Td>{s.email}</Td>
                <Td>{s.grade}</Td>
                <Td>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                      s.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : s.status === 'Alumni'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {s.status}
                  </span>
                </Td>
                <Td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(s)}
                      className="rounded-lg border px-2.5 py-1.5 text-xs hover:bg-neutral-50"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(s.id)}
                      className="rounded-lg border px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, className = '' }) {
  return (
    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = '' }) {
  return <td className={`whitespace-nowrap px-4 py-3 text-sm ${className}`}>{children}</td>;
}
