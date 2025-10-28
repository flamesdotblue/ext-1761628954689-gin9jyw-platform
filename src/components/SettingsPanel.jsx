import { useEffect, useState } from 'react';

export default function SettingsPanel({ open, onClose, backendUrl, onSave }) {
  const [url, setUrl] = useState(backendUrl || '');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setUrl(backendUrl || '');
  }, [backendUrl, open]);

  const handleTest = async () => {
    setTesting(true);
    setResult(null);
    try {
      const res = await fetch(`${url}${url.includes('?') ? '&' : '?'}action=ping`);
      const ok = res.ok;
      let data = null;
      try { data = await res.json(); } catch {}
      setResult({ ok, data });
    } catch (e) {
      setResult({ ok: false, data: null });
    } finally {
      setTesting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-2xl border bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold">Settings</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Connect to your Google Apps Script Web App that bridges to Google Sheets. If left empty, the app stores data in your browser.
        </p>

        <div className="mt-4 space-y-3">
          <label className="block text-sm font-medium">Backend URL</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/AKfycb.../exec"
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={handleTest}
              disabled={!url || testing}
              className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50 hover:bg-neutral-50"
            >
              {testing ? 'Testing…' : 'Test Connection'}
            </button>
            <button
              onClick={() => {
                onSave(url.trim());
                onClose();
              }}
              className="rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Save
            </button>
            <button
              onClick={() => {
                setUrl('');
                onSave('');
                onClose();
              }}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50"
            >
              Use Local Only
            </button>
          </div>

          {result && (
            <div className={`rounded-lg border p-3 text-sm ${result.ok ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
              {result.ok ? 'Connection OK' : 'Connection Failed'}
            </div>
          )}
        </div>

        <div className="mt-6 rounded-lg bg-neutral-50 p-4 text-sm text-neutral-700">
          <p className="font-medium">Apps Script Backend Reference</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Deploy a Web App in Google Apps Script with access to your Sheet.</li>
            <li>Implement actions: ping, list, add, update, delete.</li>
            <li>Return JSON with appropriate CORS headers.</li>
          </ol>
          <p className="mt-2 text-[12px] leading-relaxed text-neutral-600">
            Expected REST-like interface:<br/>
            GET {`?action=list`} → array of students<br/>
            GET {`?action=ping`} → {`{ ok: true }`}<br/>
            POST {`?action=add`} body: {`{ name, email, grade, status }`} → created student with id<br/>
            POST {`?action=update&id=STUDENT_ID`} body: fields to update → updated student<br/>
            POST {`?action=delete&id=STUDENT_ID`} → {`{ ok: true }`}
          </p>
        </div>

        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50">Close</button>
        </div>
      </div>
    </div>
  );
}
