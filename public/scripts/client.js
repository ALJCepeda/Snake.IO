function Client(socketid, index) {
	this.socketid = socketid;
	this.index = index;
	this.snake;

	this.gameIteration = function() {
		this.snake.step();
	}
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = Client;
}