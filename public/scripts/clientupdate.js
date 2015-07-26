function ClientUpdate() { 
	this.clients = {};
	this.iteration = {};
};

ClientUpdate.prototype.toString = function() { return ClientUpdate.toString(this); };
ClientUpdate.prototype.clear = function() { ClientUpdate.clear(this); return this; };
ClientUpdate.prototype.portable = function() { return ClientUpdate.portable(this); };
ClientUpdate.prototype.empty = function() { return ClientUpdate.empty(this); };

ClientUpdate.toString = function(update) {
	var description = "Clients:";
	for(var clientid in update.clients) {
		description = description+ " " +clientid;
	}


	return description;
}
ClientUpdate.clear = function(update) {
	update.clients = {};
	update.iteration = {};
};

ClientUpdate.portable = function(update) {
	return {
		clients: update.clients,
		iteration: update.iteration
	};
};
ClientUpdate.empty = function(update) {
	for(var client in update.clients) {
		return false;
	}
	return true;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = ClientUpdate;
}