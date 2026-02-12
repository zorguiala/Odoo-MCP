import { config } from "dotenv";

// Manual override for testing if env vars are present
if (process.argv[2]) process.env.ODOO_URL = process.argv[2];
if (process.argv[3]) process.env.ODOO_DB = process.argv[3];
if (process.argv[4]) process.env.ODOO_USERNAME = process.argv[4];
if (process.argv[5]) process.env.ODOO_PASSWORD = process.argv[5];

async function test() {
    // Dynamic import to ensure env vars are set BEFORE config.ts validation runs
    // Note: In compiled JS (dist), this path must be relative to test-connection.js
    const { OdooClient } = await import("./services/odoo.client.js");

    console.log("Testing Odoo Connection...");
    console.log(`URL: ${process.env.ODOO_URL}`);
    console.log(`DB: ${process.env.ODOO_DB}`);
    console.log(`User: ${process.env.ODOO_USERNAME}`);

    try {
        const client = new OdooClient();
        console.log("Authenticating...");
        const uid = await client.authenticate();
        console.log(`Successfully authenticated! User ID: ${uid}`);

        console.log("Reading user details...");
        const user = await client.execute_kw("res.users", "read", [[uid]], {
            fields: ["name", "email", "login"]
        });
        console.log("User Details:", user);

    } catch (error) {
        console.error("Connection Failed:", error);
        process.exit(1);
    }
}

test();
