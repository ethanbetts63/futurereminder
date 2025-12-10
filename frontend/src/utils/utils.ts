import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function showErrorToast(message: string) {
  toast.error("An Error Occurred", {
    description: message,
    duration: 10000, // Show for 10 seconds
    closeButton: true,
  });
}

/**
 * Retrieves the CSRF token from the document's cookies.
 * @returns The CSRF token string, or null if not found.
 */
function getCsrfToken(): string | null {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];

  return cookieValue ? decodeURIComponent(cookieValue) : null;
}

/**
 * A wrapper around the native `fetch` function that automatically includes
 * the Django CSRF token in the headers for methods that require it.
 * @param url The URL to fetch.
 * @param options The options for the fetch request.
 * @returns A Promise that resolves to the Response.
 */
export async function csrfFetch(url: string, options: RequestInit = {}): Promise<Response> {
  options.headers = options.headers || {};
  if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(options.method || 'GET')) {
    const token = getCsrfToken();
    if (token) {
      (options.headers as Record<string, string>)['X-CSRFToken'] = token;
    } else {
      console.warn('CSRF token not found. Requests that modify data may fail.');
    }
  }
  return fetch(url, options);
}

/**
 * Formats a date string into a more readable format.
 * @param dateString The date string to format (e.g., "2024-12-31").
 * @param format The desired output format ('long' or 'YYYY-MM-DD').
 * @returns A formatted date string.
 */
export function formatDate(dateString: string | undefined, format: 'long' | 'YYYY-MM-DD' = 'long'): string {
  if (!dateString) return "No date";

  const date = new Date(dateString);
  // Add timezone offset to prevent date from shifting
  const adjustedDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);

  if (format === 'YYYY-MM-DD') {
    return adjustedDate.toISOString().split('T')[0];
  }
  
  // 'long' format
  return adjustedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
