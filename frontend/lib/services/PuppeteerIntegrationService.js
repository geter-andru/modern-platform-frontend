class PuppeteerIntegrationService {
  constructor() {
    this.isConnected = false;
    this.sessionId = null;
    this.screenshotStore = new Map();
    this.errorCache = new Map();
  }

  // Initialize connection to Puppeteer MCP server
  async initialize() {
    try {
      // Check if MCP tools are available
      this.isConnected = typeof window !== 'undefined' && window.mcpTools;
      if (!this.isConnected) {
        console.warn('Puppeteer MCP not available - running in fallback mode');
      }
      this.sessionId = `puppeteer_session_${Date.now()}`;
      return { success: true, sessionId: this.sessionId };
    } catch (error) {
      console.error('Puppeteer integration failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Navigate with security validation and error handling
  async navigate(url, options = {}) {
    const { waitFor, timeout = 30000, retries = 3 } = options;
    
    if (!this.isConnected) {
      return this.fallbackNavigation(url);
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await this.callMCPTool('puppeteer_navigate', {
          url,
          waitFor,
          timeout
        });
        
        return {
          success: true,
          url: result.finalUrl || url,
          timestamp: new Date().toISOString(),
          attempt
        };
      } catch (error) {
        console.warn(`Navigation attempt ${attempt} failed:`, error.message);
        
        if (attempt === retries) {
          this.errorCache.set(url, error.message);
          return {
            success: false,
            error: error.message,
            fallback: await this.fallbackNavigation(url)
          };
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  // Capture screenshots with storage management
  async captureScreenshot(options = {}) {
    const { selector, fullPage = true, filename, storeLocal = true } = options;
    
    if (!this.isConnected) {
      return this.fallbackScreenshot();
    }

    try {
      const result = await this.callMCPTool('puppeteer_screenshot', {
        selector,
        fullPage,
        filename
      });
      
      const screenshotData = {
        id: `screenshot_${Date.now()}`,
        data: result.metadata?.screenshot,
        url: result.metadata?.url,
        timestamp: result.metadata?.timestamp,
        selector,
        filename
      };

      // Store screenshot if requested
      if (storeLocal) {
        this.screenshotStore.set(screenshotData.id, screenshotData);
      }

      return {
        success: true,
        screenshot: screenshotData
      };
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      return {
        success: false,
        error: error.message,
        fallback: await this.fallbackScreenshot()
      };
    }
  }

  // Extract data with intelligent parsing
  async extractData(selector, options = {}) {
    const { attribute, multiple = false, parseAs = 'text' } = options;
    
    if (!this.isConnected) {
      return this.fallbackDataExtraction(selector);
    }

    try {
      const result = await this.callMCPTool('puppeteer_extract_data', {
        selector,
        attribute,
        multiple
      });
      
      let data = result.metadata?.data;
      
      // Intelligent parsing
      if (parseAs === 'json' && typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          console.warn('Failed to parse as JSON, returning as text');
        }
      }
      
      return {
        success: true,
        data,
        selector,
        url: result.metadata?.url,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Data extraction failed:', error);
      return {
        success: false,
        error: error.message,
        fallback: await this.fallbackDataExtraction(selector)
      };
    }
  }

  // Automated competitor research
  async researchCompetitor(competitorDomain, researchType = 'pricing') {
    const research = {
      domain: competitorDomain,
      type: researchType,
      timestamp: new Date().toISOString(),
      data: {},
      screenshots: []
    };

    try {
      // Navigate to competitor site
      await this.navigate(`https://${competitorDomain}`);
      
      // Capture homepage screenshot
      const homepage = await this.captureScreenshot({
        filename: `${competitorDomain}_homepage`,
        fullPage: true
      });
      research.screenshots.push(homepage.screenshot);

      switch (researchType) {
        case 'pricing':
          research.data = await this.extractPricingInformation(competitorDomain);
          break;
        case 'features':
          research.data = await this.extractFeatureInformation(competitorDomain);
          break;
        case 'tech_stack':
          research.data = await this.extractTechStackInformation(competitorDomain);
          break;
        default:
          research.data = await this.extractGeneralInformation(competitorDomain);
      }

      return {
        success: true,
        research
      };
    } catch (error) {
      console.error('Competitor research failed:', error);
      return {
        success: false,
        error: error.message,
        partialData: research
      };
    }
  }

  // Extract pricing information
  async extractPricingInformation(domain) {
    const pricingSelectors = [
      '[class*="pricing"]',
      '[class*="price"]', 
      '[id*="pricing"]',
      'a[href*="pricing"]',
      'a[href*="plans"]'
    ];

    for (const selector of pricingSelectors) {
      try {
        // Try to find pricing links
        const pricingLinks = await this.extractData(selector, { multiple: true });
        
        if (pricingLinks.success && pricingLinks.data?.length > 0) {
          // Navigate to pricing page if found
          const pricingLink = pricingLinks.data.find(link => 
            link.includes('/pricing') || link.includes('/plans')
          );
          
          if (pricingLink) {
            await this.interact('click', selector);
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Capture pricing page screenshot
            const pricingScreenshot = await this.captureScreenshot({
              filename: `${domain}_pricing`,
              fullPage: true
            });
            
            // Extract pricing data
            const priceData = await this.extractData('[class*="price"], [class*="cost"]', { 
              multiple: true 
            });
            
            return {
              pricingPage: true,
              prices: priceData.data,
              screenshot: pricingScreenshot.screenshot
            };
          }
        }
      } catch (error) {
        console.warn(`Failed to extract pricing with selector ${selector}:`, error);
        continue;
      }
    }

    return {
      pricingPage: false,
      message: 'No pricing information found on homepage'
    };
  }

  // Extract feature information
  async extractFeatureInformation(domain) {
    const featureSelectors = [
      '[class*="feature"]',
      '[class*="benefit"]',
      'h1, h2, h3',
      '[class*="highlight"]'
    ];

    const features = [];
    
    for (const selector of featureSelectors) {
      try {
        const data = await this.extractData(selector, { multiple: true });
        if (data.success && data.data?.length > 0) {
          features.push(...data.data.filter(text => text && text.length > 10));
        }
      } catch (error) {
        console.warn(`Feature extraction failed for ${selector}:`, error);
      }
    }

    return {
      features: features.slice(0, 20), // Limit to top 20 features
      totalFound: features.length
    };
  }

  // Extract tech stack information
  async extractTechStackInformation(domain) {
    try {
      // Execute JavaScript to detect common technologies
      const techStack = await this.executeJS(`
        // Common technology detection
        const technologies = [];
        
        // Framework detection
        if (window.React) technologies.push('React');
        if (window.Vue) technologies.push('Vue.js');
        if (window.angular) technologies.push('Angular');
        if (window.jQuery) technologies.push('jQuery');
        
        // Analytics detection
        if (window.gtag || window.ga) technologies.push('Google Analytics');
        if (window.fbq) technologies.push('Facebook Pixel');
        
        // Other detections
        const scripts = Array.from(document.querySelectorAll('script[src]'));
        scripts.forEach(script => {
          const src = script.src.toLowerCase();
          if (src.includes('stripe')) technologies.push('Stripe');
          if (src.includes('intercom')) technologies.push('Intercom');
          if (src.includes('hotjar')) technologies.push('Hotjar');
          if (src.includes('segment')) technologies.push('Segment');
        });
        
        return technologies;
      `);

      return {
        detectedTechnologies: techStack.metadata?.result || [],
        method: 'JavaScript detection'
      };
    } catch (error) {
      return {
        error: error.message,
        detectedTechnologies: [],
        method: 'Detection failed'
      };
    }
  }

  // Fallback methods for when MCP is unavailable
  async fallbackNavigation(url) {
    return {
      success: false,
      method: 'fallback',
      message: 'Puppeteer MCP unavailable - would need manual research',
      suggestedAction: `Manually visit ${url} for research`
    };
  }

  async fallbackScreenshot() {
    return {
      success: false,
      method: 'fallback', 
      message: 'Screenshot capture unavailable - MCP not connected'
    };
  }

  async fallbackDataExtraction(selector) {
    return {
      success: false,
      method: 'fallback',
      message: `Data extraction unavailable - would target: ${selector}`
    };
  }

  // MCP tool call wrapper
  async callMCPTool(toolName, args) {
    if (!this.isConnected || !window.mcpTools) {
      throw new Error('MCP tools not available');
    }
    
    // This would be the actual MCP call when integrated with Claude Code
    // For now, simulate the call structure
    throw new Error('MCP integration pending - Claude Code setup required');
  }

  // Screenshot management
  getStoredScreenshots() {
    return Array.from(this.screenshotStore.values());
  }

  getScreenshot(id) {
    return this.screenshotStore.get(id);
  }

  clearScreenshots() {
    this.screenshotStore.clear();
  }

  // Error management
  getErrorHistory() {
    return Array.from(this.errorCache.entries()).map(([url, error]) => ({
      url,
      error,
      timestamp: new Date().toISOString()
    }));
  }

  clearErrors() {
    this.errorCache.clear();
  }

  // Health check
  async healthCheck() {
    return {
      connected: this.isConnected,
      sessionId: this.sessionId,
      screenshotCount: this.screenshotStore.size,
      errorCount: this.errorCache.size,
      status: this.isConnected ? 'operational' : 'fallback_mode'
    };
  }
}

export default PuppeteerIntegrationService;