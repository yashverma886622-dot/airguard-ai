import { Component } from 'react';
import ErrorComponent from './ErrorComponent';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorComponent title="AirGuard AI hit an unexpected error" message="Refresh the page or return to the dashboard." />;
    }

    return this.props.children;
  }
}
