#!/usr/bin/env node

const ccxt   = require('ccxt');

console.log(ccxt.exchanges.filter(s => s.match('binance')));
