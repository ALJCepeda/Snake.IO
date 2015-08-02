function Timer(milliseconds) {
	this.countdown = milliseconds;
	this.last = new Date((new Date().toUTCString()));	
	this.id = 0;

	var that = this;
	this.iteration = function() { };
    this._iteration = function () {
	  that.last = new Date((new Date().toUTCString()));
	  that.iteration();
  };
}

Timer.prototype.update = function(milliseconds) { Timer.update(this, milliseconds); };
Timer.prototype.start = function() { Timer.start(this); };
Timer.prototype.portable = function() { return Timer.portable(this); };

Timer.update = function(timer, milliseconds) {
	clearInterval(timer.id);

	if(milliseconds > 0) {
		timer.countdown = milliseconds;
	}
}
Timer.start = function(timer) { 
	timer.id = setInterval(timer._iteration, timer.countdown);
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = Timer;
}