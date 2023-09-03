require("dotenv").config();

const connectDB = require("./db/connect");

const Product = require("./models/product");

const jsonProducts = require("./products.json");

const start = async () => {
  try {
    await connectDB(process.env.mongoURI);
    // await Product.deleteMany();
    await Product.create(jsonProducts);
    console.log("success");
  } catch (err) {
    console.log(err);
  }
};
start();
