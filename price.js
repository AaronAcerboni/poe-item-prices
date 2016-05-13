var request     = require('request');
var querystring = require('querystring');
var fs          = require('fs');
var cmd         = require('commander');
var cheerio     = require('cheerio');

var url         = 'http://poe.trade/search';
var data = {
	"league": "Perandus+Flashback",
	"type": "",
	"base": "",
	"name": "WILL BE SET",
	"dmg_min": "",
	"dmg_max": "",
	"aps_min": "",
	"aps_max": "",
	"crit_min": "",
	"crit_max": "",
	"dps_min": "",
	"dps_max": "",
	"edps_min": "",
	"edps_max": "",
	"pdps_min": "",
	"pdps_max": "",
	"armour_min": "",
	"armour_max": "",
	"evasion_min": "",
	"evasion_max": "",
	"shield_min": "",
	"shield_max": "",
	"block_min": "",
	"block_max": "",
	"sockets_min": "",
	"sockets_max": "",
	"link_min": "",
	"link_max": "",
	"sockets_r": "",
	"sockets_g": "",
	"sockets_b": "",
	"sockets_w": "",
	"linked_r": "",
	"linked_g": "",
	"linked_b": "",
	"linked_w": "",
	"rlevel_min": "",
	"rlevel_max": "",
	"rstr_min": "",
	"rstr_max": "",
	"rdex_min": "",
	"rdex_max": "",
	"rint_min": "",
	"rint_max": "",
	"mod_name": "",
	"mod_min": "",
	"mod_max": "",
	"group_type": "And",
	"group_min": "",
	"group_max": "",
	"group_count": "1",
	"q_min": "",
	"q_max": "",
	"level_min": "",
	"level_max": "",
	"ilvl_min": "",
	"ilvl_max": "",
	"rarity": "",
	"seller": "",
	"thread": "",
	"identified": "",
	"corrupted": "",
	"online": "x",
	"buyout": "",
	"altart": "",
	"capquality": "x",
	"buyout_min": "",
	"buyout_max": "",
	"buyout_currency": "",
	"crafted": "",
	"enchanted": ""
};
var userInput;

cmd
  .version('beta')
  .option('-i, --item [string]', 'Search item')
  .parse(process.argv);

if (cmd.item) {
	userInput = cmd.item.trim();
	data.name = readyString(userInput);
	console.log('Searching for ', data.name);
	getSearchResults(data, function (link) {
		request(link, grabTheMoney);
	});
} else {
	console.log("Input an item silly!!!");
	return;
}

function getSearchResults (formData, fn) {
	request({
	    headers: {
		    'User-Agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
		    'Cookie': 'color=white;league=Perandus%20Flashback',
		    'Accept': '/',
		    'Connection': 'keep-alive',
		    'Content-Type': 'application/x-www-form-urlencoded',
		    'contentLength': querystring.stringify(data).length
		},
	    uri: url,
	    body: stringifyData(formData),
	    method: 'POST'
	  }, function (err, httpResponse, data) {
	  	handleData(data, fn)
	  });
}

function handleData (data, fn) {
    var $ = cheerio.load(data);
	fn($('a').attr('href'));
}

function stringifyData (data) {
	var stringified = '';
	Object.keys(data).forEach(function (key) {
		stringified += key + '=' + data[key] + '&';
	});
	return stringified.substring(0, stringified.length - 1);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function readyString(str) {
	var tokens = str.split(' ');
	tokens.forEach(function (word,i) {
		tokens[i] = capitalizeFirstLetter(word);
	});
	return tokens.join('+');
}

function grabTheMoney (err, httpResponse, data) {
	var $ = cheerio.load(data);
	var $elem = $('.currency').each(function (i, item) {
		displayItem($(this));
	});
}

function displayItem (item) {
	var itemName     = getItemName(item);
	var currencyType = getCurrencyType(item);
	var costAmount   = item.text();
	console.log(itemName + ' ' +costAmount + ' ' + currencyType);
}

function getItemName (item) {
	var ctx = item.parentsUntil('.item');
	return ctx.find('h5 a').first().text();
}

function getCurrencyType (item) {
	var classes = item.attr('class');
	return classes.split('currency-')[1].split(' ')[0];
}

/* http://currency.poe.trade/api-get-offers?
league=Perandus%20Flashback

var temp = 'league=Perandus+Flashback&type=&base=&name=Tabula+Rasa+Simple+Robe&dmg_min=&dmg_max=&aps_min=&aps_max=&crit_min=&crit_max=&dps_min=&dps_max=&edps_min=&edps_max=&pdps_min=&pdps_max=&armour_min=&armour_max=&evasion_min=&evasion_max=&shield_min=&shield_max=&block_min=&block_max=&sockets_min=&sockets_max=&link_min=&link_max=&sockets_r=&sockets_g=&sockets_b=&sockets_w=&linked_r=&linked_g=&linked_b=&linked_w=&rlevel_min=&rlevel_max=&rstr_min=&rstr_max=&rdex_min=&rdex_max=&rint_min=&rint_max=&mod_name=&mod_min=&mod_max=&group_type=And&group_min=&group_max=&group_count=1&q_min=&q_max=&level_min=&level_max=&ilvl_min=&ilvl_max=&rarity=&seller=&thread=&identified=&corrupted=&online=x&buyout=&altart=&capquality=x&buyout_min=&buyout_max=&buyout_currency=&crafted=&enchanted=';
"body: temp" in requestoptions

*/