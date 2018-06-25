console.log("The bot is active!");

var Twit = require('twit');
var config = require('./config');

var jokes = {};
jokes["Cow says"] = "No, a cow says mooooo!";
jokes["A little old lady"] = "All this time, I had no idea you could yodel.";
jokes["Etch"] = "Bless you, friend.";
jokes["Robin"] = "Robin you, now hand over the cash.";
jokes["Cash"] = "No thanks, I’ll have some peanuts.";

var template = "Template for the bot\nYou: Joke Time\nBot: Knock Knock\nYou: Who's There?\nBot: X\nYou: X who?\nBot: Y";
var said_knock_to = []
var said_joke_start = []
var total_jokes_told = 0;

var T = new Twit(config);

var stream = T.stream('user');
stream.on('tweet', do_this);

function do_this(event){
  console.log('this is working');
  var str = event.text;
  var name = event.user.screen_name
  str = str.slice(16, 140);
  if (str == "Joke Time"){
    console.log('making joke');
    console.log(name);
    say_knock_knock(name);
  }
  else if (str == "Who's There?" && include(name, said_knock_to)){
    console.log('2nd block');
    say_joke_start(name);
  }
  else if ((str.slice(-4, -1) == "who" && include(name, said_joke_start))){
    console.log('3rd block');
    console.log(str.slice(0, -4));
    say_joke_finish(name, str.slice(0, -4));
  }
}

function say_knock_knock(name){
  T.post('statuses/update', { status: '@' + name + ' Knock Knock' }, function(err, data, response) {
  console.log('Said Knock Knock')
  })
  add_to_knock(name);
}

function add_to_knock(name){
  said_knock_to.push(name);
  console.log(said_knock_to);
}

function say_joke_start(name){
  keys = [];
  for (var i in jokes) {
    keys.push(i);
  }
  var random_num = Math.floor((Math.random() * (keys.length - 1)) + 1);
  var joke = keys[random_num];
  T.post('statuses/update', { status: '@' + name + ' ' + joke }, function(err, data, response) {
  console.log('Said ' + joke)
  })
  knock_to_joke_start(name);
}

function knock_to_joke_start(name){
  said_knock_to.pop(name);
  said_joke_start.push(name);
  console.log(said_knock_to);
  console.log(said_joke_start);
}

function say_joke_finish(name, joke){
  var full_joke = jokes[joke];
  console.log(full_joke);
  T.post('statuses/update', { status: '@' + name + ' ' + full_joke }, function(err, data, response) {
  console.log('Said ' + full_joke)
  })
  remove_from_joke_start(name);
  total_jokes_told += 1;
  console.log('Total Jokes Craked: ' + total_jokes_told);
}

function remove_from_joke_start(name){
  said_joke_start.pop(name);
}

function include(value, arr){
  if (arr.indexOf(value) >= 0){
    return true;
  }
  else{
    return false;
  }
}
