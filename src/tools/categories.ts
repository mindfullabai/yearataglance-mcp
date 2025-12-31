/**
 * Category-related MCP tools
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { YearAtAGlanceClient } from "../client/api.js";

export const categoryTools: Tool[] = [
  {
    name: "yaag_list_categories",
    description: "List all categories in the YearAtAGlance calendar",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "yaag_get_category",
    description: "Get details of a specific category by its ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        categoryId: {
          type: "string",
          description: "The ID of the category to retrieve",
        },
      },
      required: ["categoryId"],
    },
  },
  {
    name: "yaag_create_category",
    description: "Create a new category for organizing events",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: {
          type: "string",
          description: "Category name (e.g., Work, Personal, Health)",
        },
        color: {
          type: "string",
          description: "Category color in hex format (e.g., #FF5733)",
        },
        description: {
          type: "string",
          description: "Category description (optional)",
        },
      },
      required: ["name", "color"],
    },
  },
  {
    name: "yaag_update_category",
    description: "Update an existing category",
    inputSchema: {
      type: "object" as const,
      properties: {
        categoryId: {
          type: "string",
          description: "The ID of the category to update",
        },
        name: {
          type: "string",
          description: "New category name",
        },
        color: {
          type: "string",
          description: "New category color in hex format",
        },
        description: {
          type: "string",
          description: "New category description",
        },
      },
      required: ["categoryId"],
    },
  },
  {
    name: "yaag_delete_category",
    description:
      "Delete a category. Events in this category will become uncategorized.",
    inputSchema: {
      type: "object" as const,
      properties: {
        categoryId: {
          type: "string",
          description: "The ID of the category to delete",
        },
      },
      required: ["categoryId"],
    },
  },
];

export async function handleCategoryTool(
  client: YearAtAGlanceClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "yaag_list_categories":
      return client.listCategories();

    case "yaag_get_category":
      return client.getCategory(args.categoryId as string);

    case "yaag_create_category":
      return client.createCategory({
        name: args.name as string,
        color: args.color as string,
        description: args.description as string | undefined,
      });

    case "yaag_update_category": {
      const { categoryId, ...updates } = args;
      return client.updateCategory(categoryId as string, updates);
    }

    case "yaag_delete_category":
      return client.deleteCategory(args.categoryId as string);

    default:
      throw new Error(`Unknown category tool: ${toolName}`);
  }
}
