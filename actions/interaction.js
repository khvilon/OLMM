OLMM.prototype.disableActions = function () {
    var self = this;
    var interaction_name;

    self.disableDeleteMode();

    for (interaction_name in self.interactions) {
        self.getInteractionsByName(interaction_name).setActive(false)
    }

    self.enableDefaultInteractions();
};

OLMM.prototype.disableDefaultInteractions = function () {
    this.getDefaultInteractions().forEach(function(t){t.setActive(false)})
};

OLMM.prototype.enableDefaultInteractions = function () {
    this.getDefaultInteractions().forEach(function(t){t.setActive(true)})
};
