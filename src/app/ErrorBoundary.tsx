import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Last-resort boundary so a render error shows a recoverable screen instead of a blank page.
 * Route-level data errors are handled closer to the data by TanStack Query in Phase 3.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled render error", error, info.componentStack);
  }

  override render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="grid min-h-dvh place-items-center bg-canvas px-5">
        <div className="max-w-md rounded-card bg-surface p-8 text-center shadow-card ring-1 ring-line">
          <h1 className="font-display text-xl font-extrabold text-ink">Something broke</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            The page hit an unexpected error. Reloading usually clears it — if it keeps happening,
            the details below help us trace it.
          </p>
          <p className="mt-4 rounded-field bg-surface-2 p-3 text-left font-mono text-xs text-ink-3">
            {error.message}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 h-11 w-full rounded-field bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-hover"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
