const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
var MongoClient = require('mongodb').MongoClient;

module.exports = class UserInfo extends Command {
	constructor(client) {
		super(client, {
			name: 'userinfo',
			group: 'moderation',
			memberName: 'userinfo',
			guildOnly: true,
			description: 'Shows all info about user.',
			examples: ['userinfo @Username#0000', 'userinfo 231836506468253696', 'userinfo Username'],
			args: [
				{
					key: 'user',
					prompt: 'A user.',
					type: 'member'
				}
			]
		});
	}

	run(msg, { user }) {
		MongoClient.connect('mongodb://localhost:27017/lemondb', (err, db) => {
			if (err) throw err;
			console.log('userinfo: DB init.');

			db.collection('guilds').findOne({ id: user.guild.id }, (e, r) => {
				if (e) throw e;
				if (r == null) {
					db.collection('guilds').insertOne({
						id: user.guild.id,
						welcomeChannelID: null,
						logsChannelID: null,
						users: [{
							id: message.author.id,
							XP: 0,
							isWarned: false
						}]
					}, (err, r) => {
						if (err) throw err;
						var em = new RichEmbed()
							.setAuthor(`${user.user.username}#${user.user.discriminator}`, user.user.displayAvatarURL)
							.setColor(0xeef442)
							.addField('Is bot?', user.user.bot, true)
							.addField('Created At', user.user.createdAt, true)
							.addField('ID', user.user.id, true)
							.addField('Display Name', user.displayName, true)
							.addField('Status', user.presence.status, true)
							.addField('Muted?', user.mute, true)
							.addField('Last message ID', user.lastMessageID, true)
							.addField('Highest Role', user.highestRole.name, true)
							.addField('Deafened?', user.deaf, true)
							.addField('Joined At', user.joinedAt, true)
							.addField('Is Warned?', 'false', true);

						msg.embed(em);
						db.close();
						return;
					});
				} else {
					var u = r.users.find((el, i, arr) => {
						if (el.id != user.id)
							return false;
						else
							return true;
					});
					if (u == undefined) {
						var oldr = r;
						r.users.push({
									id: user.id,
									XP: 0,
									isWarned: false
								});
						db.collection('guilds').updateOne({id: oldr.id}, {
							$set: {
								users: r.users
							}
						}, (err, res) => {
							if (err) throw err;
							db.close();
							var em = new RichEmbed()
							.setAuthor(`${user.user.username}#${user.user.discriminator}`, user.user.displayAvatarURL)
							.setColor(0xeef442)
							.addField('Is bot?', user.user.bot, true)
							.addField('Created At', user.user.createdAt, true)
							.addField('ID', user.user.id, true)
							.addField('Display Name', user.displayName, true)
							.addField('Status', user.presence.status, true)
							.addField('Muted?', user.mute, true)
							.addField('Last message ID', user.lastMessageID, true)
							.addField('Highest Role', user.highestRole.name, true)
							.addField('Deafened?', user.deaf, true)
							.addField('Joined At', user.joinedAt, true)
							.addField('Is Warned?', 'false', true);

						msg.embed(em);
						});
					} else {
						var em = new RichEmbed()
							.setAuthor(`${user.user.username}#${user.user.discriminator}`, user.user.displayAvatarURL)
							.setColor(0xeef442)
							.addField('Is bot?', user.user.bot, true)
							.addField('Created At', user.user.createdAt, true)
							.addField('ID', user.user.id, true)
							.addField('Display Name', user.displayName, true)
							.addField('Status', user.presence.status, true)
							.addField('Muted?', user.mute, true)
							.addField('Last message ID', user.lastMessageID, true)
							.addField('Highest Role', user.highestRole.name, true)
							.addField('Deafened?', user.deaf, true)
							.addField('Joined At', user.joinedAt, true)
							.addField('Is Warned?', u.isWarned, true);

						msg.embed(em);
						db.close();
						return;
					}
				}
			});
		});
	}
}