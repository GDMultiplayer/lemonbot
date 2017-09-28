const { Command } = require('discord.js-commando');
var MongoClient = require('mongodb').MongoClient;

module.exports = class Warn extends Command {
	constructor(client) {
		super(client, {
			name: 'warn',
			group: 'moderation',
			memberName: 'warn',
			guildOnly: true,
			userPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
			description: 'Warns a user.',
			examples: ['warn @Username#0000', 'warn 231836506468253696', 'warn Username'],
			args: [
				{
					key: 'user',
					prompt: 'specify the user you\'d like to warn.',
					type: 'member'
				}
			]
		});
	}

	run(msg, { user }) {
		MongoClient.connect('mongodb://localhost:27017/lemondb', (err, db) => {
			if (err) throw err;
			console.log('warn: DB init.');

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
							isWarned: true
						}]
					}, (err, r) => {
						if (err) throw err;
						msg.reply(`the user ${user} has been warned.`);
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
									isWarned: true
								});
						db.collection('guilds').updateOne({id: oldr.id}, {
							$set: {
								users: r.users
							}
						}, (err, res) => {
							if (err) throw err;
							db.close();
							msg.reply(`the user ${user} has been warned.`);
						});
					} else {
						if (u.isWarned) {
							msg.reply(`the user ${user} is already warned.`);
							db.close();
							return;
						}

						var newu = u;
						newu.isWarned = true;

						var oldr = r;
						r.users.splice(r.users.indexOf(u), 1, newu);

						db.collection('guilds').updateOne({id: oldr.id}, {
							$set: {
								users: r.users
							}
						}, (err, res) => {
							if (err) throw err;
							db.close();
							msg.reply(`the user ${user} has been warned.`);
						});
					}
				}
			});
		});
	}
}