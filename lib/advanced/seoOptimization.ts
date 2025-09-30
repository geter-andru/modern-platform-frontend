import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

// Advanced SEO optimization utilities for Next.js
interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
  schema?: Record<string, any>;
  robots?: string;
  viewport?: string;
}

interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  titleTemplate?: string;
  defaultDescription: string;
  defaultKeywords: string[];
  defaultOgImage: string;
  twitterHandle?: string;
  locale?: string;
  alternateLocales?: string[];
}

// Dynamic SEO metadata management
export function useSEO(config: SEOConfig) {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const generateMetadata = useCallback((
    metadata: Partial<SEOMetadata> = {}
  ): SEOMetadata => {
    const {
      title = config.defaultTitle,
      description = config.defaultDescription,
      keywords = config.defaultKeywords,
      canonical,
      ogTitle = title,
      ogDescription = description,
      ogImage = config.defaultOgImage,
      ogType = 'website',
      twitterCard = 'summary_large_image',
      twitterSite = config.twitterHandle,
      twitterCreator = config.twitterHandle,
      schema,
      robots = 'index, follow',
      viewport = 'width=device-width, initial-scale=1'
    } = metadata;

    const finalTitle = config.titleTemplate 
      ? config.titleTemplate.replace('%s', title)
      : title;

    const canonicalUrl = canonical || `${config.siteUrl}${currentPath}`;

    return {
      title: finalTitle,
      description,
      keywords,
      canonical: canonicalUrl,
      ogTitle: finalTitle,
      ogDescription,
      ogImage: ogImage.startsWith('http') ? ogImage : `${config.siteUrl}${ogImage}`,
      ogType,
      twitterCard,
      twitterSite,
      twitterCreator,
      schema,
      robots,
      viewport
    };
  }, [config, currentPath]);

  const updateMetadata = useCallback((metadata: Partial<SEOMetadata>) => {
    const fullMetadata = generateMetadata(metadata);

    // Update document title
    document.title = fullMetadata.title;

    // Update meta tags
    updateMetaTag('description', fullMetadata.description);
    updateMetaTag('keywords', fullMetadata.keywords?.join(', ') || '');
    updateMetaTag('robots', fullMetadata.robots || '');
    updateMetaTag('viewport', fullMetadata.viewport || '');

    // Update Open Graph tags
    updateMetaTag('og:title', fullMetadata.ogTitle || '', 'property');
    updateMetaTag('og:description', fullMetadata.ogDescription || '', 'property');
    updateMetaTag('og:image', fullMetadata.ogImage || '', 'property');
    updateMetaTag('og:type', fullMetadata.ogType || '', 'property');
    updateMetaTag('og:url', fullMetadata.canonical || '', 'property');
    updateMetaTag('og:site_name', config.siteName, 'property');

    // Update Twitter tags
    updateMetaTag('twitter:card', fullMetadata.twitterCard || '', 'name');
    updateMetaTag('twitter:site', fullMetadata.twitterSite || '', 'name');
    updateMetaTag('twitter:creator', fullMetadata.twitterCreator || '', 'name');
    updateMetaTag('twitter:title', fullMetadata.ogTitle || '', 'name');
    updateMetaTag('twitter:description', fullMetadata.ogDescription || '', 'name');
    updateMetaTag('twitter:image', fullMetadata.ogImage || '', 'name');

    // Update canonical link
    updateCanonicalLink(fullMetadata.canonical || '');

    // Update structured data
    if (fullMetadata.schema) {
      updateStructuredData(fullMetadata.schema);
    }
  }, [generateMetadata, config.siteName]);

  return {
    generateMetadata,
    updateMetadata
  };
}

// Utility functions for updating meta tags
function updateMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  if (!content) return;

  let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  
  meta.content = content;
}

function updateCanonicalLink(href: string) {
  if (!href) return;

  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  
  link.href = href;
}

function updateStructuredData(schema: Record<string, any>) {
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

// Schema.org structured data generators
export class StructuredDataGenerator {
  static organization(data: {
    name: string;
    url: string;
    logo?: string;
    description?: string;
    contactPoint?: {
      telephone: string;
      contactType: string;
      email?: string;
    };
    sameAs?: string[];
  }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: data.name,
      url: data.url,
      logo: data.logo,
      description: data.description,
      contactPoint: data.contactPoint ? {
        '@type': 'ContactPoint',
        ...data.contactPoint
      } : undefined,
      sameAs: data.sameAs
    };
  }

  static webPage(data: {
    name: string;
    description: string;
    url: string;
    image?: string;
    author?: {
      name: string;
      url?: string;
    };
    datePublished?: string;
    dateModified?: string;
  }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: data.name,
      description: data.description,
      url: data.url,
      image: data.image,
      author: data.author ? {
        '@type': 'Person',
        name: data.author.name,
        url: data.author.url
      } : undefined,
      datePublished: data.datePublished,
      dateModified: data.dateModified
    };
  }

  static article(data: {
    headline: string;
    description: string;
    url: string;
    image: string;
    datePublished: string;
    dateModified?: string;
    author: {
      name: string;
      url?: string;
    };
    publisher: {
      name: string;
      logo: string;
    };
    wordCount?: number;
    keywords?: string[];
  }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.headline,
      description: data.description,
      url: data.url,
      image: data.image,
      datePublished: data.datePublished,
      dateModified: data.dateModified || data.datePublished,
      author: {
        '@type': 'Person',
        name: data.author.name,
        url: data.author.url
      },
      publisher: {
        '@type': 'Organization',
        name: data.publisher.name,
        logo: {
          '@type': 'ImageObject',
          url: data.publisher.logo
        }
      },
      wordCount: data.wordCount,
      keywords: data.keywords
    };
  }

  static breadcrumb(items: Array<{
    name: string;
    url: string;
  }>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    };
  }

  static faq(questions: Array<{
    question: string;
    answer: string;
  }>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: questions.map(q => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.answer
        }
      }))
    };
  }
}

// SEO performance monitoring
export function useSEOAnalytics() {
  const [metrics, setMetrics] = useState({
    pageLoadTime: 0,
    timeToFirstByte: 0,
    domContentLoaded: 0,
    cumulativeLayoutShift: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Measure Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'navigation':
            const navEntry = entry as PerformanceNavigationTiming;
            setMetrics(prev => ({
              ...prev,
              pageLoadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
              timeToFirstByte: navEntry.responseStart - navEntry.requestStart,
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart
            }));
            break;
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({
                ...prev,
                firstContentfulPaint: entry.startTime
              }));
            }
            break;
          case 'largest-contentful-paint':
            setMetrics(prev => ({
              ...prev,
              largestContentfulPaint: entry.startTime
            }));
            break;
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              setMetrics(prev => ({
                ...prev,
                cumulativeLayoutShift: prev.cumulativeLayoutShift + (entry as any).value
              }));
            }
            break;
        }
      }
    });

    observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'layout-shift'] });

    return () => observer.disconnect();
  }, []);

  return metrics;
}

// Automatic sitemap generation
export function generateSitemap(routes: Array<{
  path: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}>, config: SEOConfig): string {
  const urls = routes.map(route => {
    const url = `${config.siteUrl}${route.path}`;
    const lastmod = route.lastModified ? route.lastModified.toISOString().split('T')[0] : undefined;
    
    return `
    <url>
      <loc>${url}</loc>
      ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
      ${route.changeFrequency ? `<changefreq>${route.changeFrequency}</changefreq>` : ''}
      ${route.priority ? `<priority>${route.priority}</priority>` : ''}
    </url>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;
}

// Robots.txt generation
export function generateRobots(config: {
  sitemap?: string;
  disallow?: string[];
  allow?: string[];
  crawlDelay?: number;
  userAgent?: string;
}): string {
  const { sitemap, disallow = [], allow = [], crawlDelay, userAgent = '*' } = config;

  let robots = `User-agent: ${userAgent}\n`;

  allow.forEach(path => {
    robots += `Allow: ${path}\n`;
  });

  disallow.forEach(path => {
    robots += `Disallow: ${path}\n`;
  });

  if (crawlDelay) {
    robots += `Crawl-delay: ${crawlDelay}\n`;
  }

  if (sitemap) {
    robots += `\nSitemap: ${sitemap}`;
  }

  return robots;
}