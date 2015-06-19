OLMM.prototype.disableActions = function () {
    var self = this;
    var interaction_name;

    self.disableDeleteMode();

    for (interaction_name in self.interactions) {
        self.deleteInteractionsByName(interaction_name);
    }
};
