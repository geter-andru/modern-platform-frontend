# Render MCP Server

MCP server for managing Render.com deployments and services programmatically.

## Features

- List all Render services
- Get service details and status
- List deployments for services
- Trigger new deployments
- Get service and deployment logs
- Update service configuration
- Suspend/resume services

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp env.example .env
   # Edit .env and add your Render API key
   ```

3. **Get your Render API key:**
   - Go to https://dashboard.render.com/account/api-keys
   - Create a new API key
   - Copy it to your `.env` file

4. **Run the server:**
   ```bash
   npm start
   ```

## Available Tools

### `list_services`
List all Render services in your account.

### `get_service`
Get detailed information about a specific service.

**Parameters:**
- `serviceId` (string): The ID of the service to retrieve

### `list_deployments`
List deployments for a specific service.

**Parameters:**
- `serviceId` (string): The ID of the service

### `get_deployment`
Get details of a specific deployment.

**Parameters:**
- `serviceId` (string): The ID of the service
- `deploymentId` (string): The ID of the deployment

### `trigger_deploy`
Trigger a new deployment for a service.

**Parameters:**
- `serviceId` (string): The ID of the service to deploy
- `clearCache` (boolean, optional): Whether to clear the build cache

### `get_service_logs`
Get logs for a specific service.

**Parameters:**
- `serviceId` (string): The ID of the service
- `limit` (number, optional): Number of log entries to retrieve (default: 100)

### `get_deployment_logs`
Get logs for a specific deployment.

**Parameters:**
- `serviceId` (string): The ID of the service
- `deploymentId` (string): The ID of the deployment

### `update_service`
Update service configuration.

**Parameters:**
- `serviceId` (string): The ID of the service to update
- `updates` (object): Service configuration updates
  - `name` (string): Service name
  - `buildCommand` (string): Build command
  - `startCommand` (string): Start command
  - `rootDir` (string): Root directory
  - `plan` (string): Service plan
  - `region` (string): Service region
  - `branch` (string): Git branch
  - `autoDeploy` (boolean): Auto-deploy setting

### `suspend_service`
Suspend a service.

**Parameters:**
- `serviceId` (string): The ID of the service to suspend

### `resume_service`
Resume a suspended service.

**Parameters:**
- `serviceId` (string): The ID of the service to resume

## Usage Examples

```javascript
// List all services
await callTool('list_services', {});

// Get service details
await callTool('get_service', { serviceId: 'srv-abc123' });

// Trigger a new deployment
await callTool('trigger_deploy', { serviceId: 'srv-abc123', clearCache: true });

// Get service logs
await callTool('get_service_logs', { serviceId: 'srv-abc123', limit: 50 });
```

## Error Handling

The server provides detailed error messages for common issues:
- Invalid API key
- Service not found
- Deployment failures
- Network errors

## Security

- API keys are stored in environment variables
- All requests use HTTPS
- No sensitive data is logged
