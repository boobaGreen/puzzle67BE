"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoController = void 0;
const todo_models_1 = require("../models/todo.models");
const http_status_codes_1 = require("http-status-codes");
class TodoController {
    constructor() {
        // Add CRUDs here
        // create a todo
        this.createTodo = async (req, res) => {
            const { title, body } = req.body;
            if (!title || !body) {
                throw new Error("Title and Body must be provided.");
            }
            const newTodo = await todo_models_1.Todo.create(req.body);
            res
                .status(http_status_codes_1.StatusCodes.CREATED)
                .json({ todo: newTodo, msg: "Todo has been created!" });
        };
        // get all todos
        this.getTodos = async (req, res) => {
            const todos = await todo_models_1.Todo.find({}).sort("-createdAt");
            if (todos?.length === 0) {
                throw new Error("Todo list is empty!");
            }
            res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ todos, msg: "All Todos have been fetched!" });
        };
        //Get a single todo
        this.getSingleTodo = async (req, res) => {
            const { id } = req.params;
            const todo = await todo_models_1.Todo.findById({ _id: id });
            if (!todo) {
                throw new Error("Requested todo not found!");
            }
            res.status(http_status_codes_1.StatusCodes.OK).json({ todo, msg: "Success" });
        };
        // update todo
        this.updateTodo = async (req, res) => {
            const { id } = req.params;
            const updatedTodo = await todo_models_1.Todo.findByIdAndUpdate({ _id: id }, req.body, {
                new: true,
            });
            if (!updatedTodo) {
                throw new Error("Requested todo not found!");
            }
            res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ todo: updatedTodo, msg: "Todo has been updated" });
        };
        // delete todo
        this.deleteTodo = async (req, res) => {
            const { id } = req.params;
            const deletedTodo = await todo_models_1.Todo.findByIdAndDelete({ _id: id });
            if (!deletedTodo) {
                throw new Error("Requested todo not found!");
            }
            res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ todo: deletedTodo, msg: "Todo has been deleted" });
        };
    }
}
exports.todoController = new TodoController();
