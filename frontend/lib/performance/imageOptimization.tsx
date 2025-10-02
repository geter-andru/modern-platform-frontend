import React, { useState, useEffect, useCallback, useRef } from 'react';

// Advanced image optimization utilities
interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  sizes?: string;
  priority?: boolean;
  lazy?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

interface OptimizedImageProps extends ImageOptimizationOptions {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

// Advanced image loading hook with intersection observer
export function useAdvancedImageLoading(
  src: string,
  options: { threshold?: number; rootMargin?: string; eager?: boolean } = {}
) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(options.eager || false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (options.eager || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          if (observerRef.current && imgRef.current) {
            observerRef.current.unobserve(imgRef.current);
          }
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '50px'
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [options.threshold, options.rootMargin, options.eager]);

  // Image loading
  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.onload = () => {
      setIsLoaded(true);
      setHasError(false);
    };
    img.onerror = () => {
      setHasError(true);
      setIsLoaded(false);
    };
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, isInView]);

  return {
    imgRef,
    isLoaded,
    hasError,
    isInView,
    shouldLoad: isInView
  };
}

// Image optimization utilities
export class ImageOptimizer {
  static generateSrcSet(src: string, widths: number[]): string {
    return widths
      .map(width => `${this.optimizeUrl(src, { width })} ${width}w`)
      .join(', ');
  }

  static optimizeUrl(src: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  }): string {
    // In a real implementation, this would integrate with a CDN like Cloudinary or ImageKit
    const params = new URLSearchParams();
    
    if (options.width) params.set('w', options.width.toString());
    if (options.height) params.set('h', options.height.toString());
    if (options.quality) params.set('q', options.quality.toString());
    if (options.format) params.set('f', options.format);

    const hasParams = params.toString();
    return hasParams ? `${src}?${params.toString()}` : src;
  }

  static generateBlurDataURL(src: string): string {
    // Generate a low-quality placeholder
    return this.optimizeUrl(src, { width: 10, quality: 10 });
  }

  static getSizes(breakpoints: Array<{ breakpoint: string; size: string }>): string {
    return breakpoints
      .map(({ breakpoint, size }) => `${breakpoint} ${size}`)
      .join(', ');
  }

  static detectWebPSupport(): Promise<boolean> {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  static async getOptimalFormat(): Promise<'webp' | 'jpeg'> {
    const supportsWebP = await this.detectWebPSupport();
    return supportsWebP ? 'webp' : 'jpeg';
  }
}

// Advanced OptimizedImage component
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  quality = 80,
  format,
  sizes,
  priority = false,
  lazy = true,
  placeholder = 'blur',
  blurDataURL,
  className,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps): React.JSX.Element {
  const [optimalFormat, setOptimalFormat] = useState<string>(format || 'jpeg');
  const [isClient, setIsClient] = useState(false);
  
  const { imgRef, isLoaded, hasError, shouldLoad } = useAdvancedImageLoading(src, {
    eager: priority || !lazy
  });

  // Detect optimal format on client side
  useEffect(() => {
    setIsClient(true);
    if (!format) {
      ImageOptimizer.getOptimalFormat().then(setOptimalFormat);
    }
  }, [format]);

  // Generate optimized URLs
  const optimizedSrc = ImageOptimizer.optimizeUrl(src, {
    width,
    height,
    quality,
    format: optimalFormat
  });

  const srcSet = width ? ImageOptimizer.generateSrcSet(src, [
    Math.floor(width * 0.5),
    width,
    Math.floor(width * 1.5),
    Math.floor(width * 2)
  ]) : undefined;

  const placeholderSrc = blurDataURL || (placeholder === 'blur' ? ImageOptimizer.generateBlurDataURL(src) : undefined);

  const handleLoad = useCallback(() => {
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const error = new Error(`Failed to load image: ${src}`);
    onError?.(error);
  }, [onError, src]);

  // Server-side rendering placeholder
  if (!isClient) {
    return (
      <div
        className={`bg-gray-200 animate-pulse ${className || ''}`}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      />
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Blur placeholder */}
      {placeholder === 'blur' && placeholderSrc && !isLoaded && (
        <img
          src={placeholderSrc}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover filter blur-sm transition-opacity duration-300 ${isLoaded ? 'opacity-0' : 'opacity-100'} ${className || ''}`}
          style={{ width, height }}
        />
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={shouldLoad ? optimizedSrc : undefined}
        srcSet={shouldLoad && srcSet ? srcSet : undefined}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className || ''}`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />

      {/* Error fallback */}
      {hasError && (
        <div
          className={`flex items-center justify-center bg-gray-100 text-gray-500 text-sm ${className || ''}`}
          style={{ width, height }}
        >
          <span>Failed to load image</span>
        </div>
      )}
    </div>
  );
}

// Progressive image loading component
export function ProgressiveImage({
  lowQualitySrc,
  highQualitySrc,
  alt,
  className,
  ...props
}: {
  lowQualitySrc: string;
  highQualitySrc: string;
  alt: string;
  className?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>): React.JSX.Element {
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsHighQualityLoaded(true);
    img.src = highQualitySrc;

    return () => {
      img.onload = null;
    };
  }, [highQualitySrc]);

  return (
    <div className="relative overflow-hidden">
      {/* Low quality image */}
      <img
        src={lowQualitySrc}
        alt={alt}
        className={`transition-opacity duration-500 ${isHighQualityLoaded ? 'opacity-0' : 'opacity-100'} ${className || ''}`}
        {...props}
      />

      {/* High quality image */}
      {isHighQualityLoaded && (
        <img
          src={highQualitySrc}
          alt={alt}
          className={`absolute inset-0 transition-opacity duration-500 opacity-100 ${className || ''}`}
          {...props}
        />
      )}
    </div>
  );
}