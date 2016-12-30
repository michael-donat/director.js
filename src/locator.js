module.exports = function(command, registry) {
	return registry.get(command.ID);
}
