const fs = require('fs');
const natural = require('natural');

var steamBase = 'D:\\Steam Games\\steamapps\\';
var youtubeBase = "https://www.youtube.com/results?search_query=";
var googleBase = "https://www.google.com/search?q=";
var websiteBase = "https://www.";

function createURL(e, q){
    var base = ""
    if(e === "google"){ base = googleBase; }
    else if(e === "youtube"){ base = youtubeBase; }
    return base + q.split(' ').join('+');
}

function createWebsiteURL(domain){ 
    var end = domain === 'twitch'? ".tv" : ".com";
    return websiteBase+domain+end; 
}

function getGameId(game){
    var gamesList = getGames();
    var gameTitles = Object.keys(gamesList);
    var maxDistance = 0;
    var bestFitGame = '';
    for(var i = 0; i < gameTitles.length; i++){
        var gameTitle = gameTitles[i];
        if(natural.JaroWinklerDistance(gameTitle, game) > maxDistance){
            maxDistance = natural.JaroWinklerDistance(gameTitle, game);
            bestFitGame = gameTitles[i];
        }
    }
    return gamesList[bestFitGame];
}

function getGames(){
    var dict = {};
    var files = fs.readdirSync(steamBase);
    files.forEach((file) => {
        if(isACFFile(file)){ addGame(dict, file); }
    });
    return dict;
}

function isACFFile(file){ return file.split(".").pop() === "acf"; }

function addGame(dict, file){
    var fileBuffer = fs.readFileSync(steamBase+file);
    var fileString = fileBuffer.toString('utf8');
    var words = fileString.split('"');
    var gameName = words[13];
    var gameId = words[5];
    
    if(gameName.charAt(0) === "'"){
        var temp = gameName.substring(1,gameName.length-1);
        gameName = temp;
    }
    
    dict[gameName] = gameId;
}

module.exports = {
    createURL: createURL,
    createWebsiteURL: createWebsiteURL,
    getGameId: getGameId
};