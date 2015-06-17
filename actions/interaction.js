OLMM.prototype.disableActions = function () {
    var self = this;
    var interaction_name;

    self.disableDeleteMode();

    for (interaction_name in self.interactions) {
        var interaction = self.getInteractionsByName(interaction_name);
        interaction.setActive(false);

        if (interaction_name.indexOf('select') === 0) {
            self.map.removeInteraction(interaction); // TODO remove select from map or clear it
        }
    }
};
