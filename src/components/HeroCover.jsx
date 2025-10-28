import Spline from '@splinetool/react-spline';
import { Settings } from 'lucide-react';

export default function HeroCover({ onOpenSettings }) {
  return (
    <section className="relative h-[60vh] w-full">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/zhZFnwyOYLgqlLWk/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/60 via-white/20 to-white/80" />
      <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white/70 p-6 backdrop-blur-md shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Student Management System
          </h1>
          <p className="mt-2 max-w-xl text-neutral-600">
            Modern, minimalist dashboard with Google Sheets backend. Add, edit, and track students effortlessly.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={onOpenSettings}
              className="pointer-events-auto inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-50"
            >
              <Settings size={18} /> Configure Backend
            </button>
            <span className="pointer-events-auto text-xs text-neutral-500">
              Uses interactive cubic tiles cover
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
