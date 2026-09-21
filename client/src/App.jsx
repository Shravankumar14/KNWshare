import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// InfoNest is the PRIMARY shell — loads at root /
import NestRouter from './features/infonest/NestRouter';

// KNWshare is the sub-section — lazy loaded under /knwshare/*
const KNWShareRouter = lazy(() => import('./KNWShareRouter'));

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── KNWshare as sub-section at /knwshare/* ── */}
        <Route
          path="/knwshare/*"
          element={
            <Suspense
              fallback={
                <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ color: '#0c87eb', fontSize: '1.1rem', fontFamily: 'Inter, sans-serif' }}>
                    Loading KNWshare...
                  </div>
                </div>
              }
            >
              <KNWShareRouter />
            </Suspense>
          }
        />

        {/* ── InfoNest is the PRIMARY app — catches everything else ── */}
        <Route path="/*" element={<NestRouter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
