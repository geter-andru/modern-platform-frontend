'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Heart, Shield, Mail, Phone, MapPin } from 'lucide-react';

/**
 * FooterLayout - Enterprise-grade footer component system
 * 
 * Features:
 * - Multiple footer variants (minimal, standard, comprehensive)
 * - Responsive design with mobile optimization
 * - Social links and contact information
 * - Legal and compliance sections
 * - Brand and copyright information
 * - Newsletter subscription
 * - Multi-column layouts
 * - Accessibility compliance
 * - Custom styling support
 */

export type FooterVariant = 'minimal' | 'standard' | 'comprehensive';
export type FooterTheme = 'dark' | 'light' | 'gradient';

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
  icon?: React.ReactNode;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  platform: string;
  href: string;
  icon: React.ReactNode;
}

export interface ContactInfo {
  type: 'email' | 'phone' | 'address';
  label: string;
  value: string;
  href?: string;
}

export interface FooterLayoutProps {
  variant?: FooterVariant;
  theme?: FooterTheme;
  brandName?: string;
  brandLogo?: React.ReactNode;
  tagline?: string;
  sections?: FooterSection[];
  socialLinks?: SocialLink[];
  contactInfo?: ContactInfo[];
  showNewsletter?: boolean;
  newsletterTitle?: string;
  newsletterDescription?: string;
  onNewsletterSubmit?: (email: string) => void;
  copyrightText?: string;
  legalLinks?: FooterLink[];
  className?: string;
  showBackToTop?: boolean;
  customContent?: React.ReactNode;
}

const FooterLayout: React.FC<FooterLayoutProps> = ({
  variant = 'standard',
  theme = 'dark',
  brandName = 'H&S Revenue Intelligence',
  brandLogo,
  tagline = 'Transforming Revenue Operations with AI-Powered Intelligence',
  sections = [],
  socialLinks = [],
  contactInfo = [],
  showNewsletter = false,
  newsletterTitle = 'Stay Updated',
  newsletterDescription = 'Get the latest insights and updates delivered to your inbox.',
  onNewsletterSubmit,
  copyrightText,
  legalLinks = [],
  className = '',
  showBackToTop = true,
  customContent
}) => {
  const [email, setEmail] = React.useState('');
  const [newsletterStatus, setNewsletterStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Default sections
  const defaultSections: FooterSection[] = [
    {
      title: 'Product',
      links: [
        { label: 'ICP Analysis', href: '/icp' },
        { label: 'Cost Calculator', href: '/calculator' },
        { label: 'Business Case Builder', href: '/business-case' },
        { label: 'Analytics Dashboard', href: '/dashboard' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/docs' },
        { label: 'API Reference', href: '/api', external: true },
        { label: 'Help Center', href: '/help' },
        { label: 'Blog', href: '/blog' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
        { label: 'Partners', href: '/partners' }
      ]
    }
  ];

  const finalSections = sections.length > 0 ? sections : defaultSections;

  // Default legal links
  const defaultLegalLinks: FooterLink[] = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' }
  ];

  const finalLegalLinks = legalLinks.length > 0 ? legalLinks : defaultLegalLinks;

  // Handle newsletter submission
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !onNewsletterSubmit) return;

    setNewsletterStatus('loading');
    try {
      await onNewsletterSubmit(email);
      setNewsletterStatus('success');
      setEmail('');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    } catch (error) {
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Theme configurations
  const themeClasses = {
    dark: 'bg-gray-900 text-gray-300 border-gray-800',
    light: 'bg-gray-50 text-gray-600 border-gray-200',
    gradient: 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 border-gray-700'
  };

  const linkHoverClasses = {
    dark: 'hover:text-white',
    light: 'hover:text-gray-900',
    gradient: 'hover:text-white'
  };

  // Build footer classes
  const footerClasses = `
    ${themeClasses[theme]}
    border-t
    ${className}
  `.trim();

  // Contact info icons
  const getContactIcon = (type: ContactInfo['type']) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'address': return <MapPin className="w-4 h-4" />;
      default: return null;
    }
  };

  // Minimal footer variant
  if (variant === 'minimal') {
    return (
      <footer className={footerClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Brand */}
            <div className="flex items-center space-x-3">
              {brandLogo}
              <span className="text-lg font-semibold text-white">{brandName}</span>
            </div>

            {/* Copyright and legal */}
            <div className="flex items-center space-x-6 text-sm">
              <span>{copyrightText || `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`}</span>
              {finalLegalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={`transition-colors ${linkHoverClasses[theme]}`}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Standard and comprehensive footer variants
  return (
    <footer className={footerClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className={`py-12 ${variant === 'comprehensive' ? 'lg:py-16' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {/* Brand section */}
            <div className={`${variant === 'comprehensive' ? 'xl:col-span-2' : 'lg:col-span-1'}`}>
              <div className="flex items-center space-x-3 mb-4">
                {brandLogo}
                <span className="text-xl font-bold text-white">{brandName}</span>
              </div>
              
              {tagline && (
                <p className="text-gray-400 mb-6 max-w-xs">{tagline}</p>
              )}

              {/* Contact information */}
              {variant === 'comprehensive' && contactInfo.length > 0 && (
                <div className="space-y-3 mb-6">
                  {contactInfo.map((contact, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm">
                      {getContactIcon(contact.type)}
                      {contact.href ? (
                        <a
                          href={contact.href}
                          className={`transition-colors ${linkHoverClasses[theme]}`}
                        >
                          {contact.value}
                        </a>
                      ) : (
                        <span>{contact.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Social links */}
              {socialLinks.length > 0 && (
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      className={`p-2 rounded-lg bg-gray-800 transition-colors hover:bg-gray-700 ${linkHoverClasses[theme]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title={social.platform}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation sections */}
            {finalSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className={`text-sm transition-colors ${linkHoverClasses[theme]} flex items-center space-x-2`}
                        {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        <span>{link.label}</span>
                        {link.external && <ExternalLink className="w-3 h-3" />}
                        {link.icon}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter signup */}
            {showNewsletter && (
              <div className={variant === 'comprehensive' ? 'xl:col-span-1' : ''}>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  {newsletterTitle}
                </h3>
                {newsletterDescription && (
                  <p className="text-sm text-gray-400 mb-4">{newsletterDescription}</p>
                )}
                
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    disabled={newsletterStatus === 'loading'}
                    className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                  >
                    {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                  </button>
                  
                  {newsletterStatus === 'success' && (
                    <p className="text-sm text-green-400">Successfully subscribed!</p>
                  )}
                  
                  {newsletterStatus === 'error' && (
                    <p className="text-sm text-red-400">Subscription failed. Please try again.</p>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Custom content section */}
        {customContent && (
          <div className="py-8 border-t border-gray-800">
            {customContent}
          </div>
        )}

        {/* Bottom section */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm">
              <span>{copyrightText || `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`}</span>
              <span className="flex items-center space-x-1 text-gray-500">
                <span>Made with</span>
                <Heart className="w-3 h-3 text-red-500" />
                <span>by H&S Team</span>
              </span>
            </div>

            {/* Legal links */}
            <div className="flex items-center space-x-6">
              {finalLegalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={`text-sm transition-colors ${linkHoverClasses[theme]} flex items-center space-x-1`}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {link.icon && <span className="w-4 h-4">{link.icon}</span>}
                  <span>{link.label}</span>
                </a>
              ))}
              
              {/* Security badge */}
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Shield className="w-4 h-4" />
                <span>Secure</span>
              </div>

              {/* Back to top */}
              {showBackToTop && (
                <button
                  onClick={scrollToTop}
                  className={`text-sm transition-colors ${linkHoverClasses[theme]} hover:translate-y-[-2px] transform transition-transform`}
                >
                  Back to top ↑
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Simplified footer for specific use cases
export interface SimpleFooterProps {
  brandName?: string;
  year?: number;
  links?: FooterLink[];
  className?: string;
}

export const SimpleFooter: React.FC<SimpleFooterProps> = ({
  brandName = 'H&S Revenue Intelligence',
  year = new Date().getFullYear(),
  links = [],
  className = ''
}) => {
  return (
    <footer className={`bg-gray-900 border-t border-gray-800 py-6 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
          <p className="text-sm text-gray-400">
            © {year} {brandName}. All rights reserved.
          </p>
          {links.length > 0 && (
            <div className="flex items-center space-x-4">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default FooterLayout;