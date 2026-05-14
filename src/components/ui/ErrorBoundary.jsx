import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            color: "#94a3b8",
            fontSize: 13,
            padding: 32,
            backgroundColor: "#f8fafc",
          }}
        >
          <span style={{ fontSize: 32 }}>⚠️</span>
          <strong style={{ color: "#ef4444" }}>Errore nel rendering</strong>
          <p style={{ color: "#64748b", textAlign: "center", maxWidth: 320 }}>
            {this.state.error?.message || "Errore sconosciuto"}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: "6px 16px",
              borderRadius: 6,
              border: "1px solid #e2e8f0",
              backgroundColor: "#fff",
              cursor: "pointer",
              fontSize: 12,
              color: "#374151",
            }}
          >
            Riprova
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
