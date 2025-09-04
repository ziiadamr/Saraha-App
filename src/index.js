import 'dotenv/config'
import express from "express";
import userRouter from "./Modules/Users/user.controller.js";
import messageRouter from "./Modules/Messages/message.controller.js";
import dbConnection from "./DB/db.connection.js";
import userModelDb from "./DB/Models/user.model.db.js";
const app = express();

userModelDb.createCollection()
// Barsing middleware
app.use(express.json());

// Routes
app.use("/users", userRouter);
app.use("/messages", messageRouter);

// DB connection
dbConnection();

//Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({message:'Something broke!', err:err.message, stack:err.stack});
});

// Not found middleware
app.use((err, req, res, next) => {
    res.status(404).send({message :"Error 404!", err:err.message, stack:err.stack});
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");
});