
var fs              = require('fs');
var https           = require('https');
var http           = require('http');
let express = require('express'),
bodyParser = require('body-parser'),
port = process.env.PORT || 3000,
app = express();
let alexaVerifier = require('alexa-verifier');

const APP_ID = 'amzn1.ask.skill.2b2693e0-b306-49b4-aaae-fa68bd270ce4';

const SKILL_NAME = 'Marvel Heroes';
const GET_HERO_MESSAGE = "Here's your hero: ";
const HELP_MESSAGE = 'You can say tell me the name of a hero, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Enjoy the day...Goodbye!';
const MORE_MESSAGE = 'Do you want more?'
const PAUSE = '<break time="0.3s" />'
const WHISPER = '<amazon:effect name="whispered"/>'

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/data
//=========================================================================================================================================
const data = [
    'Black Panther  ',
    'She-Hulk ',
    'Thor',
    'Nova ',
    'Doctor Strange ',
    'Hawkeye',
    'Quicksilver ',
    'Blade',
    'Black Widow',
    'Captain Marvel',
    'Deadpool',
    'Elektra',
    'Shaktimaan',
];

// var privateKey = fs.readFileSync('key.pem', 'utf8');
// var certificate = fs.readFileSync('cert.pem', 'utf8');
//
// var credentials = {
//     key: privateKey,
//     cert: certificate,
//     passphrase:'@619'
// };

//var httpServer = http.createServer(app);
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
    res.json(getNewHero());
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

function getNewHero(){

    const welcomeSpeechOutput = 'Welcom to marvel heroes, here is your hero<break time="0.3s" />'
    const heroArr = data;
const heroIndex = Math.floor(Math.random() * heroArr.length);
const randomHero = heroArr[heroIndex];
const tempOutput = WHISPER + GET_HERO_MESSAGE + randomHero + PAUSE;
const speechOutput = "<speak>" + welcomeSpeechOutput + tempOutput + MORE_MESSAGE + "</speak>"
const more = MORE_MESSAGE

var jsonObj = {
  "version": "1.0",
  "response": {
    "shouldEndSession": true,
    "outputSpeech": {
      "type": "SSML",
      "ssml": speechOutput
    }
  }
}

return jsonObj;

}
  //httpServer.listen(port);
  //httpsServer.listen(7000);
  app.listen(port);
  console.log('Alexa list RESTful API server started on: ' + port);
