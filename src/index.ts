#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { config } from "dotenv";
import { OdooClient } from "./services/odoo.client.js";
import { allTools, handleCallTool } from "./tools/index.js";

// Load environment variables
config();

const server = new Server(
    {
        name: "odoo-mcp-server",
        version: "0.1.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

const odooClient = new OdooClient();

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: allTools,
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    return handleCallTool(request.params.name, request.params.arguments, odooClient);
});

server.onerror = (error) => console.error("[MCP Error]", error);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Odoo MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main loop:", error);
    process.exit(1);
});
