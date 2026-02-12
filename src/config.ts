import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
    ODOO_URL: z.string().url(),
    ODOO_DB: z.string(),
    ODOO_USERNAME: z.string(),
    ODOO_PASSWORD: z.string(),
});

const processEnv = {
    ODOO_URL: process.env.ODOO_URL,
    ODOO_DB: process.env.ODOO_DB,
    ODOO_USERNAME: process.env.ODOO_USERNAME,
    ODOO_PASSWORD: process.env.ODOO_PASSWORD,
};

const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
    console.error("Missing or invalid environment variables:", parsed.error.format());
    process.exit(1);
}

export const Config = parsed.data;
