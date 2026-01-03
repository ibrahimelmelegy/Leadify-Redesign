import { ElNotification } from "element-plus";

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  field?: string;
}

const errorMessages: Record<string, string> = {
  'NETWORK_ERROR': 'Unable to connect to the server. Please check your internet connection.',
  'UNAUTHORIZED': 'Your session has expired. Please log in again.',
  'FORBIDDEN': 'You do not have permission to perform this action.',
  'NOT_FOUND': 'The requested resource was not found.',
  'VALIDATION_ERROR': 'Please check your input and try again.',
  'SERVER_ERROR': 'Something went wrong. Please try again later.',
  'RATE_LIMITED': 'Too many requests. Please wait a moment and try again.',
  'DUPLICATE_EMAIL': 'This email is already in use.',
  'INVALID_CREDENTIALS': 'Invalid email or password.',
  'PASSWORD_MISMATCH': 'Passwords do not match.',
  'WEAK_PASSWORD': 'Password must be at least 8 characters long.',
};

export function useErrorHandler() {
  
  function getErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return errorMessages[error] || error;
    }
    
    if (error?.message) {
      return errorMessages[error.message] || error.message;
    }
    
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    
    return 'An unexpected error occurred. Please try again.';
  }

  function showError(error: any, title: string = 'Error') {
    const message = getErrorMessage(error);
    ElNotification({
      title,
      message,
      type: 'error',
      duration: 5000,
    });
  }

  function showSuccess(message: string, title: string = 'Success') {
    ElNotification({
      title,
      message,
      type: 'success',
      duration: 3000,
    });
  }

  function showWarning(message: string, title: string = 'Warning') {
    ElNotification({
      title,
      message,
      type: 'warning',
      duration: 4000,
    });
  }

  function showInfo(message: string, title: string = 'Info') {
    ElNotification({
      title,
      message,
      type: 'info',
      duration: 3000,
    });
  }

  async function handleAsync<T>(
    promise: Promise<T>,
    options?: {
      successMessage?: string;
      errorTitle?: string;
      showSuccessNotification?: boolean;
    }
  ): Promise<{ data: T | null; error: any }> {
    try {
      const data = await promise;
      if (options?.showSuccessNotification && options?.successMessage) {
        showSuccess(options.successMessage);
      }
      return { data, error: null };
    } catch (error) {
      showError(error, options?.errorTitle);
      return { data: null, error };
    }
  }

  return {
    getErrorMessage,
    showError,
    showSuccess,
    showWarning,
    showInfo,
    handleAsync,
  };
}
