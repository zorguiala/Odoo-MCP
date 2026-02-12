# Odoo MCP Server

An standard MCP Server that connects your AI agent (like Claude) to your Odoo ERP instance. This allows the AI to search, read, write, and execute workflows within Odoo using natural language.

## Features

- **Core Odoo Operations**: `search_read`, `write`, `create`, `inspect_model`.
- **Sales Workflow**: `odoo_sales_create_van_load` (Warehouse -> Van Transfer).
- **Manufacturing Workflow**: `odoo_mrp_create_custom_bom` (Dynamic BOM generation).
- **Secure**: Uses XML-RPC with environment variable configuration.

## Installation

### Prerequisites

- Node.js (v18 or higher)
- An Odoo instance (v14+ recommended)

### Option 1: Direct Use (via npx)
*Coming soon to npm! Once published, you can use:*
```json
{
  "mcpServers": {
    "odoo": {
      "command": "npx",
      "args": ["-y", "@zorgui/odoo-mcp"],
      "env": { ... }
    }
  }
}
```

### Option 2: Install from Git (Recommended)
Since the package is hosted on GitHub, you can install it globally directly:

```bash
npm install -g git+https://github.com/zorguiala/Odoo-MCP.git
```

Then configure Claude Desktop:

```json
{
  "mcpServers": {
    "odoo": {
      "command": "odoo-mcp", 
      "env": { ... }
    }
  }
}
```

### Option 3: Local Development
1.  **Clone** this repository.
2.  **Install & Build**: `npm install && npm run build`
3.  **Use**: Point Claude to the local `dist/index.js`.


### Configuration

Create a `.env` file in the root directory (or configure your MCP client environment variables directly):

```env
ODOO_URL=https://your-odoo-instance.com
ODOO_DB=your-database-name
ODOO_USERNAME=your-username
ODOO_PASSWORD=your-api-key-or-password
```

## Usage with Claude Desktop

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "odoo": {
      "command": "node",
      "args": ["/path/to/odoo-mcp/dist/index.js"],
      "env": {
        "ODOO_URL": "https://your-odoo-instance.com",
        "ODOO_DB": "your-database-name",
        "ODOO_USERNAME": "your-username", // Use User ID or Email
        "ODOO_PASSWORD": "your-password" // Use API Key if using 2FA
      }
    }
  }
}
```

## Available Tools

-   **odoo_search_read**: Search for records and read specific fields.
    -   *Example*: "Find partners in the US."
-   **odoo_write**: Update records.
    -   *Example*: "Update the email of partner ID 5."
-   **odoo_create**: Create new records.
    -   *Example*: "Create a new contact named John Doe."
-   **odoo_inspect_model**: View fields of a model to understand its structure.
    -   *Example*: "Show me fields of stock.picking."
-   **odoo_sales_create_van_load**: Create an internal transfer for van sales.
    -   *Example*: "Load 50 units of Product X to the Van location for Agent Y."
-   **odoo_mrp_create_custom_bom**: Create a dynamic/custom BOM for a production order.
    -   *Example*: "Create a one-off BOM for 100 units of Product Z with these components..."