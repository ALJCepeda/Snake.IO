function Client(socket) {
	this.id = socket.id;
	this.socket = socket;
	this.needsUpdate = false;
	this.snake;

	this.gameIteration = function() {
		this.snake.step();
	}
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = Client;
}