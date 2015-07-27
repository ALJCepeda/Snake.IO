function ClientUpdate() { 
	this.clients = {};
	this.root = {};
};

ClientUpdate.prototype.toString = function() { return ClientUpdate.toString(this); };
ClientUpdate.prototype.clear = function() { ClientUpdate.clear(this); return this; };
ClientUpdate.prototype.update = function(clientid, key, value) { ClientUpdate.update(this, clientid, key, value); };
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
ClientUpdate.update = function(update, clientid, key, value) {
	if(!update.clients[clientid]) {
		update.clients[clientid] = {};
	}

	update.clients[clientid][key] = value;	
}
ClientUpdate.clear = function(update) {
	update.clients = {};
};

ClientUpdate.portable = function(update) {
	var obj = update.root;
	obj['clients'] = update.clients;
	
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