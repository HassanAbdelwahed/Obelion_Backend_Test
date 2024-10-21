const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const errorHandler = require("./controllers/error.js");
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const borrowingRoutes = require("./routes/borrowingRoutes");
const reportRoutes = require("./routes/reportRoutes");
const swaggerSpec = require("./helpers/swagger.js");

const app = express();
dotenv.config();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());
app.use(cookieParser());

app.use("/api/", userRoutes);
app.use("/api/", bookRoutes);
app.use("/api/", borrowingRoutes);
app.use("/api/", reportRoutes);

app.use(errorHandler);

module.exports = app;
