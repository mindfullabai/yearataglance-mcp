/**
 * Export all MCP tools
 */

export { eventTools, handleEventTool } from "./events.js";
export { categoryTools, handleCategoryTool } from "./categories.js";
export { aiTools, handleAITool } from "./ai.js";

import { eventTools } from "./events.js";
import { categoryTools } from "./categories.js";
import { aiTools } from "./ai.js";

export const allTools = [...eventTools, ...categoryTools, ...aiTools];
