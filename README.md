# YearAtAGlance MCP Server

MCP (Model Context Protocol) server for integrating YearAtAGlance calendar with Claude Code and other MCP-compatible AI assistants.

## Installation

```bash
npm install -g @yearataglance/mcp-server
```

Or use directly with npx:

```bash
npx @yearataglance/mcp-server
```

## Configuration

### 1. Get your API Key

1. Go to [YearAtAGlance](https://yearataglance.app)
2. Navigate to Profile > API Keys
3. Create a new API key with the permissions you need
4. Copy the key (it's only shown once!)

### 2. Configure Claude Code

Add to your `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "yearataglance": {
      "command": "npx",
      "args": ["@yearataglance/mcp-server"],
      "env": {
        "YAAG_API_KEY": "your-api-key-here",
        "YAAG_API_URL": "https://yearataglance-backend-production.up.railway.app/api/v1"
      }
    }
  }
}
```

## Available Tools

### Events

| Tool | Description |
|------|-------------|
| `yaag_list_events` | List all events, optionally filtered by year and category |
| `yaag_get_event` | Get details of a specific event |
| `yaag_create_event` | Create a new event |
| `yaag_update_event` | Update an existing event |
| `yaag_delete_event` | Delete an event |
| `yaag_get_heatmap` | Get event density heatmap for a year |

### Categories

| Tool | Description |
|------|-------------|
| `yaag_list_categories` | List all categories |
| `yaag_get_category` | Get details of a specific category |
| `yaag_create_category` | Create a new category |
| `yaag_update_category` | Update an existing category |
| `yaag_delete_category` | Delete a category |

### AI

| Tool | Description |
|------|-------------|
| `yaag_ai_status` | Check AI service status |
| `yaag_ai_create_milestone` | Create event from natural language |
| `yaag_ai_analyze_year` | Get AI analysis of a year's events |
| `yaag_ai_chat` | Chat with AI about your calendar |

## Usage Examples

Once configured, you can use natural language in Claude Code:

```
"Show me all my events for 2025"
"Create an event called 'Team Offsite' from March 10-12"
"What categories do I have?"
"Create a new category called 'Health' with green color"
"Delete the event with ID xyz123"
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `YAAG_API_KEY` | Yes | - | Your YearAtAGlance API key |
| `YAAG_API_URL` | No | Production URL | API base URL |

## Permissions

API keys can have different permissions:

- **read**: List and view events/categories
- **write**: Create, update, delete events/categories
- **ai**: Use AI features (milestone creation, analysis, chat)

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev
```

## License

MIT
