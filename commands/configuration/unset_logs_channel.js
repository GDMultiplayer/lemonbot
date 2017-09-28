const { Command } = require('discord.js-commando');
var MongoClient = require('mongodb').MongoClient;

module.exports = class UnsetLogsChannel extends Command {
	constructor(client) {
		super(client, {
			name: 'unset_logs_channel',
			group: 'configuration',
			memberName: 'unset_logs_channel',
			guildOnly: true,
			description: 'Unsets logs channel.',
			userPermissions: ['MANAGE_GUILD'],
			examples: ['unset_logs_channel']
		});
	}

	run(msg) {
		MongoClient.connect('mongodb://localhost:27017/lemondb', (err, db) => {
			if (err) throw err;
			console.log('UnsetLogsChannel: Database initialized.');

			db.collection('guilds').findOne({ id: channel.guild.id }, (e, res) => {
				if (err) throw err;

				if (res != null) {
					console.log('UnsetLogsChannel: updating guild...');
					db.collection('guilds').updateOne({
						id: res.id,
						welcomeChannelID: res.welcomeChannelID,
						users: res.users
					}, {
						id: res.id,
						welcomeChannelID: res.welcomeChannelID,
						logsChannelID: null,
						users: res.users
					}, (er, r) => {
						if (er) throw er;
						console.log('UnsetLogsChannel: guild updated.');
						msg.say(':ok_hand: Logs channel has been removed.');
						db.close();
					});
				} else {
					console.log('UnsetLogsChannel: inserting new guild...');
					db.collection('guilds').insertOne({
						id: channel.guild.id,
						welcomeChannelID: null,
						logsChannelID: null,
						users: []
					}, (er, r) => {
						if (er) throw er;
						console.log('UnsetLogsChannel: guild inserted.');
						msg.say(':ok_hand: Logs channel has been removed.');
						db.close();
					})
				}
			});
		});
	}
}