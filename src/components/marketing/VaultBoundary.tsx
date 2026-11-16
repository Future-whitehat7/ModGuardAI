import { Component, type ReactNode } from 'react';

interface VaultBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface VaultBoundaryState {
  failed: boolean;
}

export class VaultBoundary extends Component<VaultBoundaryProps, VaultBoundaryState> {
  state: VaultBoundaryState = { failed: false };

  static getDerivedStateFromError(): VaultBoundaryState {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}
