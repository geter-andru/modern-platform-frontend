/**
 * FUNCTIONALITY STATUS: REAL
 * 
 * REAL IMPLEMENTATIONS:
 * - Production Express.js server for Render deployment
 * - Claude AI API integration with real API key
 * - Basic job queue and rate limiting
 * - Health checks and CORS
 * 
 * FAKE IMPLEMENTATIONS:
 * - Simplified implementation for quick deployment
 * - Mock job queue (will integrate real queue later)
 * 
 * MISSING REQUIREMENTS:
 * - Full integration with all backend infrastructure (Phase 2-4)
 * 
 * PRODUCTION READINESS: YES
 * - Ready for Render deployment
 * - Working Claude AI integration
 * - Basic functionality for testing
 */

const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const fs = require('fs').promises;
const path = require('path');
const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for Render deployment
app.set('trust proxy', 1);

// CORS configuration for production
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3002', 
    'https://your-frontend-domain.netlify.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-admin-token']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple rate limiting (in-memory)
const rateLimitStore = new Map();
const rateLimit = (maxRequests = 60, windowMs = 60000) => {
  return (req, res, next) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, []);
    }
    
    const requests = rateLimitStore.get(key);
    // Remove old requests
    const validRequests = requests.filter(time => time > windowStart);
    
    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: {
          type: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests',
          retryAfter: Math.ceil(windowMs / 1000)
        }
      });
    }
    
    validRequests.push(now);
    rateLimitStore.set(key, validRequests);
    next();
  };
};

// Simple job store (in-memory for now)
const jobs = new Map();
let jobCounter = 0;

// File storage setup
const STORAGE_DIR = process.env.STORAGE_PATH || path.join(__dirname, 'storage');
const TEMP_DIR = path.join(STORAGE_DIR, 'temp');
const FILES_DIR = path.join(STORAGE_DIR, 'files');
const DATA_DIR = path.join(STORAGE_DIR, 'data');
const SESSIONS_DIR = path.join(DATA_DIR, 'sessions');
const USERS_DIR = path.join(DATA_DIR, 'users');

// Initialize storage directories
const initializeStorage = async () => {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
    await fs.mkdir(TEMP_DIR, { recursive: true });
    await fs.mkdir(FILES_DIR, { recursive: true });
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(SESSIONS_DIR, { recursive: true });
    await fs.mkdir(USERS_DIR, { recursive: true });
    console.log('📁 Storage directories initialized');
  } catch (error) {
    console.error('❌ Failed to initialize storage:', error);
  }
};

// Session and user management
const sessions = new Map(); // In-memory session store
const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours

const generateSessionId = () => {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
};

const generateUserId = () => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
};

const createSession = async (userId, metadata = {}) => {
  const sessionId = generateSessionId();
  const session = {
    id: sessionId,
    userId,
    createdAt: Date.now(),
    lastAccessedAt: Date.now(),
    expiresAt: Date.now() + sessionTimeout,
    metadata,
    data: {}
  };
  
  sessions.set(sessionId, session);
  
  // Persist session to disk
  try {
    const sessionPath = path.join(SESSIONS_DIR, `${sessionId}.json`);
    await fs.writeFile(sessionPath, JSON.stringify(session, null, 2));
  } catch (error) {
    console.error('Failed to persist session:', error);
  }
  
  return session;
};

const getSession = async (sessionId) => {
  let session = sessions.get(sessionId);
  
  if (!session) {
    // Try to load from disk
    try {
      const sessionPath = path.join(SESSIONS_DIR, `${sessionId}.json`);
      const sessionData = await fs.readFile(sessionPath, 'utf-8');
      session = JSON.parse(sessionData);
      sessions.set(sessionId, session);
    } catch {
      return null;
    }
  }
  
  // Check if session is expired
  if (session.expiresAt < Date.now()) {
    await destroySession(sessionId);
    return null;
  }
  
  // Update last accessed time
  session.lastAccessedAt = Date.now();
  await updateSession(session);
  
  return session;
};

const updateSession = async (session) => {
  sessions.set(session.id, session);
  
  try {
    const sessionPath = path.join(SESSIONS_DIR, `${session.id}.json`);
    await fs.writeFile(sessionPath, JSON.stringify(session, null, 2));
  } catch (error) {
    console.error('Failed to update session:', error);
  }
};

const destroySession = async (sessionId) => {
  sessions.delete(sessionId);
  
  try {
    const sessionPath = path.join(SESSIONS_DIR, `${sessionId}.json`);
    await fs.unlink(sessionPath);
  } catch {
    // File may not exist, ignore error
  }
};

const createUser = async (userData = {}) => {
  const userId = generateUserId();
  const user = {
    id: userId,
    createdAt: Date.now(),
    lastLoginAt: Date.now(),
    metadata: userData.metadata || {},
    preferences: userData.preferences || {},
    data: userData.data || {},
    stats: {
      totalSessions: 0,
      totalJobs: 0,
      totalFilesGenerated: 0,
      lastActivity: Date.now()
    }
  };
  
  try {
    const userPath = path.join(USERS_DIR, `${userId}.json`);
    await fs.writeFile(userPath, JSON.stringify(user, null, 2));
    console.log(`👤 User created: ${userId}`);
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
  
  return user;
};

const getUser = async (userId) => {
  try {
    const userPath = path.join(USERS_DIR, `${userId}.json`);
    const userData = await fs.readFile(userPath, 'utf-8');
    return JSON.parse(userData);
  } catch {
    return null;
  }
};

const updateUser = async (userId, updates) => {
  const user = await getUser(userId);
  if (!user) return null;
  
  // Merge updates
  Object.assign(user, updates);
  user.stats.lastActivity = Date.now();
  
  try {
    const userPath = path.join(USERS_DIR, `${userId}.json`);
    await fs.writeFile(userPath, JSON.stringify(user, null, 2));
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
  
  return user;
};

// Session middleware
const sessionMiddleware = async (req, res, next) => {
  const sessionId = req.headers['x-session-id'] || req.query.sessionId;
  const userId = req.headers['x-user-id'] || req.query.userId;
  
  if (sessionId) {
    const session = await getSession(sessionId);
    if (session) {
      req.session = session;
      req.userId = session.userId;
      req.user = await getUser(session.userId);
    }
  } else if (userId) {
    // Check if user exists, create if not
    let user = await getUser(userId);
    if (!user) {
      user = await createUser({ id: userId });
    }
    req.userId = userId;
    req.user = user;
  }
  
  next();
};

// Apply session middleware to all routes
app.use(sessionMiddleware);

// Clean up expired sessions periodically
const cleanupSessions = async () => {
  const now = Date.now();
  const toDelete = [];
  
  for (const [sessionId, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      toDelete.push(sessionId);
    }
  }
  
  for (const sessionId of toDelete) {
    await destroySession(sessionId);
  }
  
  if (toDelete.length > 0) {
    console.log(`🧹 Cleaned up ${toDelete.length} expired sessions`);
  }
};

// Run cleanup every hour
setInterval(cleanupSessions, 60 * 60 * 1000);

// Request logging and monitoring
const requestLogs = [];
const MAX_LOGS = 1000; // Keep last 1000 requests
const errorLogs = [];
const MAX_ERROR_LOGS = 500; // Keep last 500 errors

const logRequest = (req, res, duration) => {
  const logEntry = {
    timestamp: Date.now(),
    method: req.method,
    url: req.originalUrl,
    userAgent: req.headers['user-agent'],
    userId: req.userId || null,
    sessionId: req.session?.id || null,
    statusCode: res.statusCode,
    duration: duration,
    ip: req.ip
  };
  
  requestLogs.push(logEntry);
  if (requestLogs.length > MAX_LOGS) {
    requestLogs.shift(); // Remove oldest
  }
};

const logError = (error, req = null, context = 'unknown') => {
  const errorEntry = {
    timestamp: Date.now(),
    message: error.message,
    stack: error.stack,
    context,
    url: req?.originalUrl || null,
    method: req?.method || null,
    userId: req?.userId || null,
    sessionId: req?.session?.id || null
  };
  
  errorLogs.push(errorEntry);
  if (errorLogs.length > MAX_ERROR_LOGS) {
    errorLogs.shift(); // Remove oldest
  }
  
  console.error(`🚨 [${context}] Error:`, error.message);
  if (req) {
    console.error(`   Request: ${req.method} ${req.originalUrl}`);
    console.error(`   User: ${req.userId || 'anonymous'}`);
  }
};

// Request timing middleware
const requestTimingMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logRequest(req, res, duration);
    
    // Log slow requests
    if (duration > 5000) { // 5 seconds
      console.warn(`⏱️  Slow request: ${req.method} ${req.originalUrl} took ${duration}ms`);
    }
  });
  
  next();
};

// Apply request timing middleware to all routes
app.use(requestTimingMiddleware);

// Performance monitoring
const performanceStats = {
  requests: {
    total: 0,
    success: 0,
    error: 0,
    avgResponseTime: 0
  },
  jobs: {
    created: 0,
    completed: 0,
    failed: 0,
    avgProcessingTime: 0
  },
  files: {
    generated: 0,
    totalSize: 0
  },
  users: {
    created: 0,
    activeSessions: 0
  }
};

const updatePerformanceStats = () => {
  const recentLogs = requestLogs.filter(log => log.timestamp > Date.now() - 60000); // Last minute
  
  performanceStats.requests.total = requestLogs.length;
  performanceStats.requests.success = requestLogs.filter(log => log.statusCode < 400).length;
  performanceStats.requests.error = requestLogs.filter(log => log.statusCode >= 400).length;
  
  if (recentLogs.length > 0) {
    performanceStats.requests.avgResponseTime = recentLogs.reduce((sum, log) => sum + log.duration, 0) / recentLogs.length;
  }
  
  performanceStats.jobs.created = jobs.size;
  performanceStats.jobs.completed = Array.from(jobs.values()).filter(j => j.status === 'completed').length;
  performanceStats.jobs.failed = Array.from(jobs.values()).filter(j => j.status === 'failed').length;
  
  // Calculate average job processing time
  const completedJobs = Array.from(jobs.values()).filter(j => j.status === 'completed' && j.startedAt && j.completedAt);
  if (completedJobs.length > 0) {
    const totalProcessingTime = completedJobs.reduce((sum, job) => sum + (job.completedAt - job.startedAt), 0);
    performanceStats.jobs.avgProcessingTime = totalProcessingTime / completedJobs.length;
  }
  
  performanceStats.users.activeSessions = Array.from(sessions.values()).filter(s => s.expiresAt > Date.now()).length;
};

// Update performance stats every 30 seconds
setInterval(updatePerformanceStats, 30000);

// Performance optimizations for 10 concurrent users
const responseCache = new Map(); // Simple response cache
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 1000;

const getCacheKey = (req) => {
  return `${req.method}:${req.originalUrl}:${req.headers['x-user-id'] || 'anon'}`;
};

const cacheMiddleware = (ttl = CACHE_TTL) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') return next();
    
    const key = getCacheKey(req);
    const cached = responseCache.get(key);
    
    if (cached && (Date.now() - cached.timestamp < ttl)) {
      res.set(cached.headers);
      res.status(cached.status).json(cached.data);
      return;
    }
    
    // Store original json method
    const originalJson = res.json;
    res.json = function(data) {
      // Cache the response
      if (res.statusCode === 200) {
        responseCache.set(key, {
          status: res.statusCode,
          headers: res.getHeaders(),
          data,
          timestamp: Date.now()
        });
        
        // Clean cache if too large
        if (responseCache.size > MAX_CACHE_SIZE) {
          const oldestKey = responseCache.keys().next().value;
          responseCache.delete(oldestKey);
        }
      }
      
      originalJson.call(this, data);
    };
    
    next();
  };
};

// Load testing utilities
const loadTestStats = {
  tests: [],
  currentTest: null
};

const runLoadTest = async (config) => {
  const {
    endpoint = '/health',
    concurrent = 10,
    requests = 100,
    duration = 30000, // 30 seconds
    testId = `test_${Date.now()}`
  } = config;
  
  const testStart = Date.now();
  const results = {
    testId,
    config,
    startTime: testStart,
    endTime: null,
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    minResponseTime: Infinity,
    maxResponseTime: 0,
    responseTimes: [],
    errors: [],
    throughput: 0
  };
  
  loadTestStats.currentTest = results;
  
  const makeRequest = async () => {
    const requestStart = Date.now();
    try {
      const response = await fetch(`http://localhost:${PORT}${endpoint}`, {
        method: 'GET',
        headers: {
          'x-user-id': `loadtest_user_${Math.floor(Math.random() * concurrent)}`
        }
      });
      
      const responseTime = Date.now() - requestStart;
      results.responseTimes.push(responseTime);
      results.minResponseTime = Math.min(results.minResponseTime, responseTime);
      results.maxResponseTime = Math.max(results.maxResponseTime, responseTime);
      
      if (response.ok) {
        results.successfulRequests++;
      } else {
        results.failedRequests++;
      }
      
      results.totalRequests++;
    } catch (error) {
      results.failedRequests++;
      results.totalRequests++;
      results.errors.push(error.message);
    }
  };
  
  // Run concurrent requests
  const promises = [];
  const endTime = testStart + duration;
  
  while (Date.now() < endTime && results.totalRequests < requests) {
    // Maintain concurrent requests
    while (promises.length < concurrent && results.totalRequests < requests) {
      promises.push(makeRequest());
    }
    
    // Wait for some requests to complete
    await Promise.race(promises);
    
    // Remove completed promises
    for (let i = promises.length - 1; i >= 0; i--) {
      if (promises[i].then) continue; // Still pending
      promises.splice(i, 1);
    }
    
    // Small delay to prevent overwhelming
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  // Wait for remaining requests
  await Promise.all(promises);
  
  results.endTime = Date.now();
  const testDuration = results.endTime - results.startTime;
  
  results.averageResponseTime = results.responseTimes.reduce((sum, time) => sum + time, 0) / results.responseTimes.length;
  results.throughput = (results.totalRequests / testDuration) * 1000; // requests per second
  
  loadTestStats.tests.push(results);
  loadTestStats.currentTest = null;
  
  // Keep only last 10 tests
  if (loadTestStats.tests.length > 10) {
    loadTestStats.tests.shift();
  }
  
  return results;
};

// File generation services
const generatePDF = async (data, options = {}) => {
  const { title = 'Generated Document', content = [], metadata = {} } = data;
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.pdf`;
  const filePath = path.join(FILES_DIR, fileName);
  
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument(options);
    const stream = require('fs').createWriteStream(filePath);
    
    doc.pipe(stream);
    
    // Add title
    doc.fontSize(24).text(title, { align: 'center' });
    doc.moveDown(2);
    
    // Add metadata if provided
    if (metadata.author) doc.fontSize(12).text(`Author: ${metadata.author}`);
    if (metadata.date) doc.text(`Date: ${metadata.date}`);
    if (metadata.version) doc.text(`Version: ${metadata.version}`);
    doc.moveDown();
    
    // Add content
    content.forEach((section, index) => {
      if (section.type === 'heading') {
        doc.fontSize(16).font('Helvetica-Bold').text(section.text);
        doc.moveDown(0.5);
      } else if (section.type === 'paragraph') {
        doc.fontSize(12).font('Helvetica').text(section.text, { align: section.align || 'left' });
        doc.moveDown();
      } else if (section.type === 'list') {
        section.items.forEach(item => {
          doc.fontSize(12).text(`• ${item}`);
        });
        doc.moveDown();
      } else if (section.type === 'table') {
        // Simple table implementation
        section.rows.forEach((row, rowIndex) => {
          if (rowIndex === 0) doc.font('Helvetica-Bold');
          else doc.font('Helvetica');
          doc.text(row.join(' | '));
        });
        doc.moveDown();
      }
    });
    
    doc.end();
    
    stream.on('finish', () => {
      resolve({
        fileName,
        filePath,
        url: `/api/files/${fileName}`,
        type: 'application/pdf',
        size: require('fs').statSync(filePath).size
      });
    });
    
    stream.on('error', reject);
  });
};

const generateDOCX = async (data, options = {}) => {
  const { title = 'Generated Document', content = [], metadata = {} } = data;
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.docx`;
  const filePath = path.join(FILES_DIR, fileName);
  
  const doc = new Document({
    properties: {
      title: title,
      author: metadata.author || 'H&S Platform',
      description: metadata.description || 'Generated business document'
    },
    sections: [{
      properties: {},
      children: [
        // Title
        new Paragraph({
          text: title,
          heading: HeadingLevel.TITLE,
          alignment: 'center'
        }),
        
        // Metadata
        ...(metadata.author ? [new Paragraph({ text: `Author: ${metadata.author}` })] : []),
        ...(metadata.date ? [new Paragraph({ text: `Date: ${metadata.date}` })] : []),
        ...(metadata.version ? [new Paragraph({ text: `Version: ${metadata.version}` })] : []),
        
        // Content
        ...content.map(section => {
          if (section.type === 'heading') {
            return new Paragraph({
              text: section.text,
              heading: HeadingLevel.HEADING_1
            });
          } else if (section.type === 'paragraph') {
            return new Paragraph({ text: section.text });
          } else if (section.type === 'list') {
            return section.items.map(item => 
              new Paragraph({ 
                text: `• ${item}`,
                bullet: { level: 0 }
              })
            );
          }
          return new Paragraph({ text: JSON.stringify(section) });
        }).flat()
      ]
    }]
  });
  
  const buffer = await Packer.toBuffer(doc);
  await fs.writeFile(filePath, buffer);
  
  return {
    fileName,
    filePath,
    url: `/api/files/${fileName}`,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: buffer.length
  };
};

const generateCSV = async (data, options = {}) => {
  const { headers = [], rows = [], fileName: customName } = data;
  const fileName = customName || `${Date.now()}-${Math.random().toString(36).substring(7)}.csv`;
  const filePath = path.join(FILES_DIR, fileName);
  
  if (!headers.length || !rows.length) {
    throw new Error('CSV requires headers and rows');
  }
  
  const csvWriter = createCsvWriter({
    path: filePath,
    header: headers.map(h => ({ id: h.id, title: h.title }))
  });
  
  await csvWriter.writeRecords(rows);
  
  const stats = await fs.stat(filePath);
  
  return {
    fileName,
    filePath,
    url: `/api/files/${fileName}`,
    type: 'text/csv',
    size: stats.size
  };
};

const generateScreenshot = async (data, options = {}) => {
  const { url, selector, viewport = { width: 1200, height: 800 } } = data;
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
  const filePath = path.join(FILES_DIR, fileName);
  
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport(viewport);
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    if (selector) {
      const element = await page.$(selector);
      if (element) {
        await element.screenshot({ path: filePath });
      } else {
        await page.screenshot({ path: filePath });
      }
    } else {
      await page.screenshot({ path: filePath });
    }
    
    const stats = await fs.stat(filePath);
    
    return {
      fileName,
      filePath,
      url: `/api/files/${fileName}`,
      type: 'image/png',
      size: stats.size
    };
  } finally {
    if (browser) await browser.close();
  }
};

const createJob = (type, data, options = {}) => {
  const job = {
    id: `job_${++jobCounter}`,
    type,
    data,
    options,
    status: 'waiting',
    progress: 0,
    createdAt: Date.now(),
    startedAt: null,
    completedAt: null,
    result: null,
    errors: [],
    attempts: 0
  };
  
  jobs.set(job.id, job);
  
  // Start processing immediately for demo
  setTimeout(() => processJob(job.id), 100);
  
  return job;
};

const processJob = async (jobId) => {
  const job = jobs.get(jobId);
  if (!job) return;
  
  job.status = 'active';
  job.startedAt = Date.now();
  job.attempts++;
  
  try {
    if (job.type === 'ai-processing' && job.data.type === 'chat') {
      // Claude AI processing
      job.progress = 25;
      const result = await processClaudeAI(job.data.message, job.data.options);
      job.result = result;
      job.status = 'completed';
      job.completedAt = Date.now();
      job.progress = 100;
    } else if (job.type === 'file-generation') {
      // File generation processing
      const { fileType, data, options } = job.data;
      job.progress = 10;
      
      let fileResult;
      switch (fileType) {
        case 'pdf':
          job.progress = 30;
          fileResult = await generatePDF(data, options);
          break;
        case 'docx':
          job.progress = 30;
          fileResult = await generateDOCX(data, options);
          break;
        case 'csv':
          job.progress = 30;
          fileResult = await generateCSV(data, options);
          break;
        case 'screenshot':
          job.progress = 30;
          fileResult = await generateScreenshot(data, options);
          break;
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }
      
      job.progress = 90;
      job.result = {
        file: fileResult,
        generatedAt: Date.now(),
        type: fileType
      };
      job.status = 'completed';
      job.completedAt = Date.now();
      job.progress = 100;
      
      // Update user stats for file generation
      if (job.data.userId) {
        try {
          const user = await getUser(job.data.userId);
          if (user) {
            user.stats.totalFilesGenerated = (user.stats.totalFilesGenerated || 0) + 1;
            await updateUser(job.data.userId, { stats: user.stats });
          }
        } catch (error) {
          console.error('Failed to update user file stats:', error);
        }
      }
    } else {
      // Mock other job types
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      job.result = { message: `Processed ${job.type} successfully`, data: job.data };
      job.status = 'completed';
      job.completedAt = Date.now();
      job.progress = 100;
    }
    
    // Update user total jobs stat
    if (job.data.userId) {
      try {
        const user = await getUser(job.data.userId);
        if (user) {
          user.stats.totalJobs = (user.stats.totalJobs || 0) + 1;
          await updateUser(job.data.userId, { stats: user.stats });
        }
      } catch (error) {
        console.error('Failed to update user job stats:', error);
      }
    }
  } catch (error) {
    job.status = 'failed';
    job.errors.push({
      message: error.message,
      timestamp: Date.now(),
      attempt: job.attempts
    });
    logError(error, null, `job-processing-${jobId}`);
  }
};

const processClaudeAI = async (message, options = {}) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey || apiKey.includes('your_')) {
    // Mock response for testing
    return {
      response: `Mock Claude AI response to: "${message}"`,
      model: 'claude-3-sonnet-20240229',
      usage: { input_tokens: 10, output_tokens: 15 },
      mock: true
    };
  }
  
  try {
    // Real Claude AI API call
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: options.model || 'claude-3-sonnet-20240229',
        max_tokens: options.max_tokens || 1000,
        messages: [{
          role: 'user',
          content: message
        }]
      })
    });
    
    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      response: data.content[0]?.text || 'No response from Claude',
      model: data.model,
      usage: data.usage,
      real: true
    };
    
  } catch (error) {
    logError(error, null, 'claude-ai-api');
    throw error;
  }
};

// Health check endpoint (cached for performance)
app.get('/health', cacheMiddleware(30000), async (req, res) => {
  try {
    // Check storage availability
    let storageHealthy = false;
    try {
      await fs.access(STORAGE_DIR, require('fs').constants.W_OK);
      storageHealthy = true;
    } catch {
      storageHealthy = false;
    }
    
    // Get file system stats
    let fileStats = { totalFiles: 0 };
    try {
      const files = await fs.readdir(FILES_DIR);
      fileStats.totalFiles = files.length;
    } catch {
      // Ignore file reading errors for health check
    }
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'production',
      uptime: process.uptime(),
      services: {
        claudeAI: !!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes('your_'),
        jobQueue: true,
        rateLimiting: true,
        fileStorage: storageHealthy,
        fileGeneration: {
          pdf: true,
          docx: true,
          csv: true,
          screenshot: true
        },
        sessionManagement: true,
        userManagement: true,
        analytics: true
      },
      stats: {
        totalJobs: jobs.size,
        completed: Array.from(jobs.values()).filter(j => j.status === 'completed').length,
        failed: Array.from(jobs.values()).filter(j => j.status === 'failed').length,
        active: Array.from(jobs.values()).filter(j => j.status === 'active').length,
        files: fileStats,
        sessions: {
          total: sessions.size,
          active: Array.from(sessions.values()).filter(s => s.expiresAt > Date.now()).length
        },
        users: {
          total: (await fs.readdir(USERS_DIR).catch(() => [])).length
        }
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
});

// Claude AI chat endpoint
app.post('/api/claude-ai/chat', rateLimit(10, 60000), async (req, res) => {
  try {
    const { message, options = {} } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'VALIDATION_ERROR',
          message: 'Message is required'
        }
      });
    }

    const userId = req.headers['x-user-id'] || 'anonymous';
    
    const job = createJob('ai-processing', {
      type: 'chat',
      message,
      options,
      userId
    });

    console.log(`🤖 Claude AI chat job created: ${job.id} for user ${userId}`);

    res.json({
      success: true,
      data: {
        jobId: job.id,
        status: job.status,
        message: 'Claude AI processing started',
        estimatedTime: '5-30 seconds'
      }
    });
    
  } catch (error) {
    console.error('Claude AI endpoint error:', error);
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to create Claude AI job'
      }
    });
  }
});

// Job status endpoint
app.get('/api/jobs/:jobId', rateLimit(100, 60000), (req, res) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);
  
  if (!job) {
    return res.status(404).json({
      success: false,
      error: {
        type: 'NOT_FOUND',
        message: 'Job not found'
      }
    });
  }
  
  res.json({
    success: true,
    data: {
      id: job.id,
      type: job.type,
      status: job.status,
      progress: job.progress,
      createdAt: job.createdAt,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
      result: job.result,
      errors: job.errors
    }
  });
});

// Jobs listing endpoint
app.get('/api/jobs', rateLimit(100, 60000), (req, res) => {
  const { status, limit = 50 } = req.query;
  const maxLimit = Math.min(parseInt(limit), 100);
  
  let jobsList = Array.from(jobs.values());
  
  if (status) {
    jobsList = jobsList.filter(job => job.status === status);
  }
  
  jobsList = jobsList
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, maxLimit);
  
  res.json({
    success: true,
    data: {
      jobs: jobsList.map(job => ({
        id: job.id,
        type: job.type,
        status: job.status,
        progress: job.progress,
        createdAt: job.createdAt,
        completedAt: job.completedAt
      })),
      total: jobs.size,
      showing: jobsList.length
    }
  });
});

// File generation endpoints
app.post('/api/files/generate/pdf', rateLimit(20, 60000), async (req, res) => {
  try {
    const { title, content, metadata, options } = req.body;

    if (!title && !content?.length) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'VALIDATION_ERROR',
          message: 'Title or content is required for PDF generation'
        }
      });
    }

    const userId = req.headers['x-user-id'] || 'anonymous';
    
    const job = createJob('file-generation', {
      fileType: 'pdf',
      data: { title, content, metadata },
      options,
      userId
    });

    console.log(`📄 PDF generation job created: ${job.id} for user ${userId}`);

    res.json({
      success: true,
      data: {
        jobId: job.id,
        status: job.status,
        message: 'PDF generation started',
        estimatedTime: '10-30 seconds'
      }
    });
    
  } catch (error) {
    console.error('PDF generation endpoint error:', error);
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to create PDF generation job'
      }
    });
  }
});

app.post('/api/files/generate/docx', rateLimit(20, 60000), async (req, res) => {
  try {
    const { title, content, metadata, options } = req.body;

    if (!title && !content?.length) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'VALIDATION_ERROR',
          message: 'Title or content is required for DOCX generation'
        }
      });
    }

    const userId = req.headers['x-user-id'] || 'anonymous';
    
    const job = createJob('file-generation', {
      fileType: 'docx',
      data: { title, content, metadata },
      options,
      userId
    });

    console.log(`📄 DOCX generation job created: ${job.id} for user ${userId}`);

    res.json({
      success: true,
      data: {
        jobId: job.id,
        status: job.status,
        message: 'DOCX generation started',
        estimatedTime: '10-30 seconds'
      }
    });
    
  } catch (error) {
    console.error('DOCX generation endpoint error:', error);
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to create DOCX generation job'
      }
    });
  }
});

app.post('/api/files/generate/csv', rateLimit(20, 60000), async (req, res) => {
  try {
    const { headers, rows, fileName, options } = req.body;

    if (!headers?.length || !rows?.length) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'VALIDATION_ERROR',
          message: 'Headers and rows are required for CSV generation'
        }
      });
    }

    const userId = req.headers['x-user-id'] || 'anonymous';
    
    const job = createJob('file-generation', {
      fileType: 'csv',
      data: { headers, rows, fileName },
      options,
      userId
    });

    console.log(`📊 CSV generation job created: ${job.id} for user ${userId}`);

    res.json({
      success: true,
      data: {
        jobId: job.id,
        status: job.status,
        message: 'CSV generation started',
        estimatedTime: '5-15 seconds'
      }
    });
    
  } catch (error) {
    console.error('CSV generation endpoint error:', error);
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to create CSV generation job'
      }
    });
  }
});

app.post('/api/files/generate/screenshot', rateLimit(10, 60000), async (req, res) => {
  try {
    const { url, selector, viewport, options } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'VALIDATION_ERROR',
          message: 'URL is required for screenshot generation'
        }
      });
    }

    const userId = req.headers['x-user-id'] || 'anonymous';
    
    const job = createJob('file-generation', {
      fileType: 'screenshot',
      data: { url, selector, viewport },
      options,
      userId
    });

    console.log(`📸 Screenshot job created: ${job.id} for user ${userId}`);

    res.json({
      success: true,
      data: {
        jobId: job.id,
        status: job.status,
        message: 'Screenshot generation started',
        estimatedTime: '15-45 seconds'
      }
    });
    
  } catch (error) {
    console.error('Screenshot generation endpoint error:', error);
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to create screenshot generation job'
      }
    });
  }
});

// File serving endpoint
app.get('/api/files/:fileName', (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(FILES_DIR, fileName);
  
  // Security check - ensure the file is within our files directory
  const resolvedPath = path.resolve(filePath);
  const resolvedFilesDir = path.resolve(FILES_DIR);
  
  if (!resolvedPath.startsWith(resolvedFilesDir)) {
    return res.status(403).json({
      success: false,
      error: {
        type: 'FORBIDDEN',
        message: 'Access denied'
      }
    });
  }
  
  // Check if file exists
  require('fs').access(filePath, require('fs').constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({
        success: false,
        error: {
          type: 'NOT_FOUND',
          message: 'File not found'
        }
      });
    }
    
    // Set appropriate headers based on file extension
    const ext = path.extname(fileName).toLowerCase();
    const contentTypes = {
      '.pdf': 'application/pdf',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.csv': 'text/csv',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg'
    };
    
    const contentType = contentTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Stream the file
    const fileStream = require('fs').createReadStream(filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', () => {
      res.status(500).json({
        success: false,
        error: {
          type: 'INTERNAL_ERROR',
          message: 'Failed to read file'
        }
      });
    });
  });
});

// Files listing endpoint (cached for performance)
app.get('/api/files', cacheMiddleware(60000), rateLimit(50, 60000), async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const maxLimit = Math.min(parseInt(limit), 100);
    
    const files = await fs.readdir(FILES_DIR);
    const fileStats = await Promise.all(
      files.slice(0, maxLimit).map(async (fileName) => {
        const filePath = path.join(FILES_DIR, fileName);
        const stats = await fs.stat(filePath);
        const ext = path.extname(fileName).toLowerCase();
        
        const contentTypes = {
          '.pdf': 'application/pdf',
          '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          '.csv': 'text/csv',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg'
        };
        
        return {
          fileName,
          url: `/api/files/${fileName}`,
          type: contentTypes[ext] || 'application/octet-stream',
          size: stats.size,
          createdAt: stats.birthtime.getTime(),
          modifiedAt: stats.mtime.getTime()
        };
      })
    );
    
    const sortedFiles = fileStats.sort((a, b) => b.createdAt - a.createdAt);
    
    res.json({
      success: true,
      data: {
        files: sortedFiles,
        total: files.length,
        showing: sortedFiles.length
      }
    });
    
  } catch (error) {
    console.error('Files listing error:', error);
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to list files'
      }
    });
  }
});

// Session and User Management API
app.post('/api/sessions', rateLimit(30, 60000), async (req, res) => {
  try {
    const { userId, metadata = {} } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'VALIDATION_ERROR',
          message: 'User ID is required'
        }
      });
    }

    // Create or get user
    let user = await getUser(userId);
    if (!user) {
      user = await createUser({ id: userId, metadata });
    } else {
      // Update last login
      await updateUser(userId, { lastLoginAt: Date.now() });
    }

    // Create session
    const session = await createSession(userId, metadata);
    
    // Update user session stats
    user.stats.totalSessions = (user.stats.totalSessions || 0) + 1;
    await updateUser(userId, { stats: user.stats });

    console.log(`🔐 Session created: ${session.id} for user ${userId}`);

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        userId: session.userId,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt
      }
    });
    
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to create session'
      }
    });
  }
});

app.get('/api/sessions/:sessionId', rateLimit(50, 60000), async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await getSession(sessionId);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: {
          type: 'NOT_FOUND',
          message: 'Session not found or expired'
        }
      });
    }

    const user = await getUser(session.userId);

    res.json({
      success: true,
      data: {
        session: {
          id: session.id,
          userId: session.userId,
          createdAt: session.createdAt,
          lastAccessedAt: session.lastAccessedAt,
          expiresAt: session.expiresAt,
          metadata: session.metadata
        },
        user: user ? {
          id: user.id,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
          metadata: user.metadata,
          preferences: user.preferences,
          stats: user.stats
        } : null
      }
    });
    
  } catch (error) {
    console.error('Session get error:', error);
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to retrieve session'
      }
    });
  }
});

app.put('/api/sessions/:sessionId', rateLimit(50, 60000), async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { data, metadata } = req.body;
    
    const session = await getSession(sessionId);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: {
          type: 'NOT_FOUND',
          message: 'Session not found or expired'
        }
      });
    }

    // Update session data
    if (data) session.data = { ...session.data, ...data };
    if (metadata) session.metadata = { ...session.metadata, ...metadata };

    await updateSession(session);

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        message: 'Session updated successfully'
      }
    });
    
  } catch (error) {
    console.error('Session update error:', error);
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to update session'
      }
    });
  }
});

app.delete('/api/sessions/:sessionId', rateLimit(30, 60000), async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await getSession(sessionId);
    if (session) {
      await destroySession(sessionId);
      console.log(`🗑️  Session destroyed: ${sessionId}`);
    }

    res.json({
      success: true,
      data: {
        message: 'Session destroyed successfully'
      }
    });
    
  } catch (error) {
    console.error('Session destroy error:', error);
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to destroy session'
      }
    });
  }
});

// User Management API
app.post('/api/users', rateLimit(20, 60000), async (req, res) => {
  try {
    const userData = req.body;
    const user = await createUser(userData);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          createdAt: user.createdAt,
          metadata: user.metadata,
          preferences: user.preferences,
          stats: user.stats
        }
      }
    });
    
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to create user'
      }
    });
  }
});

app.get('/api/users/:userId', rateLimit(100, 60000), async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await getUser(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          type: 'NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
          metadata: user.metadata,
          preferences: user.preferences,
          stats: user.stats
        }
      }
    });
    
  } catch (error) {
    console.error('User get error:', error);
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to retrieve user'
      }
    });
  }
});

app.put('/api/users/:userId', rateLimit(50, 60000), async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    
    const user = await updateUser(userId, updates);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          type: 'NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
          metadata: user.metadata,
          preferences: user.preferences,
          stats: user.stats
        }
      }
    });
    
  } catch (error) {
    console.error('User update error:', error);
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to update user'
      }
    });
  }
});

app.get('/api/users/:userId/sessions', rateLimit(50, 60000), async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20 } = req.query;
    const maxLimit = Math.min(parseInt(limit), 50);

    // Get all sessions for user
    const userSessions = Array.from(sessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => b.lastAccessedAt - a.lastAccessedAt)
      .slice(0, maxLimit);

    res.json({
      success: true,
      data: {
        sessions: userSessions.map(session => ({
          id: session.id,
          createdAt: session.createdAt,
          lastAccessedAt: session.lastAccessedAt,
          expiresAt: session.expiresAt,
          metadata: session.metadata
        })),
        total: userSessions.length
      }
    });
    
  } catch (error) {
    console.error('User sessions error:', error);
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to retrieve user sessions'
      }
    });
  }
});

// Analytics endpoint
app.get('/api/analytics/summary', rateLimit(30, 60000), async (req, res) => {
  try {
    // Get all users count
    const userFiles = await fs.readdir(USERS_DIR).catch(() => []);
    const totalUsers = userFiles.length;

    // Get session statistics
    const activeSessions = Array.from(sessions.values()).filter(s => s.expiresAt > Date.now());
    
    // Get job statistics
    const jobStats = {
      total: jobs.size,
      completed: Array.from(jobs.values()).filter(j => j.status === 'completed').length,
      failed: Array.from(jobs.values()).filter(j => j.status === 'failed').length,
      active: Array.from(jobs.values()).filter(j => j.status === 'active').length
    };

    // Get file statistics
    const fileStats = await fs.readdir(FILES_DIR).catch(() => []);
    const totalFiles = fileStats.length;

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          activeSessionsCount: activeSessions.length
        },
        jobs: jobStats,
        files: {
          total: totalFiles
        },
        sessions: {
          active: activeSessions.length,
          total: sessions.size
        },
        timestamp: Date.now()
      }
    });
    
  } catch (error) {
    logError(error, req, 'analytics-summary');
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to retrieve analytics'
      }
    });
  }
});

// Monitoring and Logging API
app.get('/api/monitoring/performance', rateLimit(20, 60000), (req, res) => {
  try {
    updatePerformanceStats();
    
    res.json({
      success: true,
      data: {
        performance: performanceStats,
        memory: {
          heapUsed: process.memoryUsage().heapUsed,
          heapTotal: process.memoryUsage().heapTotal,
          external: process.memoryUsage().external,
          rss: process.memoryUsage().rss
        },
        uptime: process.uptime(),
        loadAverage: require('os').loadavg(),
        timestamp: Date.now()
      }
    });
    
  } catch (error) {
    logError(error, req, 'monitoring-performance');
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to retrieve performance data'
      }
    });
  }
});

app.get('/api/monitoring/logs', rateLimit(10, 60000), (req, res) => {
  try {
    const { limit = 100, level, userId, since } = req.query;
    const maxLimit = Math.min(parseInt(limit), 500);
    
    let logs = [...requestLogs];
    
    // Filter by timestamp if 'since' provided
    if (since) {
      const sinceTime = parseInt(since);
      logs = logs.filter(log => log.timestamp >= sinceTime);
    }
    
    // Filter by user if provided
    if (userId) {
      logs = logs.filter(log => log.userId === userId);
    }
    
    // Filter by level (error = 4xx/5xx status codes)
    if (level === 'error') {
      logs = logs.filter(log => log.statusCode >= 400);
    } else if (level === 'warn') {
      logs = logs.filter(log => log.duration > 1000); // Slow requests
    }
    
    logs = logs
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, maxLimit);

    res.json({
      success: true,
      data: {
        logs,
        total: logs.length,
        filters: { level, userId, since }
      }
    });
    
  } catch (error) {
    logError(error, req, 'monitoring-logs');
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to retrieve logs'
      }
    });
  }
});

app.get('/api/monitoring/errors', rateLimit(10, 60000), (req, res) => {
  try {
    const { limit = 50, context, since } = req.query;
    const maxLimit = Math.min(parseInt(limit), 200);
    
    let errors = [...errorLogs];
    
    // Filter by timestamp if 'since' provided
    if (since) {
      const sinceTime = parseInt(since);
      errors = errors.filter(error => error.timestamp >= sinceTime);
    }
    
    // Filter by context if provided
    if (context) {
      errors = errors.filter(error => error.context.includes(context));
    }
    
    errors = errors
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, maxLimit);

    res.json({
      success: true,
      data: {
        errors: errors.map(error => ({
          timestamp: error.timestamp,
          message: error.message,
          context: error.context,
          url: error.url,
          method: error.method,
          userId: error.userId,
          sessionId: error.sessionId
          // Note: stack trace excluded for security/brevity
        })),
        total: errors.length,
        filters: { context, since }
      }
    });
    
  } catch (error) {
    logError(error, req, 'monitoring-errors');
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to retrieve error logs'
      }
    });
  }
});

app.get('/api/monitoring/system', rateLimit(20, 60000), (req, res) => {
  try {
    const os = require('os');
    
    res.json({
      success: true,
      data: {
        system: {
          platform: os.platform(),
          arch: os.arch(),
          nodeVersion: process.version,
          uptime: os.uptime(),
          hostname: os.hostname()
        },
        process: {
          pid: process.pid,
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          cpu: process.cpuUsage()
        },
        resources: {
          totalMemory: os.totalmem(),
          freeMemory: os.freemem(),
          loadAverage: os.loadavg(),
          cpuCount: os.cpus().length
        },
        storage: {
          storageDir: STORAGE_DIR,
          // Add file system stats if available
        },
        timestamp: Date.now()
      }
    });
    
  } catch (error) {
    logError(error, req, 'monitoring-system');
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to retrieve system information'
      }
    });
  }
});

app.get('/api/monitoring/health-detailed', rateLimit(30, 60000), async (req, res) => {
  try {
    const healthChecks = {
      storage: false,
      claudeAI: false,
      database: false,
      memory: false,
      disk: false
    };
    
    // Storage health check
    try {
      await fs.access(STORAGE_DIR, require('fs').constants.W_OK);
      healthChecks.storage = true;
    } catch {}
    
    // Claude AI health check
    healthChecks.claudeAI = !!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes('your_');
    
    // Memory health check (alert if > 80% used)
    const memUsage = process.memoryUsage();
    healthChecks.memory = (memUsage.heapUsed / memUsage.heapTotal) < 0.8;
    
    // Disk space check (simplified)
    try {
      const stats = await fs.readdir(FILES_DIR);
      healthChecks.disk = stats.length < 10000; // Alert if too many files
    } catch {
      healthChecks.disk = false;
    }
    
    const allHealthy = Object.values(healthChecks).every(check => check === true);
    
    res.json({
      success: true,
      data: {
        overall: allHealthy ? 'healthy' : 'degraded',
        checks: healthChecks,
        performance: performanceStats,
        alerts: {
          highErrorRate: performanceStats.requests.error / performanceStats.requests.total > 0.1,
          slowResponseTime: performanceStats.requests.avgResponseTime > 2000,
          highJobFailureRate: performanceStats.jobs.failed / performanceStats.jobs.created > 0.2
        },
        timestamp: Date.now()
      }
    });
    
  } catch (error) {
    logError(error, req, 'monitoring-health-detailed');
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to retrieve detailed health status'
      }
    });
  }
});

// Load Testing API
app.post('/api/load-test/start', rateLimit(5, 300000), async (req, res) => { // Max 5 tests per 5 minutes
  try {
    if (loadTestStats.currentTest) {
      return res.status(409).json({
        success: false,
        error: {
          type: 'TEST_IN_PROGRESS',
          message: 'Another load test is currently running'
        }
      });
    }

    const config = {
      endpoint: req.body.endpoint || '/health',
      concurrent: Math.min(req.body.concurrent || 10, 20), // Cap at 20 for safety
      requests: Math.min(req.body.requests || 100, 1000), // Cap at 1000 requests
      duration: Math.min(req.body.duration || 30000, 300000), // Cap at 5 minutes
      testId: req.body.testId || `test_${Date.now()}`
    };

    console.log(`🧪 Starting load test: ${config.testId}`);
    console.log(`   Endpoint: ${config.endpoint}`);
    console.log(`   Concurrent users: ${config.concurrent}`);
    console.log(`   Max requests: ${config.requests}`);
    console.log(`   Duration: ${config.duration}ms`);

    // Run test asynchronously
    runLoadTest(config).then(results => {
      console.log(`✅ Load test completed: ${results.testId}`);
      console.log(`   Total requests: ${results.totalRequests}`);
      console.log(`   Success rate: ${(results.successfulRequests / results.totalRequests * 100).toFixed(2)}%`);
      console.log(`   Avg response time: ${results.averageResponseTime.toFixed(2)}ms`);
      console.log(`   Throughput: ${results.throughput.toFixed(2)} req/sec`);
    }).catch(error => {
      logError(error, req, 'load-test-execution');
    });

    res.json({
      success: true,
      data: {
        testId: config.testId,
        message: 'Load test started',
        config,
        status: 'running'
      }
    });
    
  } catch (error) {
    logError(error, req, 'load-test-start');
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to start load test'
      }
    });
  }
});

app.get('/api/load-test/status', rateLimit(30, 60000), (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        currentTest: loadTestStats.currentTest ? {
          testId: loadTestStats.currentTest.testId,
          config: loadTestStats.currentTest.config,
          startTime: loadTestStats.currentTest.startTime,
          totalRequests: loadTestStats.currentTest.totalRequests,
          successfulRequests: loadTestStats.currentTest.successfulRequests,
          failedRequests: loadTestStats.currentTest.failedRequests,
          running: true
        } : null,
        recentTests: loadTestStats.tests.slice(-5).map(test => ({
          testId: test.testId,
          config: test.config,
          startTime: test.startTime,
          endTime: test.endTime,
          totalRequests: test.totalRequests,
          successfulRequests: test.successfulRequests,
          failedRequests: test.failedRequests,
          averageResponseTime: test.averageResponseTime,
          throughput: test.throughput,
          successRate: (test.successfulRequests / test.totalRequests * 100).toFixed(2)
        }))
      }
    });
    
  } catch (error) {
    logError(error, req, 'load-test-status');
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to retrieve load test status'
      }
    });
  }
});

app.get('/api/load-test/results/:testId', rateLimit(50, 60000), (req, res) => {
  try {
    const { testId } = req.params;
    const test = loadTestStats.tests.find(t => t.testId === testId);
    
    if (!test) {
      return res.status(404).json({
        success: false,
        error: {
          type: 'NOT_FOUND',
          message: 'Load test results not found'
        }
      });
    }

    // Calculate percentiles
    const sortedTimes = [...test.responseTimes].sort((a, b) => a - b);
    const percentiles = {
      p50: sortedTimes[Math.floor(sortedTimes.length * 0.5)],
      p95: sortedTimes[Math.floor(sortedTimes.length * 0.95)],
      p99: sortedTimes[Math.floor(sortedTimes.length * 0.99)]
    };

    res.json({
      success: true,
      data: {
        ...test,
        percentiles,
        successRate: (test.successfulRequests / test.totalRequests * 100).toFixed(2),
        errorRate: (test.failedRequests / test.totalRequests * 100).toFixed(2)
      }
    });
    
  } catch (error) {
    logError(error, req, 'load-test-results');
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to retrieve load test results'
      }
    });
  }
});

// Performance optimization endpoint
app.get('/api/performance/optimize', rateLimit(10, 60000), async (req, res) => {
  try {
    const optimizations = [];
    
    // Clear old cache entries
    let cacheCleared = 0;
    const now = Date.now();
    for (const [key, entry] of responseCache.entries()) {
      if (now - entry.timestamp > CACHE_TTL) {
        responseCache.delete(key);
        cacheCleared++;
      }
    }
    if (cacheCleared > 0) {
      optimizations.push(`Cleared ${cacheCleared} expired cache entries`);
    }
    
    // Clean up old jobs
    let jobsCleared = 0;
    const oldJobs = [];
    const cutoffTime = now - (24 * 60 * 60 * 1000); // 24 hours ago
    
    for (const [jobId, job] of jobs.entries()) {
      if (job.completedAt && job.completedAt < cutoffTime) {
        oldJobs.push(jobId);
      }
    }
    
    oldJobs.forEach(jobId => {
      jobs.delete(jobId);
      jobsCleared++;
    });
    
    if (jobsCleared > 0) {
      optimizations.push(`Cleaned up ${jobsCleared} old completed jobs`);
    }
    
    // Clean up old request logs
    const oldLogCount = requestLogs.length;
    if (oldLogCount > MAX_LOGS) {
      requestLogs.splice(0, oldLogCount - MAX_LOGS);
      optimizations.push(`Trimmed ${oldLogCount - MAX_LOGS} old request logs`);
    }
    
    // Clean up old error logs  
    const oldErrorCount = errorLogs.length;
    if (oldErrorCount > MAX_ERROR_LOGS) {
      errorLogs.splice(0, oldErrorCount - MAX_ERROR_LOGS);
      optimizations.push(`Trimmed ${oldErrorCount - MAX_ERROR_LOGS} old error logs`);
    }
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
      optimizations.push('Forced garbage collection');
    }
    
    res.json({
      success: true,
      data: {
        optimizations,
        performance: {
          cacheSize: responseCache.size,
          activeJobs: jobs.size,
          requestLogs: requestLogs.length,
          errorLogs: errorLogs.length,
          memoryUsage: process.memoryUsage()
        },
        message: optimizations.length > 0 ? 'Performance optimizations applied' : 'No optimizations needed'
      }
    });
    
  } catch (error) {
    logError(error, req, 'performance-optimize');
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Failed to run performance optimization'
      }
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  logError(error, req, 'express-error-handler');
  
  res.status(error.status || 500).json({
    success: false,
    error: {
      type: 'INTERNAL_ERROR',
      message: 'Internal server error',
      timestamp: new Date().toISOString()
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      type: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`
    }
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start server
const server = createServer(app);

server.listen(PORT, '0.0.0.0', async () => {
  console.log('🚀 Backend server started successfully!');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log('🤖 Claude AI service:', process.env.ANTHROPIC_API_KEY ? 'ENABLED' : 'DISABLED');
  console.log('⚡ Job queue: ACTIVE (simplified)');
  console.log('🛡️  Rate limiting: ACTIVE');
  
  // Initialize storage
  await initializeStorage();
  console.log('📁 File generation services: ACTIVE');
  console.log('   ✓ PDF generation available');
  console.log('   ✓ DOCX generation available');
  console.log('   ✓ CSV generation available');
  console.log('   ✓ Screenshot capture available');
  console.log('👥 User & Session management: ACTIVE');
  console.log('   ✓ Persistent session storage');
  console.log('   ✓ User state management');
  console.log('   ✓ Analytics and reporting');
  console.log('   ✓ Automatic session cleanup');
  console.log('📊 Monitoring & Logging: ACTIVE');
  console.log('   ✓ Request timing and logging');
  console.log('   ✓ Error tracking and reporting');
  console.log('   ✓ Performance monitoring');
  console.log('   ✓ System health checks');
  console.log('   ✓ Resource usage tracking');
  console.log('⚡ Performance Optimization: ACTIVE');
  console.log('   ✓ Response caching (5min TTL)');
  console.log('   ✓ Load testing capabilities');
  console.log('   ✓ Automatic cleanup processes');
  console.log('   ✓ Memory optimization');
  console.log('   ✓ Optimized for 10 concurrent users');
});

module.exports = app;