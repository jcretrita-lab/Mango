import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary] Uncaught render error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-5 rounded-[32px] border border-dashed border-rose-200 bg-white p-10 text-center shadow-sm">
          <div className="rounded-full bg-rose-50 p-5 text-rose-600">
            <AlertTriangle size={32} />
          </div>
          <div className="space-y-2">
            <div className="text-xl font-bold text-slate-900">
              Something went wrong
            </div>
            <div className="max-w-lg text-sm leading-6 text-slate-500">
              {this.state.error?.message ?? 'An unexpected error occurred while rendering this page.'}
            </div>
          </div>
          <button
            onClick={this.handleReset}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
