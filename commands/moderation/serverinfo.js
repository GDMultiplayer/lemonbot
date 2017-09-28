const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class ServerInfo extends Command {
	constructor(client) {
		super(client, {
			name: 'serverinfo',
			aliases: ['server', 'guildinfo', 'guild'],
			group: 'moderation',
			memberName: 'serverinfo',
			guildOnly: true,
			description: 'Shows all info about current guild.',
			examples: ['serverinfo']
		});
	}

	run(msg) {
		var g = msg.guild;

		var em = new RichEmbed()
			.setAuthor(`Lemon`, msg.client.user.displayAvatarURL)
			.setColor(0xeef442)
			.setTitle(g.name)
			.addField('Afk Channel', g.afkChannel, true)
			.addField('Afk Timeout', g.afkTimeout, true)
			.addField('Channel Count', g.channels.values().length, true)
			.addField('Created At', g.createdAt, true)
			.addField('Default Channel', g.defaultChannel, true)
			.addField('Default Role', g.defaultRole, true)
			.addField('Emojis Count', g.emojis.values().length, true)
			.addField('ID', g.id, true)
			.addField('Large server?', g.large, true)
			.addField('Member Count', g.memberCount, true)
			.addField('Name Acronym', g.nameAcronym, true)
			.addField('Owner', g.owner, true)
			.addField('Region', g.region, true)
			.addField('Role Count', g.roles.values().length, true)
			.addField('System Channel', g.systemChannel, true)
			.setThumbnail(g.iconURL);

		msg.embed(em);
	}
}