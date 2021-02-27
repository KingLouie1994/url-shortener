// Import of express
const express = require("express");

// Import of middlewares
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const yup = require("yup");

// Initialise
const app = express();

// Use of middlewares
app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

// Serving to static folder
app.use(express.static("./public"));

// Routes
// Route that redirects to url
app.get("/:id", (req, res, next) => {});

// Schema that has to be fulfilled to make a post request
const schema = yup.object().shape({
  alias: yup.string().trim().matches(/[\w\-]/i),
  url: yup.string().trim().url().required()
})

// Route to create a short url
app.post("/url", (req, res, next) => {});

// Route to get short URL by id
app.get("/url/:id", (req, res, next) => {});

// Server listen
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
