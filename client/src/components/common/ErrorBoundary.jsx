import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('KNWshare ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
          <div className="knw-card max-w-md w-full rounded-3xl p-8 border border-knw-red/40 shadow-red-lg space-y-5 bg-[#0d0000]">
            <div className="w-14 h-14 rounded-2xl bg-knw-red/20 border border-knw-red/40 flex items-center justify-center text-knw-red mx-auto shadow-red">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">Something went wrong</h2>
              <p className="text-xs text-gray-300 leading-relaxed">
                An unexpected interface error occurred. You can refresh the view or return to the home page.
              </p>
              {this.state.error?.message && (
                <div className="p-3 bg-black/60 rounded-xl border border-white/10 text-[11px] font-mono text-red-400 text-left overflow-x-auto">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="btn-red px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-red font-mono"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-5 py-2.5 rounded-xl text-xs font-bold border border-white/20 text-white hover:bg-white/5 transition-all flex items-center gap-2 font-mono"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
