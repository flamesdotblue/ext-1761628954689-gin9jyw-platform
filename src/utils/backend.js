const LS_KEY = 'sms.students.v1';

function readLS() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLS(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function createBackend(backendUrl) {
  const hasBackend = Boolean(backendUrl);

  // Normalize helpers for Apps Script compatibility
  const get = async (action, params = '') => {
    const url = `${backendUrl}${backendUrl.includes('?') ? '&' : '?'}action=${action}${params}`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error('Request failed');
    try { return await res.json(); } catch { return null; }
  };

  const post = async (action, body = {}, params = '') => {
    const url = `${backendUrl}${backendUrl.includes('?') ? '&' : '?'}action=${action}${params}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Request failed');
    try { return await res.json(); } catch { return null; }
  };

  return {
    async listStudents() {
      if (hasBackend) {
        const data = await get('list');
        return Array.isArray(data) ? data : [];
      }
      return readLS();
    },

    async addStudent(student) {
      if (hasBackend) {
        const created = await post('add', student);
        return created;
      }
      const list = readLS();
      const created = { id: uid(), ...student };
      writeLS([created, ...list]);
      return created;
    },

    async updateStudent(id, fields) {
      if (hasBackend) {
        const updated = await post('update', fields, `&id=${encodeURIComponent(id)}`);
        return updated;
      }
      const list = readLS();
      const updated = list.map((s) => (s.id === id ? { ...s, ...fields } : s));
      writeLS(updated);
      return updated.find((s) => s.id === id);
    },

    async deleteStudent(id) {
      if (hasBackend) {
        await post('delete', {}, `&id=${encodeURIComponent(id)}`);
        return { ok: true };
      }
      const list = readLS();
      writeLS(list.filter((s) => s.id !== id));
      return { ok: true };
    },
  };
}
