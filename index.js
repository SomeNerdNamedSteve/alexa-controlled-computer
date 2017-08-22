const express = require('express');
const alexa = require('alexa-app');
const alexaConfig = require('./alexaConfig');
const {app, BrowserWindow} = require('electron');
const fs = require('fs');
const path = require('path');
const url = require('url');

let win;
var PORT = process.env.port || 5000;
var server = express();
var webhook = "compControl";

// ALWAYS setup the alexa app and attach it to express before anything else.
var alexaApp = new alexa.app(webhook);

var config = {
    expressApp: server,
    checkCert: false,
    debug: true
}

var winParams = {
    width: 800,
    height: 600,
    center: true
}

alexaApp.express(config);

server.set("view engine", "ejs");

alexaApp.launch(alexaConfig.onLaunch);

alexaApp.dictionary = alexaConfig.dictionary;

//all intents for Alexa
alexaApp.intent("SearchIntent", alexaConfig.searchIntentParams, alexaConfig.onSearchIntent);
alexaApp.intent("OpenWebsiteIntent", alexaConfig.openWebsiteIntentParams, alexaConfig.onOpenWebsiteIntent);
alexaApp.intent("OpenGameIntent", alexaConfig.openGameIntentParams, alexaConfig.onOpenGameIntent);



function createWindow () {
  // Create the browser window.
    win = new BrowserWindow();

  // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    server.listen(PORT, () => {
        console.log("Listening on port " + PORT + ", try http://localhost:" + PORT + "/" + webhook);
    });


    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    });
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});