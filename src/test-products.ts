import { config } from "dotenv";

// Manual override for testing if env vars are present
if (process.argv[2]) process.env.ODOO_URL = process.argv[2];
if (process.argv[3]) process.env.ODOO_DB = process.argv[3];
if (process.argv[4]) process.env.ODOO_USERNAME = process.argv[4];
if (process.argv[5]) process.env.ODOO_PASSWORD = process.argv[5];

async function test() {
    const { OdooClient } = await import("./services/odoo.client.js");

    console.log("Connecting to Odoo...");
    try {
        const client = new OdooClient();
        await client.authenticate();

        console.log("Fetching Products (limit 5)...");
        // Simulating: odoo_search_read { model: "product.product", limit: 5, fields: ["name", "default_code", "list_price"] }
        const products = await client.execute_kw("product.product", "search_read", [[]], {
            fields: ["name", "default_code", "list_price", "qty_available"],
            limit: 5
        });

        console.log("Found Products:");
        console.table(products);

    } catch (error) {
        console.error("Failed:", error);
        process.exit(1);
    }
}

test();
