function Client() {
	this.id;
	this.socket
	this.snake;

	this.gameIteration = function() {
		this.snake.step();
	}
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = Client;
}