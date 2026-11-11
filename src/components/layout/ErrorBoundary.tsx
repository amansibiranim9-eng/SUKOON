import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Sukoon App Error Boundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#030712] text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="w-16 h-16 rounded-full bg-[#2563eb]/20 border border-[#38bdf8]/40 flex items-center justify-center mb-6 shadow-[0_0_35px_rgba(37,99,235,0.4)]">
            <span className="text-2xl text-[#38bdf8]">✦</span>
          </div>

          <h1 className="text-3xl font-arabic font-bold text-white mb-2">
            شُكُون الروحي
          </h1>
          <p className="text-sm text-[#38bdf8] mb-6 font-medium">
            حدث خطأ غير متوقع في تجربة الذكر
          </p>

          <p className="max-w-md text-xs text-white/50 mb-8 leading-relaxed font-mono">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-full bg-[#2563eb] hover:bg-[#38bdf8] hover:text-[#030712] text-white font-medium text-sm transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            إعادة تحميل التجربة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
