const express = require("express");
const fs = require("fs");
const todosFile = "./todos.json";
let todos = require(todosFile);
let cors = require("cors");
const app = express();
const port = 8080;

app.use(express.json(), cors({ origin: "*" }));

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error(err);
    return res.status(400).send({ status: 404, message: err.message }); // Bad request
  }
  next();
});

const updateData = () => {
  fs.writeFile(
    todosFile,
    JSON.stringify(todos),
    (err) => err && console.log(err)
  );
};

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app
  .route("/todo")
  .get((req, res) => {
    res.status(200).send(todos);
  })
  .post((req, res) => {
    if (req.body.text === undefined) {
      console.log("todo POST: invalid JSON format");
      res.status(500).send({ ok: false, Error: "Invalid JSON format" });
      return;
    }
    if (typeof req.body.text !== "string") {
      console.log("todo POST: wrong type");
      res.status(500).send({ ok: false, Error: "Invalid type" });
      return;
    }

    todos.push({
      text: req.body.text,
      state: 0,
      id: Date.now(),
    });

    updateData();
    res.send(todos.at(-1));
  })
  .put((req, res) => {
    if (req.body.id === undefined || req.body.newState === undefined) {
      console.log("todo PUT: invalid JSON format");
      res.status(500).send({ ok: false, Error: "Invalit JSON format" });
      return;
    }
    if (
      typeof req.body.newState !== "number" ||
      typeof req.body.id !== "number"
    ) {
      console.log("todo PUT: wrong type");
      res.status(500).send({ ok: false, Error: "Invalid type" });
      return;
    }

    let changedItem;
    todos = todos.map((item) => {
      if (item.id === req.body.id) {
        changedItem = { ...item, state: req.body.newState };
        return changedItem;
      } else return item;
    });

    updateData();
    res.status(200).send({ ok: true, changedItem });
  });

app.delete("/todo/:todoId", (req, res) => {
  let newList = todos;
  todos = newList.filter((item) => item.id !== parseInt(req.params.todoId));
  updateData();
  res
    .status(200)
    .send({ ok: true, message: `Todo ${req.params.todoId} deleted` });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
