"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_config_1 = __importDefault(require("./config/db.config"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
require("./services/eventListener"); // Importa l'ascoltatore di eventi
// Load environment variables from .env file
dotenv_1.default.config();
const app = (0, express_1.default)();
//  enable support for json
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
    res.send("<h1>Puzzle 67 Bitcoin</h1>");
});
// routes
app.use("/api/v1/users", user_routes_1.default);
const startDB = async () => {
    try {
        await (0, db_config_1.default)();
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        });
    }
    catch (error) {
        console.log(error);
    }
};
// connecting to MongoDB and starting the server
startDB();
