#!/usr/bin/env node

/**
 * YearAtAGlance MCP Server
 *
 * Provides MCP tools for interacting with YearAtAGlance calendar
 * from Claude Code and other MCP-compatible clients.
 *
 * Environment variables:
 * - YAAG_API_KEY: Your YearAtAGlance API key (required)
 * - YAAG_API_URL: API URL (default: https://yearataglance-backend-production.up.railway.app/api/v1)
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { YearAtAGlanceClient } from "./client/api.js";
import {
  allTools,
  handleEventTool,
  handleCategoryTool,
  handleAITool,
  eventTools,
  categoryTools,
  aiTools,
} from "./tools/index.js";

// Configuration from environment
const API_KEY = process.env.YAAG_API_KEY;
const API_URL =
  process.env.YAAG_API_URL ||
  "https://yearataglance-backend-production.up.railway.app/api/v1";

if (!API_KEY) {
  console.error("Error: YAAG_API_KEY environment variable is required");
  console.error(
    "Get your API key from: https://yearataglance.app/profile > API Keys"
  );
  process.exit(1);
}

// Create API client
const client = new YearAtAGlanceClient(API_URL, API_KEY);

// Create MCP server
const server = new Server(
  {
    name: "yearataglance",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: allTools,
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: unknown;

    // Route to appropriate handler based on tool prefix
    const eventToolNames = eventTools.map((t) => t.name);
    const categoryToolNames = categoryTools.map((t) => t.name);
    const aiToolNames = aiTools.map((t) => t.name);

    if (eventToolNames.includes(name)) {
      result = await handleEventTool(
        client,
        name,
        (args as Record<string, unknown>) || {}
      );
    } else if (categoryToolNames.includes(name)) {
      result = await handleCategoryTool(
        client,
        name,
        (args as Record<string, unknown>) || {}
      );
    } else if (aiToolNames.includes(name)) {
      result = await handleAITool(
        client,
        name,
        (args as Record<string, unknown>) || {}
      );
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: errorMessage }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("YearAtAGlance MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
