import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { OdooClient } from "../services/odoo.client.js";

const CreateVanLoadSchema = z.object({
    salesperson_id: z.number().describe("ID of the salesperson (res.users)"),
    location_src_id: z.number().describe("Source location ID (Warehouse)"),
    location_dest_id: z.number().describe("Destination location ID (Van)"),
    products: z.array(z.object({
        product_id: z.number(),
        quantity: z.number()
    })).describe("List of products to load")
});

export const salesTools = [
    {
        name: "odoo_sales_create_van_load",
        description: "Create a stock transfer for a van sales round",
        inputSchema: zodToJsonSchema(CreateVanLoadSchema) as any
    }
];

export async function handleSalesTools(name: string, args: any, odoo: OdooClient) {
    if (name === "odoo_sales_create_van_load") {
        const { salesperson_id, location_src_id, location_dest_id, products } = CreateVanLoadSchema.parse(args);

        // 1. Get Picking Type for Internal Transfer
        // We assume the standard 'Internal Transfers' type exists for the warehouse.
        // For simplicity, we search for a picking type with code 'internal'.
        const pickingTypes = await odoo.execute_kw("stock.picking.type", "search_read", [[
            ["code", "=", "internal"]
        ]], { limit: 1, fields: ["id"] });

        if (!pickingTypes || pickingTypes.length === 0) {
            throw new Error("Could not find an Internal Transfer picking type.");
        }
        const picking_type_id = pickingTypes[0].id;

        // 2. Create the Stock Picking
        const pickingId = await odoo.execute_kw("stock.picking", "create", [{
            picking_type_id: picking_type_id,
            location_id: location_src_id,
            location_dest_id: location_dest_id,
            origin: `Van Load - User ${salesperson_id}`,
            move_ids_without_package: products.map(p => ({
                name: "Van Load",
                product_id: p.product_id,
                product_uom_qty: p.quantity,
                location_id: location_src_id,
                location_dest_id: location_dest_id,
            }))
        }]);

        // 3. Confirm the picking (Mark as Todo / Reserved)
        // Note: We don't force validate immediately to allow the user to check physically,
        // but the prompt implied "Morning Door-to-Door Sales... Printed as bon de sortie".
        // Usually, you validate it to print it.
        // Let's action_confirm it.
        await odoo.execute_kw("stock.picking", "action_confirm", [[pickingId]]);

        return {
            content: [{ type: "text", text: JSON.stringify({ picking_id: pickingId, status: "confirmed" }, null, 2) }]
        };
    }
    return null;
}
