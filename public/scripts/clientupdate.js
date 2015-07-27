function ClientUpdate() { 
	this.clients = {};
	this.iteration = {};
	this.root = {};
};

ClientUpdate.prototype.toString = function() { return ClientUpdate.toString(this); };
ClientUpdate.prototype.clear = function() { ClientUpdate.clear(this); return this; };
ClientUpdate.prototype.updateSnake = function(clientid, snake) { ClientUpdate.updateSnake(this, clientid, snake); };
ClientUpdate.prototype.removeClient = function(clientid) { ClientUpdate.removeClient(this, clientid); };
ClientUpdate.prototype.portable = function() { return ClientUpdate.portable(this); };
ClientUpdate.prototype.empty = function() { return ClientUpdate.empty(this); };

ClientUpdate.toString = function(update) {
	var description = "Clients:";
	for(var clientid in update.clients) {
		description = description+ " " +clientid;
	}


	return description;
};
ClientUpdate.removeClient = function(update, clientid) {
	if(update.clients[clientid]) {
		delete update.clients[clientid];
	}
}
ClientUpdate.updateSnake = function(update, clientid, snake) {
	if(!update.clients[clientid]) {
		update.clients[clientid] = {};
	}

	update.clients[clientid]['snake'] = snake.portable();	
}
ClientUpdate.clear = function(update) {
	update.clients = {};
	update.iteration = {};
};

ClientUpdate.portable = function(update) {
	var obj = update.root;
	obj['clients'] = update.clients;
	obj['iteration'] = update.iteration;
	
	return obj;
};
ClientUpdate.empty = function(update) {
	for(var client in update.clients) {
		return false;
	}
	return true;
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = ClientUpdate;
}