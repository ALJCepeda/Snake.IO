function Timer(milliseconds) {
	this.countdown = milliseconds;
	this.count = 0;
	this.last = new Date((new Date().toUTCString()));	
	this.id = 0;

	var that = this;
	this.iteration = function() { };
    this._iteration = function () {
	  that.last = new Date((new Date().toUTCString()));
	  that.count++;
	  that.iteration();
  };
}

Timer.prototype.update = function(milliseconds) { Timer.update(this, milliseconds); };
Timer.prototype.start = function() { Timer.start(this); };
Timer.prototype.portable = function() { return Timer.portable(this); };

Timer.update = function(timer, milliseconds) {
	console.log("Clear id: " + timer.id);
	clearInterval(timer.id);

	if(milliseconds > 0) {
		timer.countdown = milliseconds;
	}
}
Timer.start = function(timer) { 
	timer.id = setInterval(timer._iteration, timer.countdown);
	console.log("Timer id: " + timer.id);
};
Timer.portable = function(timer) {
	return {
		last:timer.last.getTime(),
		count:timer.count
	};
}

Timer.gameTick = 60;//ms
Timer.clientOffset = 20; //Client 
if (typeof module !== "undefined" && module.exports) {
    module.exports = Timer;
}