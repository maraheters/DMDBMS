import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Prepends the base URL to a URL path if it doesn't already have a protocol.
 * Uses NEXT_PUBLIC_API_BASE_URL environment variable, falling back to http://localhost:9000
 * @param urlPath - The URL path to prepend the base URL to
 * @returns The full URL with the base URL prepended, or the original URL if it already has a protocol
 */
export function getImageUrl(urlPath: string | null | undefined): string {
  if (!urlPath) {
    return '/placeholder-car.jpg'
  }
  
  // If the URL already has a protocol (http:// or https://), return it as is
  if (urlPath.startsWith('http://') || urlPath.startsWith('https://')) {
    return urlPath
  }
  
  // Get base URL from environment variable or use default
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9000'
  // Remove trailing slash from base URL if present
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  // Remove leading slash from path if present to avoid double slashes
  const cleanPath = urlPath.startsWith('/') ? urlPath.slice(1) : urlPath
  
  return `${cleanBaseUrl}/${cleanPath}`
}
