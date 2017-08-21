const express = require('express');
const alexa = require('alexa-app');
const alexaConfig = require('./alexaConfig');

var PORT = process.env.port || 5000;
var app = express();
var webhook = "compControl";

// ALWAYS setup the alexa app and attach it to express before anything else.
var alexaApp = new alexa.app(webhook);

var config = {
    expressApp: app,
    checkCert: false,
    debug: true
}

alexaApp.express(config);

app.set("view engine", "ejs");

alexaApp.launch(alexaConfig.onLaunch);

alexaApp.dictionary = alexaConfig.dictionary;

//all intents for Alexa
alexaApp.intent("SearchIntent", alexaConfig.searchIntentParams, alexaConfig.onSearchIntent);
alexaApp.intent("OpenWebsiteIntent", alexaConfig.openWebsiteIntentParams, alexaConfig.onOpenWebsiteIntent);
alexaApp.intent("OpenGameIntent", alexaConfig.openGameIntentParams, alexaConfig.onOpenGameIntent);

app.listen(PORT, () => {
    console.log("Listening on port " + PORT + ", try http://localhost:" + PORT + "/" + webhook);
});