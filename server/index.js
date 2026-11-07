
const jsonServer = require("json-server");
const express = require("express");
const path = require("path");

const server = jsonServer.create();

const router = jsonServer.router(
  path.join(__dirname, "db.json")
);

server.use(
  jsonServer.defaults({
    bodyParser: false,
  })
);

server.use(express.json({ limit: "10mb" }));

server.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

server.use(router);

server.listen(3000, () => {
  console.log("PawHaven server running on port 3000");
  console.log("Pets: http://localhost:3000/pets");
  console.log("Pet Documents: http://localhost:3000/petDocuments");
});
