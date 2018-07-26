
var fs              = require('fs');
var https           = require('https');
var http           = require('http');
let express = require('express'),
bodyParser = require('body-parser'),
port = process.env.PORT || 3000,
app = express();
let alexaVerifier = require('alexa-verifier');


var privateKey = fs.readFileSync('key.pem', 'utf8');
var certificate = fs.readFileSync('cert.pem', 'utf8');

var credentials = {
    key: privateKey,
    cert: certificate,
    passphrase:'@619'
};

var httpServer = http.createServer(app);
//var httpsServer = https.createServer(credentials, app);



app.use(bodyParser.json({
  verify: function getRawBody(req, res, buf) {
    req.rawBody = buf.toString();
  }
}));
function requestVerifier(req, res, next) {
  alexaVerifier(
    req.headers.signaturecertchainurl,
    req.headers.signature,
    req.rawBody,
    function verificationCallback(err) {
      if (err) {
        res.status(401).json({ message: 'Verification Failure', error: err });
      } else {
        next();
      }
    }
  );
}
app.post('/marvelheroes', requestVerifier, function(req, res) {
  if (req.body.request.type === 'LaunchRequest') {
    res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>Hmm <break time=\"1s\"/> What day do you want to know about?</speak>"
        }
      }
    });
  }
  else if (req.body.request.type === 'SessionEndedRequest') { /* ... */ }
  else if (req.body.request.type === 'IntentRequest' &&
  req.body.request.intent.name === 'Forecast') {

    if (!req.body.request.intent.slots.Day ||
      !req.body.request.intent.slots.Day.value) {
        // Handle this error by producing a response like:
        // "Hmm, what day do you want to know the forecast for?"
      }
      let day = new Date(req.body.request.intent.slots.Day.value);

      // Do your business logic to get weather data here!
      // Then send a JSON response...

      res.json({
        "version": "1.0",
        "response": {
          "shouldEndSession": true,
          "outputSpeech": {
            "type": "SSML",
            "ssml": "<speak>Looks like a great day!</speak>"
          }
        }
      });
    }
  });

  httpServer.listen(port);
  //httpsServer.listen(7000);
  //app.listen(port);
  console.log('Alexa list RESTful API server started on: ' + port);
