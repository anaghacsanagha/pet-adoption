
const jsonServer = require("json-server");
const bodyParser = require("body-parser");
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

server.use(bodyParser.json({ limit: "20mb" }));

server.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "20mb",
  })
);

server.use(router);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`PawHaven server running on port ${PORT}`);
  console.log(`Pets: http://localhost:${PORT}/pets`);
  console.log(`Users: http://localhost:${PORT}/users`);
  console.log(`Pet Documents: http://localhost:${PORT}/petDocuments`);
});
