OLMM.prototype.addDeleteFunction = function () {
    this.map.on('doubleclick', function(evt){
        var feature = this.forEachFeatureAtPixel(evt.pixel,
            function(feature, layer) {
                return feature;
            });
        if (feature && feature.get('name') == 'Point') {
            var id = feature.getId();
            console.log(feature.get('name'), id);
            feature.remove();
        }
    });
};

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
