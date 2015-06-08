OLMM.prototype.enableDrawModeForPoint = function (source_name) {
    this.enableDrawMode('Point', source_name);
};

OLMM.prototype.enableDrawModeForLineString = function (source_name) {
    this.enableDrawMode('LineString', source_name);
};

OLMM.prototype.enableDrawModeForPolygon = function (source_name) {
    this.enableDrawMode('Polygon', source_name);
};

OLMM.prototype.enableDrawModeForCircle = function (source_name) {
    this.enableDrawMode('Circle', source_name);
};

OLMM.prototype.enableDrawMode = function(feature_type, source_name) {
    var self = this;

    if (['Point', 'LineString', 'Polygon', 'Circle'].indexOf(feature_type) == -1) {
        alert(feature_type+': not allowed');
        return;
    }

    self.disableDrawMode();

    var cached_add_mode = self.getInteractionsByName(feature_type);

    if (cached_add_mode) {
        cached_add_mode.setActive(true)
    } else {

        var layer = self.createVectorLayer();
        self.addLayer('draw', layer);
        var source = self.getSourceByName('draw');

        var draw = new ol.interaction.Draw({
            source: source,
            type: feature_type,
            callbacks: { done: function() { console.log('polygon done')} }
        });

        draw.on('drawend', function(event) {
            var format = new ol.format.GeoJSON();
            console.log(format.writeFeature(event.feature));
            console.log('draw end!');
          }, this);

        self.addInteraction(feature_type, draw);
        self.map.addInteraction(draw);
    }
};

OLMM.prototype.disableDrawMode = function() {
    var self = this;
    for (var interaction_name in self.interactions) {
        self.interactions[interaction_name].setActive(false)
    }
};
