OLMM.prototype.addDeleteFunction = function () {
    this.map.on('doubleclick', function(evt){
        var feature = this.forEachFeatureAtPixel(evt.pixel,
            function(feature, layer) {
                return feature;
            });
        if (feature) {
            var id = feature.getId();
            console.log(feature.get('name'), id);
            feature.remove();
        }
    });
};
