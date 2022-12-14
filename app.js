import { createRequire } from "module";
import express from "express";
const app = express();
import { createServer } from "http";
const require = createRequire(import.meta.url);
const bodyParser = require("body-parser");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
require("dotenv").config();
import { BTFirebaseNotification, getNotificationService } from "./FirebaseNotification.js";
/////////////////////////////////////////////INITIALIZATION/////////////////////////////////////////
var port = process.env.PORT || "3000";
app.set("port", port);
var server = createServer(app);
server.listen(port, () => {
    console.log("server is running on port " + port);
});
server.on("error", () => { console.log("error"); });
server.on("listening", () => { console.log("slusa"); });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("/"));
app.get("/", async (req, res) => {
    res.send("Hello1");
});
BTFirebaseNotification.init(app);
// //////////////////////////////////////////////SERVICE FUNCTION///////////////////////////////////////////
app.get("/test", async (req, res) => {
    //getNotificationService()?.sendNotificationToUsers(["cQThfxfoSBqqiRH5LM-Yqq:APA91bHOJSpAcXtJ5TYv-EUyQQhmwKljnhX69hdDI7hgkNsJnO20LJkpziXuR26IL5A0_dY9gAyojsl4_0OPwDOqFaBvkV2dW77WGBw97jLx7pL6nNxnIevkvSacYN-Sp8MKWu2Jn8Xg"],"title","message","img").then((e:any)=>res.send(e));//sendNotificationToTopic("Krstaa","backend","hhhhh")
    getNotificationService()?.sendNotificationToTopic("Krstaa", "backend", "hhhhh").then((e) => res.send(e)); //
});
app.get("/", (req, res) => {
    res.send(JSON.stringify([
        {
            requestId: "1",
            studentNumber: 50,
            typeOfClass: "Amfiteatar",
        },
    ]));
});
