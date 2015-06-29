(function (module) {

    module.addInteraction = function (interaction) {
        this.interaction = interaction;
        this.map.addInteraction(interaction);
    };

    module.getInteraction = function () {
        return this.interaction
    };

    module.removeInteraction = function () {
        var interaction = this.getInteraction();
        if (interaction) {
            interaction.setActive(false);
            this.map.removeInteraction(interaction);
            this.select = null
        }
    };

    module.disableActions = function () {
        var self = this;
        self.disableDeleteMode();
        self.removeSelect();
        self.removeInteraction();
        self.makeDefaultCursor();
    };

})(OLMM.prototype);
