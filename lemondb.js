var music = {
	players: [
	],
	templates: {
		player: {
			queue: {
				list: [],
				position: 0
			},
			guildID: null,
			startedBy: null,
			dispatcher: null
		},
		song: {
			title: "",
			url: ""
		}
	}
};

var MusicDB = {
	getPlayer: function(guildID) {
		return music.players.find((e, i, a) => { return e.id == id });
	},

	addPlayer: function(player) {
		music.players.push(player);
	},

	updatePlayer: function(oldPlayer, newPlayer) {
		music.players.splice(music.players.indexOf(oldPlayer), 1, newPlayer);
	},

	getPlayerTemplate: function() {
		return music.templates.player;
	},

	getSongTemplate: function() {
		return music.templates.song;
	},

	getPlayerQueue: function(guildID) {
		return this.getPlayer(guildID).queue;
	},

	addSongToQueue: function(song, guildID) {
		var player = this.getPlayer(guildID);
		player.queue.list.push(song);

		this.updatePlayer(this.getPlayer(guildID), player);
	},

	removeSongFromQueue: function(song, guildID)
}