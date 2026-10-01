// mostly code from reactjs.org/docs/error-boundaries.html
import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Link } from "@tanstack/react-router";

class ErrorBoundary extends Component<{ children: ReactNode }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-100 text-center">
          <h2>Uh oh!</h2>
          <p>
            There was an error with this listing.{" "}
            <Link to="/" className="text-primary underline hover:no-underline">
              Click here
            </Link>{" "}
            to back to the home page.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
