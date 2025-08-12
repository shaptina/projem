# MCP Docker Setup Guide (2025 Update)

## 🐳 Docker-based MCP Servers

As of 2025, many MCP servers have transitioned from npm packages to Docker images for better isolation and security.

## Current MCP Server Configuration

### ✅ Active Servers

1. **GitHub** (Docker)
```bash
claude mcp add-json github '{
  "command": "docker",
  "args": [
    "run", "--rm", "-i",
    "-e", "GITHUB_PERSONAL_ACCESS_TOKEN=your-token",
    "ghcr.io/github/github-mcp-server"
  ]
}'
```

2. **Context7** (HTTP)
```bash
claude mcp add --transport http context7 https://mcp.context7.com/mcp
```

3. **Memory** (npm - still supported)
```bash
claude mcp add --transport stdio memory npx @modelcontextprotocol/server-memory
```

4. **Filesystem** (npm - still supported)
```bash
claude mcp add --transport stdio filesystem npx @modelcontextprotocol/server-filesystem "C:/Users/kafge/projem"
```

## 🆕 Recommended Docker-based MCP Servers for Your Project

### PostgreSQL Database (Docker)
```bash
claude mcp add-json postgresql '{
  "command": "docker",
  "args": [
    "run", "--rm", "-i",
    "--network", "host",
    "-e", "DATABASE_URL=postgresql://postgres:password@localhost:5432/projem",
    "ghcr.io/modelcontextprotocol/server-postgresql"
  ]
}'
```

### Redis Cache (Docker)
```bash
claude mcp add-json redis '{
  "command": "docker",
  "args": [
    "run", "--rm", "-i",
    "--network", "host",
    "-e", "REDIS_URL=redis://localhost:6379",
    "ghcr.io/modelcontextprotocol/server-redis"
  ]
}'
```

### MinIO/S3 Storage (Docker)
```bash
claude mcp add-json minio '{
  "command": "docker",
  "args": [
    "run", "--rm", "-i",
    "--network", "host",
    "-e", "S3_ENDPOINT=http://localhost:9000",
    "-e", "AWS_ACCESS_KEY_ID=minioadmin",
    "-e", "AWS_SECRET_ACCESS_KEY=minioadmin",
    "ghcr.io/modelcontextprotocol/server-s3"
  ]
}'
```

### Elasticsearch Logs (Docker)
```bash
claude mcp add-json elasticsearch '{
  "command": "docker",
  "args": [
    "run", "--rm", "-i",
    "--network", "host",
    "-e", "ELASTICSEARCH_URL=http://localhost:9200",
    "ghcr.io/modelcontextprotocol/server-elasticsearch"
  ]
}'
```

### Prometheus Metrics (Docker)
```bash
claude mcp add-json prometheus '{
  "command": "docker",
  "args": [
    "run", "--rm", "-i",
    "--network", "host",
    "-e", "PROMETHEUS_URL=http://localhost:9090",
    "ghcr.io/modelcontextprotocol/server-prometheus"
  ]
}'
```

### Docker Management (Docker-in-Docker)
```bash
claude mcp add-json docker '{
  "command": "docker",
  "args": [
    "run", "--rm", "-i",
    "-v", "/var/run/docker.sock:/var/run/docker.sock",
    "ghcr.io/modelcontextprotocol/server-docker"
  ]
}'
```

## 🔧 Custom FreeCAD MCP Server (Docker)

Create a custom Docker image for FreeCAD:

### Dockerfile
```dockerfile
FROM continuumio/miniconda3

# Install FreeCAD
RUN conda install -c conda-forge freecad

# Copy MCP server script
COPY freecad_mcp_server.py /app/

# Install Python dependencies
RUN pip install asyncio aiohttp

WORKDIR /app

CMD ["python", "freecad_mcp_server.py"]
```

### Build and Run
```bash
# Build image
docker build -t freecad-mcp-server .

# Add to Claude
claude mcp add-json freecad '{
  "command": "docker",
  "args": [
    "run", "--rm", "-i",
    "-v", "C:/Users/kafge/projem/cad-files:/data",
    "freecad-mcp-server"
  ]
}'
```

## 🛠️ Troubleshooting Docker MCP Servers

### Common Issues and Solutions

1. **Docker not running**
```bash
# Windows
Start-Service Docker

# or start Docker Desktop manually
```

2. **Network connectivity issues**
```bash
# Use host network mode
--network host

# Or expose specific ports
-p 5432:5432
```

3. **Permission issues**
```bash
# Run with user permissions
--user $(id -u):$(id -g)
```

4. **Image pull failures**
```bash
# Login to GitHub Container Registry
docker login ghcr.io -u USERNAME -p TOKEN

# Pull image manually
docker pull ghcr.io/github/github-mcp-server
```

## 📋 MCP Server Management Commands

```bash
# List all servers
claude mcp list

# Get server details
claude mcp get <server-name>

# Remove a server
claude mcp remove <server-name> -s local

# Test server connection
docker run --rm ghcr.io/github/github-mcp-server --test

# View server logs
docker logs <container-id>
```

## 🔒 Security Best Practices

1. **Use secrets management**
   - Never hardcode tokens in commands
   - Use Docker secrets or environment files
   
2. **Network isolation**
   - Use custom Docker networks
   - Limit exposed ports
   
3. **Image verification**
   - Only use official images
   - Verify image signatures
   
4. **Resource limits**
```bash
--memory="1g" --cpus="0.5"
```

## 📊 Monitoring MCP Servers

```bash
# Check resource usage
docker stats

# View running containers
docker ps

# Inspect container
docker inspect <container-id>
```

## 🚀 Quick Setup Script

```bash
#!/bin/bash
# setup-mcp-docker.sh

echo "Setting up Docker-based MCP servers..."

# GitHub
claude mcp add-json github '{"command":"docker","args":["run","--rm","-i","-e","GITHUB_PERSONAL_ACCESS_TOKEN='$GITHUB_TOKEN'","ghcr.io/github/github-mcp-server"]}'

# PostgreSQL
claude mcp add-json postgresql '{"command":"docker","args":["run","--rm","-i","--network","host","-e","DATABASE_URL='$DATABASE_URL'","ghcr.io/modelcontextprotocol/server-postgresql"]}'

# Redis
claude mcp add-json redis '{"command":"docker","args":["run","--rm","-i","--network","host","-e","REDIS_URL=redis://localhost:6379","ghcr.io/modelcontextprotocol/server-redis"]}'

echo "MCP servers configured!"
claude mcp list
```