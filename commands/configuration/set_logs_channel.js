const { Command } = require('discord.js-commando');
var MongoClient = require('mongodb').MongoClient;

module.exports = class SetLogsChannel extends Command {
	constructor(client) {
		super(client, {
			name: 'set_logs_channel',
			group: 'configuration',
			memberName: 'set_logs_channel',
			guildOnly: true,
			description: 'Sets logs channel.',
			userPermissions: ['MANAGE_GUILD'],
			examples: ['set_logs_channel #channelname', 'set_logs_channel 231836506468253696', 'set_logs_channel channelname'],
			args: [
				{
					key: 'channel',
					prompt: 'A channel to set logs for.',
					type: 'channel'
				}
			]
		});
	}

	run(msg, { channel }) {
		MongoClient.connect('mongodb://localhost:27017/lemondb', (err, db) => {
			if (err) throw err;
			console.log('SetLogsChannel: Database initialized.');

			db.collection('guilds').findOne({ id: channel.guild.id }, (e, res) => {
				if (err) throw err;

				if (res != null) {
					console.log('SetLogsChannel: updating guild...');
					db.collection('guilds').updateOne({
						id: res.id,
						welcomeChannelID: res.welcomeChannelID,
						users: res.users
					}, {
						id: res.id,
						welcomeChannelID: res.welcomeChannelID,
						logsChannelID: channel.id,
						users: res.users
					}, (er, r) => {
						if (er) throw er;
						console.log('SetLogsChannel: guild updated.');
						msg.say(':ok_hand: Logs channel has been set to <#' + channel.id + '>!');
						db.close();
					});
				} else {
					console.log('SetLogsChannel: inserting new guild...');
					db.collection('guilds').insertOne({
						id: channel.guild.id,
						welcomeChannelID: null,
						logsChannelID: channel.id,
						users: []
					}, (er, r) => {
						if (er) throw er;
						console.log('SetLogsChannel: guild inserted.');
						msg.say(':ok_hand: Logs channel has been set to <#' + channel.id + '>!');
						db.close();
					})
				}
			});
		});
	}
}