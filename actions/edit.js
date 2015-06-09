OLMM.prototype.enableEditMode = function() {
    var self = this;

    if (Object.keys(this.interactions).length > 0) {
        this.interactions.map(function(interaction){
            interaction.setActive(true)
        })
    } else {
        var select = new ol.interaction.Select();

        var modify = new ol.interaction.Modify({
            features: select.getFeatures()
        });
        this.map.addInteraction(select);
        this.map.addInteraction(modify);
        this.interactions = [modify, select];
    }
};

OLMM.prototype.disableEditMode = function() {
    this.interactions.map(function(interaction){
        interaction.setActive(false)
    })
};
