const express = require("express");
const Pusher = require('pusher');
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");
const bodyparser = require('body-parser');
var cookieParser = require('cookie-parser')
const axios = require('axios');

const expressWs = require('express-ws');
const app = express();

app.use(cookieParser())
const pusher = new Pusher({
  appId: '1010955',
  key: "871d6ba2f6877b56a8c9",
  secret: "2b7b6fcc26e8e777c845",
  cluster: "mt1",
  encrypted: true
});
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
var usersRouter = require('./routes/api/users');
var annoncesRouter = require('./routes/api/annonces');
var reclamationsRouter = require('./routes/api/reclamations');
var notificationsRouter=require('./routes/api/notifications')
var matchsRouter = require('./routes/api/match');

// Connect Database
connectDB();
const wsInstance = expressWs(app);
// Init Middleware
app.use(express.json({ extended: false }));
app.use(bodyparser.json());
app.use(express.static(__dirname + '/public'));
// Define Routes

app.use("/api/chat", require("./routes/api/messages"));
app.use('/match', matchsRouter);
app.use('/users', usersRouter);
app.use('/signUp', usersRouter);
app.use('/signIn', usersRouter);
app.use('/secret', usersRouter);
app.use('/api/annonces', annoncesRouter)
app.use('/api/reclamations',reclamationsRouter)
app.use('/api/notifications',notificationsRouter)

app.ws('/notification', (ws, req) => {

  ws.on('message', function incoming(message) {
    console.log(message) ;
    ws.broadcast(message);
  });

  ws.broadcast = function broadcast(data) {
    wsInstance.getWss().clients.forEach(function each(client) {
    client.send(data);
    });
  };
})
//For google maps API
app.get('/getRoute',async(req,res)=>{
  const params = req.url.split('?')[1].split('&');
  const from = params[0].split('=')[1];
  const to = params[1].split('=')[1];
  console.log(from,to)
       axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${from}&destination=${to}&key=AIzaSyA5EKrHABEcEowV8yEQh8AnEh0SuTquSQM&sensor=false&alternatives=true`)
      .then(function (response) {
          res.send(response.data)
        })
        .catch(function (error) {
          console.log(error);
        });

});






// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
const io = require('socket.io')(server);
io.on('connection', function (socket) {
  socket.on('notification', function (data) {
    socket.join(data.user)
  })
  socket.on('notificationLeave', function (data) {
    socket.leave(data.user)
  })
  socket.on('subscribe', function (data) {
    socket.join(data.room)
  })
  socket.on('unsubscribe', function (data) {
    socket.leave(data.room)
  })
})
global.io = io;