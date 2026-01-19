import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import shell_tool from "./tools/shell_tool.js";
import web_search_tool from "./tools/web_search.js";
import simple_calculate from "./tools/simple_calculate.js";

const server = new McpServer({
  name: "girlfriend-ability",
  version: "0.1.0",
});

server.registerTool(
  "shell",
  {
    title: "Execute a shell command",
    inputSchema: {
      command: z.string(),
      timeout: z.number().optional(),
      maxBuffer: z.number().optional(),
    },
  },
  async ({ command, timeout, maxBuffer }) => {
    const output = await shell_tool(command, timeout, maxBuffer);
    return {
      content: [{ type: "text", text: output }],
    };
  }
);

server.registerTool(
  "web_search",
  {
    title: "Web knowledge lookup",
    description:
      "Use this tool when factual knowledge or external information is required. " +
      "Returns a concise summary, related concepts, and known limitations.",
    inputSchema: {
      keywords: z.string(),
      lang: z.string().optional().default("us-en"),
    },
  },
  async ({ keywords, lang }) => {
    const result = await web_search_tool(keywords, lang);
    return {
      content: [{ type: "json", data: result }],
    };
  }
);

server.registerTool(
  "simple_calculate",
  {
    title: "Simple mathematical expression calculator",
    description:
      "Use this tool to evaluate simple mathematical expressions. " +
      "Supports addition, subtraction, multiplication, division, exponentiation, and parentheses.",
    inputSchema: {
      expression: z.string(),
    },
  },
  async ({ expression }) => {
    const result = await simple_calculate(expression);
    return {
      content: [{ type: "text", text: result }],
    };
  }
);

await server.connect(new StdioServerTransport());
