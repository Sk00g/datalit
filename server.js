const express = require("express");
const cors = require("cors");
const app = express();
const port = 9080;
// const sharedFunc = require("./tools/sharedFunc");
const mongodb = require("mongodb");
var WebSocketServer = require("websocket").server;

/* SERVER-WIDE CONSTANTS */
const mongoString = "mongodb://localhost:27017";

/* SETUP HTTP SERVER TO SERVE WEBPAGE */
app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => res.redirect("index.html"));

var server = app.listen(port, () => console.log(`Kempertime app listening on port ${port}!`));

/* Setup websocket server for data connection using above HTTP server */
// socketServer = new WebSocketServer({ httpServer: server });
// connections = [];

// socketServer.on("request", function(request) {
//     var conn = request.accept(null, request.origin);
//     connections.push(conn);
//     console.log("ACCEPT: " + conn.remoteAddress);

//     conn.on("message", function(message) {
//         parseClientMessage(conn, message.utf8Data.split("\t"));
//     });

//     conn.on("close", function(conn) {
//         console.log(`CLOSED: ${conn.remoteAddress}`);
//         connections.splice(connections.indexOf(conn), 1);
//     });
// });

/* Connect to local mongo db instance */
// var mongo = null;
// mongodb.MongoClient.connect(mongoString, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
//     if (err) console.log("ERROR connecting to DB: " + err);
//     console.log("SUCCESS connecting to local db instance: " + mongoString);
//     mongo = client.db("kempertime");
// });

/* Client Messages Format -- Split by \t, JSON with any whitespace is accepted
    GET     DESIGNATOR  [opt: QUERY DATA] 
    SET     DESIGNATOR  [NEW OBJECT] *full replacement except ID, can be replaced by UPDATE for equivalent results
    UPDATE  DESIGNATOR  [opt: OBJECT ID] [DICT (PROP_NAME: VALUE)]
    DELETE  DESIGNATOR  [opt: OBJECT ID]
    ADD     DESIGNATOR  [NEW OBJECT]
*/
function log_response(err, response) {
    if (err) console.log(`DB ERROR: ${err}`);

    if (response.result) console.log(`DB RESPONSE: ${response.result.ok}`);
    else console.log(`DB RESPONSE: ${response.ok}`);
}

function parseClientMessage(conn, messageData) {
    method = messageData[0];
    designator = messageData[1];

    console.log(`RECV: (${method}) ${designator}`);

    switch (method) {
        case "GET":
            if (designator === "ACTIVE_SHIFT") {
                result = mongo.collection("activeShift").findOne({}, (err, result) => {
                    if (result) conn.send(`HEREIS\tACTIVE_SHIFT\t${JSON.stringify(result)}`);
                    else conn.send(`HEREIS\tACTIVE_SHIFT\tnull`);
                });
            } else if (designator === "SHIFTS") {
                // Return entire collection for now
                shifts = [];
                mongo
                    .collection("shifts")
                    .find()
                    .toArray(function(err, values) {
                        conn.send(`HEREIS\tSHIFTS\t${JSON.stringify(values)}`);
                    });
            }
            break;
        case "UPDATE":
        case "SET":
            if (designator === "ACTIVE_SHIFT") {
                data = JSON.parse(messageData[2]);

                mongo.collection("activeShift").findOneAndUpdate({}, { $set: data }, { upsert: true }, log_response);
            } else if (designator === "SHIFTS") {
                data = JSON.parse(messageData[2]);

                if (data._id) {
                    mongo
                        .collection("shifts")
                        .findOneAndUpdate(
                            { _id: new mongo.ObjectID(data._id) },
                            { $set: data },
                            { upsert: true },
                            log_response
                        );
                } else {
                    mongo.collection("shifts").insertOne(data, log_response);
                }
            }
            break;
        case "DELETE":
            if (designator === "ACTIVE_SHIFT") {
                mongo.collection("activeShift").findOneAndDelete({}, log_response);
            } else if (designator === "SHIFTS") {
                mongo.collection("shifts").deleteOne({ _id: new mongo.ObjectID(messageData[2]) }, log_response);
            }
            break;
        case "ADD":
            if (designator === "SHIFTS") {
                data = JSON.parse(messageData[2]);
                // Validate shift here
                mongo.collection("shifts").insertOne(data, log_response);
            }
            break;
    }
}
