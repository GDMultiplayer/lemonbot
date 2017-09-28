const Commando = require('discord.js-commando');
const path = require('path');
const sqlite = require('sqlite');
const emdef = require('./emdef');
const randomize = require('./randomize');

const api = new Commando.Client({
	commandPrefix: '/',
	owner: '231836506468253696'
});

var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/lemondb', (err, db) => {
	if (err) throw err;
	console.log('Database initialized.');

	db.collections((er, colls) => {
		if (colls.length <= 0) {
			db.createCollection('guilds', (e, res) => {
				console.log('Needed collections has been created.');
				db.close();
			});
		} else {
			console.log('No collection creation needed.');
			db.close();
		}
	});
});

api.registry
    .registerGroups([
        ['moderation', 'Moderation commands'],
        ['fun', 'Fun commands'],
        ['music', 'Music commands'],
        ['configuration', 'Configuration commands']
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'commands'));

api.setProvider(
    sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

api.on('ready', () => {
	console.log('Bot has been loaded.');
});

api.on('message', message => {
	if (message.guild == undefined)
		return;

	MongoClient.connect('mongodb://localhost:27017/lemondb', (err, db) => {
		if (err) throw err;
		console.log('Message: DB init.');

		db.collection('guilds').findOne({ id: message.guild.id }, (e, r) => {
			if (e) throw e;
			if (r == null) {
				db.collection('guilds').insertOne({
					id: message.guild.id,
					welcomeChannelID: null,
					logsChannelID: null,
					users: [{
						id: message.author.id,
						XP: randomize.randInt(1, 5),
						isWarned: false
					}]
				}, (err, r) => {
					if (err) throw err;
					db.close();
					return;
				});
			} else {
				var u = r.users.find((el, i, arr) => {
					if (el.id != message.author.id)
						return false;
					else
						return true;
				});
				if (u == undefined) {
					var oldr = r;
					r.users.push({
								id: message.author.id,
								XP: randomize.randInt(1, 5),
								isWarned: false
							});
					db.collection('guilds').updateOne({id: oldr.id}, {
						$set: {
							users: r.users
						}
					}, (err, res) => {
						if (err) throw err;
						db.close();
					});
				} else {
					var newu = u;
					newu.XP += randomize.randInt(1, 5);

					if (u.XP / 250 < newu.XP / 250) {
						message.reply('You just reached the level ' + Math.floor(newu.XP / 250) + '!');
					}
					var oldr = r;
					r.users.splice(r.users.indexOf(u), 1, newu);

					db.collection('guilds').updateOne({id: oldr.id}, {
						$set: {
							users: r.users
						}
					}, (err, res) => {
						if (err) throw err;
						db.close();
					});
				}
			}
		});
	});
});

api.on('channelCreate', channel => {
	if (channel.guild == undefined)
		return;

	MongoClient.connect('mongodb://localhost:27017/lemondb', (err, db) => {
		if (err) throw err;
		console.log('ChannelCreate: DB init.');

		db.collection('guilds').findOne({ id: channel.guild.id }, (e, r) => {
			if (e) throw e;

			if (r.logsChannelID != null) {
				var ch = api.channels.get(r.logsChannelID);

				if (ch != null) {
					var embed = emdef.getEmbed()
						.setColor(0x22FF22)
						.setTitle('New channel has been created!')
						.addField('Name', channel.name, true)
						.addField('ID', channel.id, true);

					ch.sendEmbed(embed);
				}
			}
		});
	});
});

api.on('channelDelete', channel => {
	if (channel.guild == undefined)
		return;

	MongoClient.connect('mongodb://localhost:27017/lemondb', (err, db) => {
		if (err) throw err;
		console.log('ChannelDelete: DB init.');

		db.collection('guilds').findOne({ id: channel.guild.id }, (e, r) => {
			if (e) throw e;

			if (r.logsChannelID != null) {
				var ch = api.channels.get(r.logsChannelID);

				if (ch != null) {
					var embed = emdef.getEmbed()
						.setColor(0xFF0000)
						.setTitle('Channel has been deleted.')
						.addField('Name', channel.name, true)
						.addField('ID', channel.id, true);

					ch.sendEmbed(embed);
				}
			}
		});
	});
});

api.on('channelPinsUpdate', (channel, time) => {
	if (channel.guild == undefined)
		return;

	MongoClient.connect('mongodb://localhost:27017/lemondb', (err, db) => {
		if (err) throw err;
		console.log('ChannelPinsUpdate: DB init.');

		db.collection('guilds').findOne({ id: channel.guild.id }, (e, r) => {
			if (e) throw e;

			if (r.logsChannelID != null) {
				var ch = api.channels.get(r.logsChannelID);

				if (ch != null) {
					var embed = emdef.getEmbed()
						.setTitle('Pins have been updated in a channel!')
						.addField('Channel Name', channel.name, true)
						.addField('Channel ID', channel.id, true)
						.addField('Time', time, true);

					ch.sendEmbed(embed);
				}
			}
		});
	});
});

api.on('emojiCreate', (emoji) => {
	MongoClient.connect('mongodb://localhost:27017/lemondb', (err, db) => {
		if (err) throw err;
		console.log('EmojiCreate: DB init.');

		db.collection('guilds').findOne({ id: emoji.guild.id }, (e, r) => {
			if (e) throw e;

			if (r.logsChannelID != null) {
				var ch = api.channels.get(r.logsChannelID);

				if (ch != null) {
					var embed = emdef.getEmbed()
						.setTitle('New emoji has been added!')
						.setColor(0x22FF22)
						.setThumbnail(emoji.url)
						.addField('Name', emoji.name, true)
						.addField('ID', emoji.id, true);

					ch.sendEmbed(embed);
				}
			}
		});
	});
});

api.on('emojiDelete', (emoji) => {
	MongoClient.connect('mongodb://localhost:27017/lemondb', (err, db) => {
		if (err) throw err;
		console.log('EmojiDelete: DB init.');

		db.collection('guilds').findOne({ id: emoji.guild.id }, (e, r) => {
			if (e) throw e;

			if (r.logsChannelID != null) {
				var ch = api.channels.get(r.logsChannelID);

				if (ch != null) {
					var embed = emdef.getEmbed()
						.setTitle('Emoji has been deleted!')
						.setColor(0xFF0000)
						.setThumbnail(emoji.url)
						.addField('Name', emoji.name, true)
						.addField('ID', emoji.id, true);

					ch.sendEmbed(embed);
				}
			}
		});
	});
});

api.on('guildBanAdd', (guild, user) => {
	MongoClient.connect('mongodb://localhost:27017/lemondb', (err, db) => {
		if (err) throw err;
		console.log('GuildBanAdd: DB init.');

		db.collection('guilds').findOne({ id: guild.id }, (e, r) => {
			if (e) throw e;

			if (r.logsChannelID != null) {
				var ch = api.channels.get(r.logsChannelID);

				if (ch != null) {
					var embed = emdef.getEmbed()
						.setTitle('User has been banned.')
						.setColor(0xFF0000)
						.setThumbnail(user.displayAvatarURL)
						.addField('User', `${user.username}#${user.discriminator}`, true)
						.addField('ID', user.id, true);

					ch.sendEmbed(embed);
				}
			}
		});
	});
});

api.on('guildBanRemove', (guild, user) => {
	MongoClient.connect('mongodb://localhost:27017/lemondb', (err, db) => {
		if (err) throw err;
		console.log('GuildBanRemove: DB init.');

		db.collection('guilds').findOne({ id: guild.id }, (e, r) => {
			if (e) throw e;

			if (r.logsChannelID != null) {
				var ch = api.channels.get(r.logsChannelID);

				if (ch != null) {
					var embed = emdef.getEmbed()
						.setTitle('User has been unbanned!')
						.setColor(0x22FF22)
						.setThumbnail(user.displayAvatarURL)
						.addField('User', `${user.username}#${user.discriminator}`, true)
						.addField('ID', user.id, true);

					ch.sendEmbed(embed);
				}
			}
		});
	});
});

api.on('guildMemberAdd', (member) => {
	MongoClient.connect('mongodb://localhost:27017/lemondb', (err, db) => {
		if (err) throw err;
		console.log('guildMemberAdd: DB init.');

		db.collection('guilds').findOne({ id: member.guild.id }, (e, r) => {
			if (e) throw e;

			if (r.logsChannelID != null) {
				var ch = api.channels.get(r.logsChannelID);

				if (ch != null) {
					var embed = emdef.getEmbed()
						.setTitle('User has joined!')
						.setColor(0x22FF22)
						.setThumbnail(member.displayAvatarURL)
						.addField('User', `${member.username}#${member.discriminator}`, true)
						.addField('ID', member.id, true)
						.addField('Created At', member.createdAt, true);

					ch.sendEmbed(embed);
				}
			}
		});
	});
});

api.on('guildMemberRemove', (member) => {
	MongoClient.connect('mongodb://localhost:27017/lemondb', (err, db) => {
		if (err) throw err;
		console.log('guildMemberRemove: DB init.');

		db.collection('guilds').findOne({ id: member.guild.id }, (e, r) => {
			if (e) throw e;

			if (r.logsChannelID != null) {
				var ch = api.channels.get(r.logsChannelID);

				if (ch != null) {
					var embed = emdef.getEmbed()
						.setTitle('User has left.')
						.setColor(0xFF0000)
						.setThumbnail(member.displayAvatarURL)
						.addField('User', `${member.username}#${member.discriminator}`, true)
						.addField('ID', member.id, true)
						.addField('Created At', member.createdAt, true)
						.addField('Joined At', member.joinedAt, true);

					ch.sendEmbed(embed);
				}
			}
		});
	});
});

api.on('messageDelete', (message) => {
	if (message.guild == undefined)
		return;

	MongoClient.connect('mongodb://localhost:27017/lemondb', (err, db) => {
		if (err) throw err;
		console.log('messageDelete: DB init.');

		db.collection('guilds').findOne({ id: message.guild.id }, (e, r) => {
			if (e) throw e;

			if (r.logsChannelID != null) {
				var ch = api.channels.get(r.logsChannelID);

				if (ch != null) {
					var embed = emdef.getEmbed()
						.setTitle('Message has been deleted.')
						.setColor(0xFF0000)
						.setThumbnail(message.author.displayAvatarURL)
						.addField('User', `${message.author.username}#${message.author.discriminator}`, true)
						.addField('ID', message.id, true)
						.addField('Content', message.content, true);

					ch.sendEmbed(embed);
				}
			}
		});
	});
});

api.on('messageUpdate', (old, nw) => {
	if (nw.guild == undefined)
		return;

	MongoClient.connect('mongodb://localhost:27017/lemondb', (err, db) => {
		if (err) throw err;
		console.log('messageUpdate: DB init.');

		db.collection('guilds').findOne({ id: nw.guild.id }, (e, r) => {
			if (e) throw e;

			if (r.logsChannelID != null) {
				var ch = api.channels.get(r.logsChannelID);

				if (ch != null) {
					try {
						var embed = emdef.getEmbed()
							.setTitle('Message has been edited.')
							.setThumbnail(nw.author.displayAvatarURL)
							.addField('User', `${nw.author.username}#${nw.author.discriminator}`, true)
							.addField('ID', nw.id, true)
							.addField('Old Content', old.content, true)
							.addField('New Content', nw.content, true);

						ch.sendEmbed(embed);
					} catch(ex) {
						return;
					}
				}
			}
		});
	});
});

api.on('roleCreate', role => {
	MongoClient.connect('mongodb://localhost:27017/lemondb', (err, db) => {
		if (err) throw err;
		console.log('roleCreate: DB init.');

		db.collection('guilds').findOne({ id: role.guild.id }, (e, r) => {
			if (e) throw e;

			if (r.logsChannelID != null) {
				var ch = api.channels.get(r.logsChannelID);

				if (ch != null) {
					var embed = emdef.getEmbed()
						.setTitle('Role has been created!')
						.setColor(0x22FF22)
						.addField('Name', role.name, true)
						.addField('ID', role.id, true);

					ch.sendEmbed(embed);
				}
			}
		});
	});
});

api.on('roleDelete', role => {
	MongoClient.connect('mongodb://localhost:27017/lemondb', (err, db) => {
		if (err) throw err;
		console.log('roleDelete: DB init.');

		db.collection('guilds').findOne({ id: role.guild.id }, (e, r) => {
			if (e) throw e;

			if (r.logsChannelID != null) {
				var ch = api.channels.get(r.logsChannelID);

				if (ch != null) {
					var embed = emdef.getEmbed()
						.setTitle('Role has been deleted.')
						.setColor(0xFF0000)
						.addField('Name', role.name, true);

					ch.sendEmbed(embed);
				}
			}
		});
	});
});

api.login('');