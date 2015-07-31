function ClientUpdate() { 
	this.clients = {};
	this.food = {};
	this.collisions = [];
	this.ate = {};

	this.root = {};
};

ClientUpdate.prototype.toString = function() { return ClientUpdate.toString(this); };
ClientUpdate.prototype.clear = function() { ClientUpdate.clear(this); return this; };
ClientUpdate.prototype.add_food = function(foodid, food) { ClientUpdate.add_food(this, foodid, food); return this; };
ClientUpdate.prototype.add_collision = function(clientid) { ClientUpdate.add_collision(this, clientid); };
ClientUpdate.prototype.add_ate = function(clientid, foodid) { ClientUpdate.add_ate(this, clientid, foodid); };
ClientUpdate.prototype.update = function(clientid, key, value) { ClientUpdate.update(this, clientid, key, value); return this; };
ClientUpdate.prototype.remove_client = function(clientid) { ClientUpdate.remove_client(this, clientid); return this;};
ClientUpdate.prototype.portable = function() { return ClientUpdate.portable(this); };
ClientUpdate.prototype.empty = function() { return ClientUpdate.empty(this); };

ClientUpdate.toString = function(update) {
	var description = "Clients:";
	for(var clientid in update.clients) {
		description = description+ " " +clientid;
	}


	return description;
};
ClientUpdate.remove_client = function(update, clientid) {
	if(update.clients[clientid]) {
		delete update.clients[clientid];
	}
};
ClientUpdate.add_food = function(update, foodid, food) {
	update.food[foodid] = food;
};
ClientUpdate.add_collision = function(update, clientid) {
	update.collisions.push(clientid);
};
ClientUpdate.add_ate = function(update, clientid, foodid) {
	update.ate[clientid] = foodid;
};
ClientUpdate.update = function(update, clientid, key, value) {
	if(!update.clients[clientid]) {
		update.clients[clientid] = {};
	}

	update.clients[clientid][key] = value;	
};
ClientUpdate.clear = function(update) {
	update.clients = {};
	update.food = {};
	update.ate = {};
	update.collisions = [];

	update.root = {};
};
ClientUpdate.portable = function(update) {
	var obj = update.root;

	if( Object.keys(update.clients).length > 0 ) obj['clients'] = update.clients;
	if( Object.keys(update.food).length > 0 ) obj['food'] = update.food;
	if( Object.keys(update.ate).length > 0 ) obj['ate'] = update.ate;
	if( update.collisions.length > 0 ) obj['collisions'] = update.collisions;

	return obj;
};
ClientUpdate.empty = function(update) {
	for(var client in update.clients) { return false; }
	for(var food in update.food) { return false; }
	for(var ate in update.ate) { return false; }
	for(var key in update.root) { return false; }
	if(update.collisions.length > 0) return false;

	return true;
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = ClientUpdate;
}