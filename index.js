const express = require('express');
const config = require('./config/index');
const mongoose = require("mongoose");
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const { CorsOption } = require('./config/corsOptions');
const { DBConnection } = require('./config/DBConnect');
const audioRoutes = require('./routes/audio.roues');
const { errorHandler } = require('./middleware/errorHandler');
const routeNotFound = require('./middleware/routeNotFound');

DBConnection();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('common'));
app.use(cors(CorsOption));
// app.use()

app.get('/health', (_, res) => {
  res.status(200).json(
    {
      statusCode: 200,
      message: 'Server is in good health',
      timestamp: new Date().toString(),
      data: {
        status: true,
      }
    }
  )
});

app.use('/api/v1', audioRoutes);

app.all('*', routeNotFound);
app.use(errorHandler);

mongoose.connection.once('open', () => {
  server.listen(config.PORT, () => {
    console.log(`Server running on PORT - ${config.PORT}`);
  });
});

mongoose.connection.on('error', (error) => {
  console.log(`DB connection error, ERROR: ${error.message}`);
});
