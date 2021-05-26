#!/usr/bin/env node

process.on('unhandledRejection', e => console.error(e));

const ccxt       = require('ccxt');
const jsonfile   = require('jsonfile');

console.log(ccxt.exchanges.filter(s => s.match('binance')));

const xt = {};

jsonfile.readFile('./data.json')
	.catch(err => {
		if (err.code == 'ENOENT') return {};
		else                      throw err;
	})
	.then(data => {
		for (const [username, user] of Object.entries(data.users)) {
			xt[username] = {};
			for (const [xtName, xtData] of Object.entries(user.exchanges)) {
				xt[username][xtName] =
					new ccxt[xtData.exchange](xtData.credentials);

				if (process.env.NODE_ENV !== 'production')
					xt[username][xtName].setSandboxMode(true);

				try {
					xt[username][xtName].checkRequiredCredentials();
				} catch (e) {
					console.warn(Object.assign(e, {
						user:       username,
						exchange:   xtName
					}));
					delete xt[username][xtName];
					continue;
				}

				xt[username][xtName].fetchBalance()
					.then(d => d.total)
					.then(console.dir);
			}
		}
	});
