const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");
const bodyparser = require('body-parser');
var cookieParser = require('cookie-parser')

const app = express();
app.use(cookieParser())

app.use(cors({
  origin:'http://localhost:3000',
  credentials:true
}));
var usersRouter = require('./routes/api/users');
var annoncesRouter = require('./routes/api/annonces');

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(bodyparser.json());
// Define Routes
app.use("/api/chat", require("./routes/api/messages"));
app.use('/users', usersRouter);
app.use('/signUp', usersRouter);
app.use('/signIn', usersRouter);
app.use('/secret', usersRouter);
app.use('/api/annonces', annoncesRouter)
// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));