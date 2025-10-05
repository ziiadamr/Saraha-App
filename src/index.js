import 'dotenv/config'
import express from "express";
import helmet from 'helmet';
import {userRouter, passwordRouter, authRouter} from "./Modules/Users/Controllers/index.js";
import messageRouter from "./Modules/Messages/message.controller.js";
import dbConnection from "./DB/db.connection.js";
import {rateLimiter} from "./Middlewares/index.js";
import("./cron/cleanupTokens.js");

const app = express();

// Barsing middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));

//Rate limiter
//app.use(rateLimiter)

//Helmet
app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", 'trusted-cdn.com'],
          frameAncestors: ["'self'"]
        },
      },
      frameguard: {
        action: 'deny', // Prevent [ Clickjacking ] the page from being embedded in any iframe
      },
      referrerPolicy: {  //  header which controls what information is set in the Referer request header.
        policy: ["origin", "unsafe-url"],
      },
      strictTransportSecurity: {  // prefer HTTPS instead of insecure HTTP. 
        maxAge: 123456,
        includeSubDomains: false,
      },
      xContentTypeOptions: true, //  mitigates MIME type sniffing , default true
      xPoweredBy: true,//removes the X-Powered-By header, Express , loopback , .. default true
      xXssProtection: true, //  Enables the browser's built-in XSS protection.
    })
  );
  
// Routes
app.use("/users", userRouter, passwordRouter, authRouter);
app.use("/messages", messageRouter);

// DB connection
dbConnection();

//Error handling middleware
app.use(async(err, req, res, next) => {
    console.log("session inside error handler middleware", req.session)
    if(req.session && req.session.inTransaction()){
        //abort transaction
        await req.session.abortTransaction()
        //end session
        req.session.endSession()
    }
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