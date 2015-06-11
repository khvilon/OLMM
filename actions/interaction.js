OLMM.prototype.disableInteractions = function() {
    var self = this;
    var interaction_name;

    self.disableDeleteMode();

    for (interaction_name in self.interactions) {
        self.getInteractionsByName(interaction_name).setActive(false)
    }
};
