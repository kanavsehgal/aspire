import { computed } from 'vue'

/**
 * Composable for handling icon paths and image assets
 * Provides utilities for converting relative paths to proper URLs
 */
export function useIconPath() {
  /**
   * Converts a relative asset path to a proper URL
   * @param path - The relative path to the asset (e.g., '../assets/icon.svg')
   * @returns The resolved URL for the asset
   */
  const resolveAssetPath = (path: string): string => {
    try {
      // Handle relative paths starting with ../assets/
      if (path.startsWith('../assets/')) {
        const assetName = path.replace('../assets/', '')
        return new URL(`../assets/${assetName}`, import.meta.url).href
      }
      // Handle absolute paths starting with /src/assets/
      if (path.startsWith('/src/assets/')) {
        const assetName = path.replace('/src/assets/', '')
        return new URL(`../assets/${assetName}`, import.meta.url).href
      }
      // Handle paths starting with @/assets/ (alias)
      if (path.startsWith('@/assets/')) {
        const assetName = path.replace('@/assets/', '')
        return new URL(`../assets/${assetName}`, import.meta.url).href
      }
      // Return the original path if it doesn't match any patterns
      return path
    } catch (error) {
      console.warn(`Failed to resolve asset path: ${path}`, error)
      return path
    }
  }

  /**
   * Computed property that returns a function to resolve asset paths
   * Useful for use in templates
   */
  const getIconLink = computed(() => {
    return (iconPath: string): string => {
      return resolveAssetPath(iconPath)
    }
  })

  /**
   * Resolves multiple asset paths at once
   * @param paths - Array of relative paths
   * @returns Array of resolved URLs
   */
  const resolveMultiplePaths = (paths: string[]): string[] => {
    return paths.map(path => resolveAssetPath(path))
  }

  /**
   * Checks if a path is a valid asset path
   * @param path - The path to check
   * @returns True if the path is a valid asset path
   */
  const isValidAssetPath = (path: string): boolean => {
    return path.includes('assets/') || path.includes('.svg') || path.includes('.png') || path.includes('.jpg')
  }

  /**
   * Gets the file extension from a path
   * @param path - The asset path
   * @returns The file extension (e.g., 'svg', 'png')
   */
  const getFileExtension = (path: string): string => {
    const match = path.match(/\.([^.]+)$/)
    return match ? match[1] : ''
  }

  /**
   * Creates a fallback path for missing assets
   * @param originalPath - The original asset path
   * @returns A fallback path or the original path
   */
  const getFallbackPath = (originalPath: string): string => {
    const extension = getFileExtension(originalPath)
    // Return a default icon based on file type
    switch (extension) {
      case 'svg':
        return new URL('../assets/default-icon.svg', import.meta.url).href
      case 'png':
      case 'jpg':
      case 'jpeg':
        return new URL('../assets/default-image.png', import.meta.url).href
      default:
        return originalPath
    }
  }

  return {
    resolveAssetPath,
    getIconLink,
    resolveMultiplePaths,
    isValidAssetPath,
    getFileExtension,
    getFallbackPath
  }
} 