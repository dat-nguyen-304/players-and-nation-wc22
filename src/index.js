var express = require("express");
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
var path = require("path");
const bodyParser = require("body-parser");
var logger = require("morgan");
const mongoose = require("mongoose");


// router
var indexRouter = require("./routes/index");
var nationRouter = require("./routes/nationRouter");
var playerRouter = require("./routes/playerRouter");
var authRouter = require("./routes/authRouter");
var apiRouter = require("./routes/apiRouter");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'));
app.use("/", indexRouter);
app.use("/nations", nationRouter);
app.use("/players", playerRouter);
app.use("/auth", authRouter);
app.use("/api", apiRouter);

const url = "mongodb://127.0.0.1:27017/assignment2";
const connectDB = () => {
  try {
    mongoose.set('strictQuery', true);
    mongoose.connect(url, {
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (e) {
    console.log(e.message);
  }
}

connectDB();
const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

