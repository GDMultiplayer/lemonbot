const { Command } = require('discord.js-commando');

module.exports = class Chance extends Command {
	constructor(client) {
		super(client, {
			name: 'chance',
			group: 'fun',
			memberName: 'chance',
			description: 'Calculates a chance of an action.',
			examples: ['chance of being best bot'],
			args: [
				{
					key: 'ok',
					prompt: 'Some text',
					type: 'string'
				}
			]
		});
	}

	run(msg, { ok }) {
		if (ok.includes('of '))
			ok = ok.replace('of ', '');

		var mhm = `The chance of ${ok} is: ${Math.floor(Math.random() * (101 - 0))}%`;
		return msg.reply(mhm);
	}
}