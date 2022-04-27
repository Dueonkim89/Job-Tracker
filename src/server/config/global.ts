import { Server } from "http";
import { Pool } from "mysql2";

declare global {
    var __SERVER__: Server;
    var __DB__: Pool;
}
