const open = require('open');
const func = require('./functions');

var dictionary = { 
    "SearchEngines": ["google", "youtube"],
    "CommonWebsites": ["youtube", "google", "twitch", "gmail", "twitter", "messenger", "reddit", "imgur"]
};

var searchIntentParams = {
    "slots": { 
        "engine": "SearchEngines",
        "query": "LITERAL"
    },
    "utterances": [
        "ask {engine} to look up {query}",
        "look up {query} on {engine}",
        "ask {engine} {query}"
    ]
};

var openWebsiteIntentParams = {
    "slots": { 
        "website": "CommonWebsites",
    },
    "utterances": [
        "open {website}",
        "open up {website}",
        "load up {website}"
    ]
};

var openGameIntentParams = {
    "slots": { 
        "game": "LITERAL",
    },
    "utterances": [
        "open {game} on steam",
        "play {game}"
    ]
};

function onLaunch(request, response) {
    response.say("What can I do for you?").shouldEndSession(false);
    return;
}

function onSearchIntent(request, response) {
    console.log("Search Intent");
    var engine = request.slot("engine");
    var query = request.slot("query");
    var url = func.createURL(engine, query);
    console.log(engine);
    console.log(url);
    var alexaResponse = "Okay.  Searching " + engine + " " + query;
    response.say(alexaResponse);
    open(url);
}

function onOpenWebsiteIntent(request, response){
    console.log("Open Intent");
    var domain = request.slot('website');
    var url = func.createWebsiteURL(domain);
    response.say("Okay.  Opening " + domain);
    open(url);
}

function onOpenGameIntent(request, response){
    var game = request.slot('game');
    var gameId = func.getGameId(game).toString();
    response.say("Okay.  Playing " + game);
    open('steam://rungameid/' + gameId);
}

module.exports = {
    dictionary: dictionary,
    onLaunch: onLaunch,
    searchIntentParams: searchIntentParams,
    onSearchIntent: onSearchIntent,
    openWebsiteIntentParams: openWebsiteIntentParams,
    onOpenWebsiteIntent: onOpenWebsiteIntent,
    openGameIntentParams: openGameIntentParams,
    onOpenGameIntent: onOpenGameIntent
}