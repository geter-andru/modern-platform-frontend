#!/usr/bin/env node

/**
 * Puppeteer MCP Server for H&S Revenue Intelligence Platform
 * Provides web automation capabilities for Claude Code
 * 
 * This is a wrapper that runs the @hisma/server-puppeteer directly
 */

// Run the Hisma Puppeteer MCP server directly
require('./node_modules/@hisma/server-puppeteer/dist/index.js');