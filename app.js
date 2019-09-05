const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require("http");

const bodyParser = require('body-parser');
const indexRouter = require('./routes');
const apiRouter = require("./routes/api");

const graphqlHTTP = require("express-graphql");
const consola = require('consola');
const cors = require("cors");

const app = express();

const Velzy = require("./lib/velzy");


start = async function(){
  await Velzy.initListener();
  const graphSchema = await Velzy.graphQLSchema();

  app.use(cors())
  app.use(
    "/graphql",
    graphqlHTTP({
      schema: graphSchema,
      graphiql: true
    })
  );

  consola.info({
    message: "Velzy GraphQL generated and wired to sockets",
    badge: true
  })

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));
  // parse application/json
  app.use(bodyParser.json());

  //routes
  app.use('/', indexRouter);
  app.use('/v1/api/', apiRouter);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  const port = process.env.PORT || 3000;
  app.set('port', port);

  const server = http.createServer(app);
  const io = require('socket.io').listen(server);

  //say hello?
  io.on('connection', async (socket) => {
    consola.success({
      message: `Client connected: ${socket.id}`,
      badge: true
    })
  });


  //hook up realtime
  Velzy.wireEvents(io);

  server.listen(port);
  server.on('error', (error) => {
    consola.error(error)
  });

  server.on('listening', () => {
    consola.ready({
      message: `Velzy up and running on ${port}`,
      badge: true
    })
  });
}

start();
