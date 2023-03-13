const express = require("express")
const app = express()

const shopRouter = require("./routers/shop");

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.json());
app.use(express.static("public"));

app.use("/", shopRouter);

app.listen(5000)