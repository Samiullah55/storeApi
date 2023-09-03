const Product = require("../models/product");

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericalFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (numericalFilters) {
    const operatorsMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|<=|>|>=)\b/g;
    let filters = numericalFilters.replace(
      regEx,
      (match) => `-${operatorsMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }
  console.log(queryObject);
  let result = Product.find(queryObject);
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }
  if (fields) {
    const feildList = fields.split(",").join(" ");
    result = result.select(feildList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({
    status: "success",
    data: {
      products,
    },
    nhHits: products.length,
  });
};

const getProduct = async (req, res) => {
  const { featured, company, name } = req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  const productData = await Product.find(queryObject);
  console.log(productData);
  res.status(200).json({
    status: "success",
    data: {
      productData,
    },
    nhHits: productData.length,
  });
};

const createProducts = async (req, res) => {
  const task = await Product.create(req.body);
  console.log(task);
  try {
    res.status(201).json({
      status: "success",
      message: task,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
const updateProduct = async (req, res) => {
  const { id: taskID } = req.params;
  const task = await Product.findOneAndUpdate({ _id: taskID }, req.body);
  console.log(task);
  try {
    res.status(201).json({
      status: "success",
      message: task,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

const deleteProduct = async (req, res) => {
  const { id: taskID } = req.params;
  const task = await Product.findOneAndDelete({ _id: taskID });
  console.log(task);
  try {
    res.status(201).json({
      status: "success",
      message: task,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

module.exports = {
  getAllProducts,
  createProducts,
  updateProduct,
  deleteProduct,
  getProduct,
};
