const express = require("express");
const connectDB = require("./db/connect");
const dotenv = require("dotenv").config();
const Router = require("./routes/products");
// require("express-async-errors");
// const errorHandlerMiddleware = require("./middleware/error-handler");
// const notFound = require("./middleware/not-found");

const app = express();

app.use(express.json());
// app.use(errorHandlerMiddleware);
// app.use(notFound);
const port = process.env.PORT || 5001;
app.use("/api/v1/products", Router);
const start = async () => {
  try {
    await connectDB(process.env.mongoURI).then(() => {
      console.log("connection success");
    });
    app.listen(port, () => {
      console.log(`App is listening on port :${port}`);
    });
  } catch (err) {
    console.log(err.message);
  }
};
start();
