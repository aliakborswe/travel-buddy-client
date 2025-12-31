"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
          <Card className='max-w-2xl w-full'>
            <CardHeader>
              <div className='flex items-center gap-3 mb-2'>
                <div className='rounded-full bg-red-100 p-3'>
                  <AlertTriangle className='h-6 w-6 text-red-600' />
                </div>
                <div>
                  <CardTitle className='text-2xl'>
                    Oops! Something went wrong
                  </CardTitle>
                  <CardDescription>
                    We encountered an unexpected error
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                <p className='font-medium text-red-900 mb-2'>Error Details:</p>
                <p className='text-sm text-red-800 font-mono'>
                  {this.state.error?.message || "Unknown error occurred"}
                </p>
              </div>

              {process.env.NODE_ENV === "development" &&
                this.state.errorInfo && (
                  <details className='bg-gray-100 border border-gray-300 rounded-lg p-4'>
                    <summary className='cursor-pointer font-medium text-gray-700 mb-2'>
                      Stack Trace (Development Only)
                    </summary>
                    <pre className='text-xs text-gray-600 overflow-auto max-h-64'>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}

              <div className='flex flex-col sm:flex-row gap-3 pt-4'>
                <Button onClick={this.handleReset} className='flex-1' size='lg'>
                  <RefreshCw className='mr-2 h-4 w-4' />
                  Try Again
                </Button>
                <Button variant='outline' className='flex-1' size='lg' asChild>
                  <Link href='/'>
                    <Home className='mr-2 h-4 w-4' />
                    Go Home
                  </Link>
                </Button>
              </div>

              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm'>
                <p className='text-blue-900'>
                  <strong>Need help?</strong> If this problem persists, please
                  contact our support team at{" "}
                  <a
                    href='mailto:support@travelbuddy.com'
                    className='underline'
                  >
                    support@travelbuddy.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional error boundary hook for use with error boundaries
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return setError;
}
