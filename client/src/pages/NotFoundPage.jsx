import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-12 max-w-md mx-auto space-y-4 shadow-soft">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-black text-slate-900">404</h1>
      <h2 className="text-base font-bold text-slate-800">Page Not Found</h2>
      <p className="text-xs text-slate-500">
        The destination you are looking for has moved or does not exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Goals</span>
      </Link>
    </div>
  );
};
