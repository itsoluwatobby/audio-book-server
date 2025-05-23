const express = require('express');
const config = require('./config/index');
const mongoose = require("mongoose");
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { CorsOption } = require('./config/corsOptions');
const { DBConnection } = require('./config/DBConnect');
const {
  chapterRoutes,
  appConfigRoutes,
  audioRoutes,
  adminRoutes,
} = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const routeNotFound = require('./middleware/routeNotFound');
const { RequestRateLimiter } = require('./middleware/rateLimiter.js');
const { getIpAddress } = require('./middleware/getIpAddress.js');
const { responseBody } = require('./utils/responseBody');
const { appConfigServices } = require('./service');

DBConnection();

const app = express();
const server = http.createServer(app);

app.use(express.static('uploads/thumbnail'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(RequestRateLimiter);
app.use(morgan('common'));
app.use(cors(CorsOption));

app.use(helmet(
  {
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    }
  }
));

app.get('/health', (_, res) => {
  responseBody(
    {
      res,
      statusCode: 200,
      message: 'Server is in good health',
      data: {
        status: 'running',
        app_name: 'Gracie Audios',
      }
    }
  );
});

app.use(getIpAddress);

app.use('/api/v1/audio', audioRoutes);
app.use('/api/v1/chapter', chapterRoutes);
app.use('/api/v1/config', appConfigRoutes);
app.use('/api/v1/admin', adminRoutes);

app.all('*', routeNotFound);
app.use(errorHandler);

mongoose.connection.once('open', () => {
  server.listen(config.PORT, () => {
    console.log(`Server running on PORT - ${config.PORT}`);
    appConfigServices.initiateSetup();
  });
});

mongoose.connection.on('error', (error) => {
  console.log(`DB connection error, ERROR: ${error.message}`);
});
