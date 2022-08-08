const app = require('express')();
const proxy = require('express-http-proxy');
const port = process.env.PORT || 8080;
const audit = require('express-requests-logger')
const bunyan = require('bunyan');
const logger = bunyan.createLogger({name: 'myapp'});

const selectHost = (req) => {
  return `https://${req.params.region}-${req.params.projectId}.cloudfunctions.net`;
};

app.use(audit({logger: logger}}));

app.use(
  '/functions/:region/:projectId',
  proxy(selectHost, {
    https: true,
  })
);

app.use(
  '/firestore/',
  proxy('https://firestore.googleapis.com', { https: true })
);

app.use(
  '/securetoken/',
  proxy('https://securetoken.googleapis.com/', { https: true })
);

app.use('/auth/', proxy('www.googleapis.com', { https: true }));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
