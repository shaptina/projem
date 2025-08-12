# MCP (Model Context Protocol) Setup Guide

## 1. MCP Server Kurulumu

### Adım 1: Claude Desktop Config Dosyasını Bulun
Windows'ta config dosyası şu konumda:
```
%APPDATA%\Claude\claude_desktop_config.json
```

### Adım 2: Config Dosyasını Düzenleyin
1. Windows Explorer'da `%APPDATA%\Claude\` klasörüne gidin
2. `claude_desktop_config.json` dosyasını bir text editor ile açın
3. Aşağıdaki MCP server'ları ekleyin

### Adım 3: Temel MCP Server'ları Yükleyin

```bash
# File system access
npm install -g @modelcontextprotocol/server-filesystem

# PostgreSQL database
npm install -g @modelcontextprotocol/server-postgresql

# GitHub integration
npm install -g @modelcontextprotocol/server-github

# Web search
npm install -g @modelcontextprotocol/server-brave-search

# Memory persistence
npm install -g @modelcontextprotocol/server-memory
```

## 2. Projeye Özel MCP Configuration

```json
{
  "mcpServers": {
    "freecad-project": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\kafge\\projem"
      ]
    },
    "database": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgresql",
        "postgresql://postgres:password@localhost:5432/projem"
      ]
    }
  }
}
```

## 3. MCP Server Kullanımı

Claude'da MCP server'ları kullanmak için:

### File System Operations
```
mcp__filesystem__read_file("/path/to/file")
mcp__filesystem__write_file("/path/to/file", "content")
mcp__filesystem__list_directory("/path")
```

### Database Operations
```
mcp__postgresql__query("SELECT * FROM users")
mcp__postgresql__execute("INSERT INTO models (name) VALUES ('test')")
```

### GitHub Operations
```
mcp__github__list_issues()
mcp__github__create_pull_request("title", "body")
mcp__github__get_file_content("path/to/file")
```

## 4. Custom FreeCAD MCP Server

### Kurulum
1. Python dependencies yükleyin:
```bash
pip install asyncio pathlib
```

2. FreeCAD path'i environment variable olarak set edin:
```bash
set FREECAD_PATH=C:\Program Files\FreeCAD\bin
```

3. Config'e ekleyin:
```json
{
  "mcpServers": {
    "freecad": {
      "command": "python",
      "args": ["C:\\Users\\kafge\\projem\\mcp-servers\\freecad_server.py"],
      "env": {
        "FREECAD_PATH": "C:\\Program Files\\FreeCAD\\bin"
      }
    }
  }
}
```

### Kullanım Örnekleri

#### Model Generation
```python
mcp__freecad__generateModel({
  "type": "box",
  "dimensions": {
    "length": 100,
    "width": 50,
    "height": 30
  },
  "format": "stl"
})
```

#### Format Conversion
```python
mcp__freecad__convertFormat({
  "input_file": "model.step",
  "output_format": "stl"
})
```

#### G-code Generation
```python
mcp__freecad__generateGCode({
  "model_file": "part.stl",
  "machine_config": {
    "post_processor": "grbl"
  },
  "tool_config": {
    "diameter": 6,
    "feed_rate": 1000,
    "spindle_speed": 10000
  }
})
```

## 5. Troubleshooting

### MCP Server Görünmüyor
1. Claude'u tamamen kapatıp yeniden açın
2. Config dosyasında syntax hatası olmadığından emin olun
3. `npx` komutunun çalıştığını kontrol edin: `npx --version`

### Connection Error
1. Database/service'in çalıştığından emin olun
2. Connection string'in doğru olduğunu kontrol edin
3. Firewall/antivirus engellemesi olup olmadığını kontrol edin

### Permission Denied
1. File system path'inin doğru olduğundan emin olun
2. Klasör erişim izinlerini kontrol edin
3. Admin olarak Claude'u çalıştırmayı deneyin

## 6. Güvenlik Notları

⚠️ **Önemli Güvenlik Uyarıları:**
- Database connection string'lerinde gerçek şifreleri kullanmayın
- GitHub token'ları environment variable'dan alın
- File system access'i sadece proje klasörüyle sınırlayın
- Production database'e direkt bağlanmaktan kaçının

## 7. Performance Tips

- Büyük file operations için streaming kullanın
- Database query'lerinde pagination kullanın
- Heavy operations için caching implementasyonu yapın
- Resource-intensive operations için rate limiting ekleyin

## 8. Monitoring

MCP server loglarını görmek için:
```bash
# Windows Event Viewer'da Claude logs
eventvwr.msc

# Veya Claude console output'u görmek için Developer Mode'u açın
```

## 9. Useful MCP Servers for Development

- `@modelcontextprotocol/server-docker` - Docker container management
- `@modelcontextprotocol/server-kubernetes` - K8s cluster management  
- `@modelcontextprotocol/server-redis` - Redis cache operations
- `@modelcontextprotocol/server-elasticsearch` - Log analysis
- `@modelcontextprotocol/server-prometheus` - Metrics monitoring
- `@modelcontextprotocol/server-slack` - Team notifications
- `@modelcontextprotocol/server-jira` - Issue tracking

## 10. Example Workflows

### Development Workflow
1. Use filesystem MCP to read/write code
2. Use PostgreSQL MCP to check database state
3. Use GitHub MCP to create commits and PRs
4. Use Docker MCP to manage containers

### Debugging Workflow
1. Use Elasticsearch MCP to analyze logs
2. Use Prometheus MCP to check metrics
3. Use PostgreSQL MCP to query data
4. Use filesystem MCP to update code

### CAD/CAM Workflow
1. Use FreeCAD MCP to generate models
2. Use filesystem MCP to save files
3. Use PostgreSQL MCP to track jobs
4. Use MinIO MCP to store results