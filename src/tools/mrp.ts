import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { OdooClient } from "../services/odoo.client.js";

const GenerateBomSchema = z.object({
    product_tmpl_id: z.number().describe("Product Template ID to produce"),
    product_qty: z.number().describe("Quantity to produce"),
    components: z.array(z.object({
        product_id: z.number(),
        qty: z.number()
    })).describe("List of raw materials/components"),
    routing_id: z.number().optional().describe("Routing/Workcenter ID (if applicable)")
});

export const mrpTools = [
    {
        name: "odoo_mrp_create_custom_bom",
        description: "Create a custom/dynamic BOM for a specific production run",
        inputSchema: zodToJsonSchema(GenerateBomSchema) as any
    }
];

export async function handleMrpTools(name: string, args: any, odoo: OdooClient) {
    if (name === "odoo_mrp_create_custom_bom") {
        const { product_tmpl_id, product_qty, components, routing_id } = GenerateBomSchema.parse(args);

        // Create a new BOM referencing the product
        // We set type to 'normal' (Manufacture this product)
        const bomId = await odoo.execute_kw("mrp.bom", "create", [{
            product_tmpl_id: product_tmpl_id,
            product_qty: product_qty, // Reference quantity for the BOM
            type: "normal",
            code: `Custom BOM ${new Date().toISOString()}`,
            bom_line_ids: components.map(c => [0, 0, {
                product_id: c.product_id,
                product_qty: c.qty
            }])
        }]);

        return {
            content: [{ type: "text", text: JSON.stringify({ bom_id: bomId, status: "created" }, null, 2) }]
        };
    }
    return null;
}
