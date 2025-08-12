@echo off
echo Setting up MCP servers for FreeCAD CAD/CAM Project...
echo.

REM Filesystem access for project directory
echo Adding filesystem server...
claude mcp add --transport stdio filesystem npx -y @modelcontextprotocol/server-filesystem C:\Users\kafge\projem

REM PostgreSQL database
echo Adding PostgreSQL server...
claude mcp add --transport stdio postgresql npx -y @modelcontextprotocol/server-postgresql postgresql://postgres:password@localhost:5432/projem

REM GitHub integration (requires GITHUB_TOKEN env var)
echo Adding GitHub server...
claude mcp add --transport stdio github npx -y @modelcontextprotocol/server-github

REM Brave Search (requires BRAVE_API_KEY env var)
echo Adding Brave Search server...
claude mcp add --transport stdio brave-search npx -y @modelcontextprotocol/server-brave-search

REM Memory persistence
echo Adding memory server...
claude mcp add --transport stdio memory npx -y @modelcontextprotocol/server-memory

echo.
echo MCP servers setup complete!
echo Run 'claude mcp list' to see all configured servers.
pause