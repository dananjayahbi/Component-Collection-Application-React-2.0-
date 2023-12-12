const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

//Setting up the server
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8060;

app.use(cors());
app.use(express.json());

//Setting up routing
app.use("/Components", require("./routes/ComponentsRoutes"));
app.use("/Categories", require("./routes/ComponentCategoriesRoutes"));
app.use("/ideaCategories", require("./routes/CPIdeaCategoryRoutes"));
app.use("/ideas", require("./routes/CPIdeasRoutes"));
app.use("/refImages", require("./routes/RefImagesRoutes"));
app.use("/refImageCategories", require("./routes/RefImageCategoriesRoutes"));
app.use("/users", require("./routes/UsersRoutes"));
app.use("/learningNodes", require("./routes/LearningNodesRoutes"));

app.listen(PORT, () => {
  console.log("Server up with port : " + PORT);
});

//Setting up the database connection
const URL = process.env.MONGODB_URL;

mongoose.set("strictQuery", true);
mongoose.connect(URL, { useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB connection established successfully!");
});
