// Import of express
const express = require("express");

// Import of middlewares
const morgan = require("morgan");
const helmet = require("helmet");
const yup = require("yup");
const monk = require("monk");
const { nanoid } = require("nanoid");

// Initialise
const app = express();

// Use of middlewares
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json());

require("dotenv").config();

// Middleware to handle error
app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? "&#129374" : "error.stack",
  });
});

// Serving to static folder
app.use(express.static("./public"));

// Routes
// Schema that has to be fulfilled to make a post request
const schema = yup.object().shape({
  alias: yup
    .string()
    .trim()
    .matches(/[\w\-]/i),
  url: yup.string().trim().url().required(),
});

// Route to create a short url
app.post("/url", async (req, res, next) => {
  let { alias, url } = req.body;
  try {
    await schema.validate({
      alias,
      url,
    });
    if (!alias) {
      alias = nanoid(5);
    } else {
      const existing = await urls.findOne({ alias });
      if (existing) {
        throw new Error("Alias in use!");
      }
    }
    alias = alias.toLowerCase();
    const newUrl = {
      url,
      alias,
    };
    const created = await urls.insert(newUrl);
    res.json(created);
  } catch (error) {
    next(error);
  }
});

// Route that redirects to url
app.get("/:id", async (req, res, next) => {
  const { id: alias } = req.params;
  try {
    const url = await urls.findOne({ alias });
    if (url) {
      return res.redirect(url.url);
    }
    return res.status(404).sendFile(notFoundPath);
  } catch (error) {
    return res.status(404).sendFile(notFoundPath);
  }
});

// DB connection
const db = monk(process.env.MONGO_URI);
const urls = db.get("urls");
urls.createIndex({ alias: 1 }, { unique: true });

// Server listen
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Listening at port: ${port}`);
});
