import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Sukoon ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          dir="rtl"
          className="fixed inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-6 text-center select-none"
        >
          <div className="max-w-md w-full flex flex-col items-center gap-6 p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <span className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_15px_#34d399]" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-arabic font-normal tracking-wide text-emerald-300">
                سُكُون
              </h1>
              <p className="text-sm font-sans tracking-widest text-slate-400 uppercase">
                SUKOON
              </p>
            </div>

            <div className="space-y-2 text-slate-300">
              <p className="text-lg font-arabic font-normal leading-relaxed">
                حدث خطأ غير متوقع أثناء تحميل التجربة الروحية.
              </p>
              <p className="text-xs text-slate-500 font-sans">
                An unexpected error occurred while loading the experience.
              </p>
            </div>

            <button
              onClick={this.handleReload}
              className="mt-2 px-8 py-3 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-sm font-medium transition cursor-pointer"
            >
              إعادة المحاولة / Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
