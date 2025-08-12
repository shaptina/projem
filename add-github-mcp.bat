@echo off
echo Adding GitHub MCP server...
echo.
echo NOTE: You need to set GITHUB_TOKEN environment variable first!
echo Example: set GITHUB_TOKEN=your_github_personal_access_token
echo.

REM Add GitHub MCP server with environment variable
claude mcp add --transport stdio --env GITHUB_TOKEN github npx @modelcontextprotocol/server-github

echo.
echo GitHub MCP server added!
echo Make sure to set GITHUB_TOKEN environment variable.
pause