"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todo_controllers_1 = require("../controllers/todo.controllers");
const router = express_1.default.Router();
router.route("/").post(todo_controllers_1.todoController.createTodo).get(todo_controllers_1.todoController.getTodos);
router
    .route("/:id")
    .get(todo_controllers_1.todoController.getSingleTodo)
    .patch(todo_controllers_1.todoController.updateTodo)
    .delete(todo_controllers_1.todoController.deleteTodo);
exports.default = router;
