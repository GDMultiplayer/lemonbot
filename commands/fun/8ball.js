const { Command } = require('discord.js-commando');

module.exports = class Eightball extends Command {
	constructor(client) {
		super(client, {
			name: '8ball',
			group: 'fun',
			memberName: '8ball',
			description: '8Ball (or Magic Ball) recreation.',
			examples: ['8ball am I cool?'],
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
		var possibilities = [
			"It is certain",
            "It is decidedly so",
            "Without a doubt",
            "Yes definitely",
            "You may rely on it",
            "As I see it, yes",
            "Most likely",
            "Outlook good",
            "Yes",
            "Signs point to yes",
            "Reply hazy try again",
            "Ask again later",
            "Better not tell you now",
            "Cannot predict now",
            "Concentrate and ask again",
            "Don't count on it",
            "My reply is no",
            "My sources say no",
            "Outlook not so good",
            "Very doubtful"
		];

		return msg.reply(possibilities[Math.floor(Math.random() * (possibilities.length - 0))]);
	}
}