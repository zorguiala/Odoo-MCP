import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { OdooClient } from "../services/odoo.client.js";

const SearchReadSchema = z.object({
    model: z.string().describe("The Odoo model to search (e.g., 'res.partner')"),
    domain: z.array(z.array(z.any())).describe("The search domain (e.g., [['is_company', '=', true]])"),
    fields: z.array(z.string()).optional().describe("Fields to return"),
    limit: z.number().optional().default(10).describe("Max number of records to return"),
    offset: z.number().optional().default(0).describe("Number of records to skip"),
});

const WriteSchema = z.object({
    model: z.string().describe("The Odoo model to write to"),
    ids: z.array(z.number()).describe("IDs of records to update"),
    vals: z.record(z.any()).describe("Values to update"),
});

const CreateSchema = z.object({
    model: z.string().describe("The Odoo model to create a record in"),
    vals: z.record(z.any()).describe("Values for the new record"),
});

const InspectModelSchema = z.object({
    model: z.string().describe("The Odoo model to inspect"),
});

export const commonTools = [
    {
        name: "odoo_search_read",
        description: "Search and read records from an Odoo model",
        inputSchema: zodToJsonSchema(SearchReadSchema) as any,
    },
    {
        name: "odoo_write",
        description: "Update records in an Odoo model",
        inputSchema: zodToJsonSchema(WriteSchema) as any,
    },
    {
        name: "odoo_create",
        description: "Create a new record in an Odoo model",
        inputSchema: zodToJsonSchema(CreateSchema) as any,
    },
    {
        name: "odoo_inspect_model",
        description: "Inspect a model's fields and metadata",
        inputSchema: zodToJsonSchema(InspectModelSchema) as any,
    },
];

export async function handleCommonTools(name: string, args: any, odoo: OdooClient) {
    if (name === "odoo_search_read") {
        const { model, domain, fields, limit, offset } = SearchReadSchema.parse(args);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(
                        await odoo.execute_kw(model, "search_read", [domain], {
                            fields,
                            limit,
                            offset,
                        }),
                        null,
                        2
                    ),
                },
            ],
        };
    }

    if (name === "odoo_write") {
        const { model, ids, vals } = WriteSchema.parse(args);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(await odoo.execute_kw(model, "write", [ids, vals]), null, 2),
                },
            ],
        };
    }

    if (name === "odoo_create") {
        const { model, vals } = CreateSchema.parse(args);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(await odoo.execute_kw(model, "create", [vals]), null, 2),
                },
            ],
        };
    }

    if (name === "odoo_inspect_model") {
        const { model } = InspectModelSchema.parse(args);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(
                        await odoo.execute_kw(model, "fields_get", [], {
                            attributes: ["string", "help", "type", "relation"],
                        }),
                        null,
                        2
                    ),
                },
            ],
        };
    }

    return null;
}
