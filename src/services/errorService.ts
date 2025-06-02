
import { toast } from '@/hooks/use-toast';

export interface ErrorContext {
  component?: string;
  operation?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export class ErrorService {
  static logError(error: Error, context?: ErrorContext) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...context
    };

    console.error('Application Error:', errorData);

    // In production, send to external logging service
    if (process.env.NODE_ENV === 'production') {
      // Example: sendToLoggingService(errorData);
    }
  }

  static handleApiError(error: any, context?: ErrorContext): never {
    this.logError(error, context);
    
    let userMessage = 'An unexpected error occurred. Please try again.';
    
    // Customize messages based on error type
    if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
      userMessage = 'Network error. Please check your connection and try again.';
    } else if (error?.status === 429) {
      userMessage = 'Too many requests. Please wait a moment and try again.';
    } else if (error?.status >= 500) {
      userMessage = 'Server error. Please try again later.';
    } else if (error?.message?.includes('duplicate') || error?.message?.includes('unique')) {
      userMessage = 'This record already exists.';
    }

    toast({
      title: "Error",
      description: userMessage,
      variant: "destructive",
    });

    throw error;
  }

  static handleAsyncError(error: any, context?: ErrorContext) {
    this.logError(error, context);
    
    let userMessage = 'Something went wrong. Please try again.';
    
    if (error?.message?.includes('network')) {
      userMessage = 'Connection error. Please check your internet and try again.';
    }

    toast({
      title: "Error",
      description: userMessage,
      variant: "destructive",
    });
  }
}
