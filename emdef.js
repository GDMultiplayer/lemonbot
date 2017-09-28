const { RichEmbed } = require('discord.js');

module.exports = {
	getEmbed: function() {
		return new RichEmbed()
			.setAuthor('Lemon', 'http://savidasangria.com/wp-content/uploads/2013/11/Lemon.jpg')
			.setColor(0xeef442);
	}
}