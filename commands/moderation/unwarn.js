const { Command } = require('discord.js-commando');
var MongoClient = require('mongodb').MongoClient;

module.exports = class Unwarn extends Command {
	constructor(client) {
		super(client, {
			name: 'unwarn',
			group: 'moderation',
			memberName: 'unwarn',
			guildOnly: true,
			userPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
			description: 'Unwarns a user.',
			examples: ['unwarn @Username#0000', 'unwarn 231836506468253696', 'unwarn Username'],
			args: [
				{
					key: 'user',
					prompt: 'specify the user you\'d like to unwarn.',
					type: 'member'
				}
			]
		});
	}

	run(msg, { user }) {
		MongoClient.connect('mongodb://localhost:27017/lemondb', (err, db) => {
			if (err) throw err;
			console.log('unwarn: DB init.');

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
						msg.reply(`the user ${user} isn't warned.`);
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
							msg.reply(`the user ${user} isn't unwarned.`);
						});
					} else {
						if (!u.isWarned) {
							msg.reply(`the user ${user} isn't unwarned.`);
							db.close();
							return;
						}

						var newu = u;
						newu.isWarned = false;

						var oldr = r;
						r.users.splice(r.users.indexOf(u), 1, newu);

						db.collection('guilds').updateOne({id: oldr.id}, {
							$set: {
								users: r.users
							}
						}, (err, res) => {
							if (err) throw err;
							db.close();
							msg.reply(`the user ${user} has been unwarned.`);
						});
					}
				}
			});
		});
	}
}