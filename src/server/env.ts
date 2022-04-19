import { environment, LOCAL, AZURE } from "../../FLAGS";
import path from "path";
import dotenv from "dotenv";

const localENV = path.join(process.cwd(), ".dev.env");
const azureENV = path.join(process.cwd(), ".azure.env");
dotenv.config({ path: environment == LOCAL ? localENV : azureENV });
