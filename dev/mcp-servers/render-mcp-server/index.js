#!/usr/bin/env node

/**
 * Render MCP Server
 * Provides tools for managing Render.com deployments and services
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class RenderMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'render-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.renderApiKey = process.env.RENDER_API_KEY;
    this.renderBaseUrl = 'https://api.render.com/v1';
    
    if (!this.renderApiKey) {
      console.error('RENDER_API_KEY environment variable is required');
      process.exit(1);
    }

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'list_services',
            description: 'List all Render services',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_service',
            description: 'Get details of a specific Render service',
            inputSchema: {
              type: 'object',
              properties: {
                serviceId: {
                  type: 'string',
                  description: 'The ID of the service to retrieve',
                },
              },
              required: ['serviceId'],
            },
          },
          {
            name: 'list_deployments',
            description: 'List deployments for a specific service',
            inputSchema: {
              type: 'object',
              properties: {
                serviceId: {
                  type: 'string',
                  description: 'The ID of the service to get deployments for',
                },
              },
              required: ['serviceId'],
            },
          },
          {
            name: 'get_deployment',
            description: 'Get details of a specific deployment',
            inputSchema: {
              type: 'object',
              properties: {
                serviceId: {
                  type: 'string',
                  description: 'The ID of the service',
                },
                deploymentId: {
                  type: 'string',
                  description: 'The ID of the deployment',
                },
              },
              required: ['serviceId', 'deploymentId'],
            },
          },
          {
            name: 'trigger_deploy',
            description: 'Trigger a new deployment for a service',
            inputSchema: {
              type: 'object',
              properties: {
                serviceId: {
                  type: 'string',
                  description: 'The ID of the service to deploy',
                },
                clearCache: {
                  type: 'boolean',
                  description: 'Whether to clear the build cache',
                  default: false,
                },
              },
              required: ['serviceId'],
            },
          },
          {
            name: 'get_service_logs',
            description: 'Get logs for a specific service',
            inputSchema: {
              type: 'object',
              properties: {
                serviceId: {
                  type: 'string',
                  description: 'The ID of the service',
                },
                limit: {
                  type: 'number',
                  description: 'Number of log entries to retrieve',
                  default: 100,
                },
              },
              required: ['serviceId'],
            },
          },
          {
            name: 'get_deployment_logs',
            description: 'Get logs for a specific deployment',
            inputSchema: {
              type: 'object',
              properties: {
                serviceId: {
                  type: 'string',
                  description: 'The ID of the service',
                },
                deploymentId: {
                  type: 'string',
                  description: 'The ID of the deployment',
                },
              },
              required: ['serviceId', 'deploymentId'],
            },
          },
          {
            name: 'update_service',
            description: 'Update service configuration',
            inputSchema: {
              type: 'object',
              properties: {
                serviceId: {
                  type: 'string',
                  description: 'The ID of the service to update',
                },
                updates: {
                  type: 'object',
                  description: 'Service configuration updates',
                  properties: {
                    name: { type: 'string' },
                    buildCommand: { type: 'string' },
                    startCommand: { type: 'string' },
                    rootDir: { type: 'string' },
                    plan: { type: 'string' },
                    region: { type: 'string' },
                    branch: { type: 'string' },
                    autoDeploy: { type: 'boolean' },
                  },
                },
              },
              required: ['serviceId', 'updates'],
            },
          },
          {
            name: 'suspend_service',
            description: 'Suspend a service',
            inputSchema: {
              type: 'object',
              properties: {
                serviceId: {
                  type: 'string',
                  description: 'The ID of the service to suspend',
                },
              },
              required: ['serviceId'],
            },
          },
          {
            name: 'resume_service',
            description: 'Resume a suspended service',
            inputSchema: {
              type: 'object',
              properties: {
                serviceId: {
                  type: 'string',
                  description: 'The ID of the service to resume',
                },
              },
              required: ['serviceId'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'list_services':
            return await this.listServices();
          case 'get_service':
            return await this.getService(args.serviceId);
          case 'list_deployments':
            return await this.listDeployments(args.serviceId);
          case 'get_deployment':
            return await this.getDeployment(args.serviceId, args.deploymentId);
          case 'trigger_deploy':
            return await this.triggerDeploy(args.serviceId, args.clearCache);
          case 'get_service_logs':
            return await this.getServiceLogs(args.serviceId, args.limit);
          case 'get_deployment_logs':
            return await this.getDeploymentLogs(args.serviceId, args.deploymentId);
          case 'update_service':
            return await this.updateService(args.serviceId, args.updates);
          case 'suspend_service':
            return await this.suspendService(args.serviceId);
          case 'resume_service':
            return await this.resumeService(args.serviceId);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    try {
      const config = {
        method,
        url: `${this.renderBaseUrl}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${this.renderApiKey}`,
          'Content-Type': 'application/json',
        },
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`Render API Error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
      }
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  async listServices() {
    const services = await this.makeRequest('/services');
    return {
      content: [
        {
          type: 'text',
          text: `Found ${services.length} services:\n\n${services.map(service => 
            `• ${service.name} (${service.id})\n  Type: ${service.type}\n  Status: ${service.serviceDetails?.buildStatus || 'Unknown'}\n  URL: ${service.serviceDetails?.url || 'N/A'}\n`
          ).join('\n')}`,
        },
      ],
    };
  }

  async getService(serviceId) {
    const service = await this.makeRequest(`/services/${serviceId}`);
    return {
      content: [
        {
          type: 'text',
          text: `Service Details:\n\n` +
            `Name: ${service.name}\n` +
            `ID: ${service.id}\n` +
            `Type: ${service.type}\n` +
            `Status: ${service.serviceDetails?.buildStatus || 'Unknown'}\n` +
            `URL: ${service.serviceDetails?.url || 'N/A'}\n` +
            `Region: ${service.region}\n` +
            `Plan: ${service.plan}\n` +
            `Branch: ${service.branch}\n` +
            `Auto Deploy: ${service.autoDeploy ? 'Yes' : 'No'}\n` +
            `Root Directory: ${service.rootDir || 'N/A'}\n` +
            `Build Command: ${service.buildCommand || 'N/A'}\n` +
            `Start Command: ${service.startCommand || 'N/A'}`,
        },
      ],
    };
  }

  async listDeployments(serviceId) {
    const deployments = await this.makeRequest(`/services/${serviceId}/deploys`);
    return {
      content: [
        {
          type: 'text',
          text: `Found ${deployments.length} deployments:\n\n${deployments.map(deploy => 
            `• ${deploy.id}\n  Status: ${deploy.status}\n  Created: ${new Date(deploy.createdAt).toLocaleString()}\n  Commit: ${deploy.commit?.message || 'N/A'}\n`
          ).join('\n')}`,
        },
      ],
    };
  }

  async getDeployment(serviceId, deploymentId) {
    const deployment = await this.makeRequest(`/services/${serviceId}/deploys/${deploymentId}`);
    return {
      content: [
        {
          type: 'text',
          text: `Deployment Details:\n\n` +
            `ID: ${deployment.id}\n` +
            `Status: ${deployment.status}\n` +
            `Created: ${new Date(deployment.createdAt).toLocaleString()}\n` +
            `Updated: ${new Date(deployment.updatedAt).toLocaleString()}\n` +
            `Commit: ${deployment.commit?.message || 'N/A'}\n` +
            `Commit SHA: ${deployment.commit?.id || 'N/A'}\n` +
            `Build Command: ${deployment.buildCommand || 'N/A'}\n` +
            `Start Command: ${deployment.startCommand || 'N/A'}`,
        },
      ],
    };
  }

  async triggerDeploy(serviceId, clearCache = false) {
    const data = clearCache ? { clearCache: true } : {};
    const deployment = await this.makeRequest(`/services/${serviceId}/deploys`, 'POST', data);
    return {
      content: [
        {
          type: 'text',
          text: `Deployment triggered successfully!\n\n` +
            `Deployment ID: ${deployment.id}\n` +
            `Status: ${deployment.status}\n` +
            `Created: ${new Date(deployment.createdAt).toLocaleString()}`,
        },
      ],
    };
  }

  async getServiceLogs(serviceId, limit = 100) {
    const logs = await this.makeRequest(`/services/${serviceId}/logs?limit=${limit}`);
    return {
      content: [
        {
          type: 'text',
          text: `Service Logs (last ${limit} entries):\n\n${logs.map(log => 
            `[${new Date(log.timestamp).toLocaleString()}] ${log.level}: ${log.message}`
          ).join('\n')}`,
        },
      ],
    };
  }

  async getDeploymentLogs(serviceId, deploymentId) {
    const logs = await this.makeRequest(`/services/${serviceId}/deploys/${deploymentId}/logs`);
    return {
      content: [
        {
          type: 'text',
          text: `Deployment Logs:\n\n${logs.map(log => 
            `[${new Date(log.timestamp).toLocaleString()}] ${log.level}: ${log.message}`
          ).join('\n')}`,
        },
      ],
    };
  }

  async updateService(serviceId, updates) {
    const service = await this.makeRequest(`/services/${serviceId}`, 'PATCH', updates);
    return {
      content: [
        {
          type: 'text',
          text: `Service updated successfully!\n\n` +
            `Name: ${service.name}\n` +
            `ID: ${service.id}\n` +
            `Status: ${service.serviceDetails?.buildStatus || 'Unknown'}`,
        },
      ],
    };
  }

  async suspendService(serviceId) {
    await this.makeRequest(`/services/${serviceId}/suspend`, 'POST');
    return {
      content: [
        {
          type: 'text',
          text: `Service ${serviceId} suspended successfully!`,
        },
      ],
    };
  }

  async resumeService(serviceId) {
    await this.makeRequest(`/services/${serviceId}/resume`, 'POST');
    return {
      content: [
        {
          type: 'text',
          text: `Service ${serviceId} resumed successfully!`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Render MCP server running on stdio');
  }
}

const server = new RenderMCPServer();
server.run().catch(console.error);
