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

### Setup

1.  **Clone or Download** this repository.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Build the project**:
    ```bash
    npm run build
    ```
    *(Note: You may need to add a build script to package.json first: `"build": "tsc"`)

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