/**
 * AI-related MCP tools
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { YearAtAGlanceClient } from "../client/api.js";

export const aiTools: Tool[] = [
  {
    name: "yaag_ai_status",
    description: "Check the status of the AI service in YearAtAGlance",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "yaag_ai_create_milestone",
    description:
      "Use AI to create an event from natural language input. Example: 'My birthday on March 15th' or 'Team offsite next week'",
    inputSchema: {
      type: "object" as const,
      properties: {
        input: {
          type: "string",
          description:
            "Natural language description of the event to create (e.g., 'Vacation in Italy from July 10 to July 20')",
        },
        year: {
          type: "number",
          description:
            "Target year for the event (defaults to current year if not specified)",
        },
      },
      required: ["input"],
    },
  },
  {
    name: "yaag_ai_analyze_year",
    description:
      "Get AI-powered analysis and insights for a specific year's events",
    inputSchema: {
      type: "object" as const,
      properties: {
        year: {
          type: "number",
          description: "The year to analyze (e.g., 2025)",
        },
      },
      required: ["year"],
    },
  },
  {
    name: "yaag_ai_chat",
    description:
      "Chat with the AI assistant about your calendar, events, and schedule",
    inputSchema: {
      type: "object" as const,
      properties: {
        message: {
          type: "string",
          description: "Your message or question for the AI assistant",
        },
        conversationId: {
          type: "string",
          description:
            "Optional conversation ID to continue a previous conversation",
        },
      },
      required: ["message"],
    },
  },
];

export async function handleAITool(
  client: YearAtAGlanceClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "yaag_ai_status":
      return client.getAIStatus();

    case "yaag_ai_create_milestone":
      return client.createMilestone(
        args.input as string,
        args.year as number | undefined
      );

    case "yaag_ai_analyze_year":
      return client.analyzeYear(args.year as number);

    case "yaag_ai_chat":
      return client.chat(
        args.message as string,
        args.conversationId as string | undefined
      );

    default:
      throw new Error(`Unknown AI tool: ${toolName}`);
  }
}
