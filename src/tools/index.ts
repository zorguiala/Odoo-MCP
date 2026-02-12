import { OdooClient } from "../services/odoo.client.js";
import { commonTools, handleCommonTools } from "./common.js";
import { salesTools, handleSalesTools } from "./sales.js";
import { mrpTools, handleMrpTools } from "./mrp.js";

export const allTools = [
    ...commonTools,
    ...salesTools,
    ...mrpTools,
];

export async function handleCallTool(name: string, args: any, odoo: OdooClient) {
    let result = await handleCommonTools(name, args, odoo);
    if (result) return result;

    result = await handleSalesTools(name, args, odoo);
    if (result) return result;

    result = await handleMrpTools(name, args, odoo);
    if (result) return result;

    throw new Error(`Tool implementation not found for: ${name}`);
}
