# What is this?

This is a command line tool for fetching the prices of fictional items on a game called Path of Exile.

The tool uses node as a web scraper and uses http://poe.trade for its data.

## Usage

Windows: Execute `price.bat`

Other: `node price.js -i "item name"`

## Requirements

Made in JavaScript so it needs node and npm.

`npm intall` prior to using the tool.

# Why?

My friend wanted a quick way of looking up an item price from his desktop and this is the quickest way I could think of. He didn't mind installing node.

# Other stuff

Coded in spaghetti code, tightly coupled, very brittle and will likely fall over if any html changes on the server.