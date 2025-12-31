/**
 * Event-related MCP tools
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { YearAtAGlanceClient } from "../client/api.js";

export const eventTools: Tool[] = [
  {
    name: "yaag_list_events",
    description:
      "List all events from YearAtAGlance calendar. Optionally filter by year and/or category.",
    inputSchema: {
      type: "object" as const,
      properties: {
        year: {
          type: "number",
          description: "Filter events by year (e.g., 2025)",
        },
        categoryId: {
          type: "string",
          description: "Filter events by category ID",
        },
      },
    },
  },
  {
    name: "yaag_get_event",
    description: "Get details of a specific event by its ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        eventId: {
          type: "string",
          description: "The ID of the event to retrieve",
        },
      },
      required: ["eventId"],
    },
  },
  {
    name: "yaag_create_event",
    description:
      "Create a new event in the YearAtAGlance calendar. Dates should be in ISO 8601 format.",
    inputSchema: {
      type: "object" as const,
      properties: {
        title: {
          type: "string",
          description: "Event title",
        },
        startDate: {
          type: "string",
          description: "Start date in ISO 8601 format (e.g., 2025-01-15)",
        },
        endDate: {
          type: "string",
          description: "End date in ISO 8601 format (e.g., 2025-01-15)",
        },
        description: {
          type: "string",
          description: "Event description (optional)",
        },
        categoryId: {
          type: "string",
          description: "Category ID to assign the event to (optional)",
        },
        allDay: {
          type: "boolean",
          description: "Whether this is an all-day event (default: true)",
        },
      },
      required: ["title", "startDate", "endDate"],
    },
  },
  {
    name: "yaag_update_event",
    description: "Update an existing event",
    inputSchema: {
      type: "object" as const,
      properties: {
        eventId: {
          type: "string",
          description: "The ID of the event to update",
        },
        title: {
          type: "string",
          description: "New event title",
        },
        startDate: {
          type: "string",
          description: "New start date in ISO 8601 format",
        },
        endDate: {
          type: "string",
          description: "New end date in ISO 8601 format",
        },
        description: {
          type: "string",
          description: "New event description",
        },
        categoryId: {
          type: "string",
          description: "New category ID",
        },
        allDay: {
          type: "boolean",
          description: "Whether this is an all-day event",
        },
      },
      required: ["eventId"],
    },
  },
  {
    name: "yaag_delete_event",
    description: "Delete an event from the calendar",
    inputSchema: {
      type: "object" as const,
      properties: {
        eventId: {
          type: "string",
          description: "The ID of the event to delete",
        },
      },
      required: ["eventId"],
    },
  },
  {
    name: "yaag_get_heatmap",
    description:
      "Get heatmap data showing event density for each day of a year",
    inputSchema: {
      type: "object" as const,
      properties: {
        year: {
          type: "number",
          description: "The year to get heatmap data for (e.g., 2025)",
        },
      },
      required: ["year"],
    },
  },
];

export async function handleEventTool(
  client: YearAtAGlanceClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "yaag_list_events":
      return client.listEvents(
        args.year as number | undefined,
        args.categoryId as string | undefined
      );

    case "yaag_get_event":
      return client.getEvent(args.eventId as string);

    case "yaag_create_event":
      return client.createEvent({
        title: args.title as string,
        startDate: args.startDate as string,
        endDate: args.endDate as string,
        description: args.description as string | undefined,
        categoryId: args.categoryId as string | undefined,
        allDay: (args.allDay as boolean) ?? true,
      });

    case "yaag_update_event": {
      const { eventId, ...updates } = args;
      return client.updateEvent(eventId as string, updates);
    }

    case "yaag_delete_event":
      return client.deleteEvent(args.eventId as string);

    case "yaag_get_heatmap":
      return client.getHeatmap(args.year as number);

    default:
      throw new Error(`Unknown event tool: ${toolName}`);
  }
}
