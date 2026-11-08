
const jsonServer = require("json-server");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const server = jsonServer.create();

const router = jsonServer.router(
  path.join(__dirname, "db.json")
);

// Disable JSON Server's default body parser
server.use(
  jsonServer.defaults({
    bodyParser: false,
  })
);

// Explicitly increase request body limits
server.use(bodyParser.json({ limit: "20mb" }));

server.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "20mb",
  })
);

// JSON Server database routes
server.use(router);

server.listen(3000, () => {
  console.log("PawHaven server running on port 3000");
  console.log("Upload limit: 20MB");
  console.log("Pets: http://localhost:3000/pets");
  console.log("Pet Documents: http://localhost:3000/petDocuments");
});
