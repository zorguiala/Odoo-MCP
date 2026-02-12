import xmlrpc from "xmlrpc";
import { Config } from "../config.js";

export class OdooClient {
    private url: string;
    private db: string;
    private username: string;
    private password: string;
    private uid: number | null = null;
    private commonClient: xmlrpc.Client;
    private objectClient: xmlrpc.Client;

    constructor() {
        this.url = Config.ODOO_URL;
        this.db = Config.ODOO_DB;
        this.username = Config.ODOO_USERNAME;
        this.password = Config.ODOO_PASSWORD;

        const urlParts = new URL(this.url);
        const clientOptions = {
            host: urlParts.hostname,
            port: parseInt(urlParts.port) || (urlParts.protocol === "https:" ? 443 : 80),
            path: "/xmlrpc/2/common",
        };

        // Determine if we should use secure client based on protocol
        const createClient = urlParts.protocol === "https:" ? xmlrpc.createSecureClient : xmlrpc.createClient;

        this.commonClient = createClient(clientOptions);

        this.objectClient = createClient({
            ...clientOptions,
            path: "/xmlrpc/2/object",
        });
    }

    async authenticate(): Promise<number> {
        if (this.uid) return this.uid;

        return new Promise((resolve, reject) => {
            this.commonClient.methodCall(
                "authenticate",
                [this.db, this.username, this.password, {}],
                (error, value) => {
                    if (error) {
                        reject(error);
                    } else if (value) {
                        this.uid = value as number;
                        resolve(this.uid);
                    } else {
                        reject(new Error("Authentication failed"));
                    }
                }
            );
        });
    }

    async execute_kw(
        model: string,
        method: string,
        args: any[] = [],
        kwargs: any = {}
    ): Promise<any> {
        const uid = await this.authenticate();

        return new Promise((resolve, reject) => {
            this.objectClient.methodCall(
                "execute_kw",
                [this.db, uid, this.password, model, method, args, kwargs],
                (error, value) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(value);
                    }
                }
            );
        });
    }
}
