OLMM.prototype.enableEditMode = function() {
    if (this.interactions) {
        this.interactions.each(function(){
            this.setActive(true)
        })
    } else {
        var select = new ol.interaction.Select();

        var modify = new ol.interaction.Modify({
          features: select.getFeatures()
        });

        this.map.addInteraction(modify);
        this.interactions = [modify];
    }

};

OLMM.prototype.disableEditMode = function() {
    this.interactions.each(function(){
        this.setActive(false)
    })
};
