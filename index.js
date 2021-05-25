#!/usr/bin/env node

process.on('unhandledRejection', e => console.error(e));

const ccxt       = require('ccxt');
const jsonfile   = require('jsonfile');

console.log(ccxt.exchanges.filter(s => s.match('binance')));

jsonfile.readFile('./testData.json')
	.catch(err => {
		if (err.code == 'ENOENT') return {};
		else                      throw err;
	})
	.then(console.dir);
