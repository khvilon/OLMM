OLMM.prototype.enableDrawModeForPoint = function (source_name) {
    this.enableDrawMode('Point', source_name);
};

OLMM.prototype.enableDrawModeForLineString = function (source_name) {
    this.enableDrawMode('LineString', source_name);
};

OLMM.prototype.enableDrawModeForPolygon = function (source_name) {
    this.enableDrawMode('Polygon', source_name);
};

OLMM.prototype.enableDrawMode = function(feature_type, source_name) {
    var self = this;
    source_name = source_name || 'draw';

    if (['Point', 'LineString', 'Polygon', 'Circle'].indexOf(feature_type) == -1) {
        alert(feature_type+': not allowed');
        return;
    }

    self.disableInteractions();

    var interaction_name = 'draw-' + feature_type;

    var cached_add_mode = self.getInteractionsByName(interaction_name);

    if (cached_add_mode) {
        cached_add_mode.setActive(true)
    } else {
        if (!self.getSourceByName(source_name)) {
            var layer = self.createVectorLayer();
            self.addLayer(source_name, layer);
        }
    }

    var source = self.getSourceByName(source_name);

    var draw = new ol.interaction.Draw({
        source: source,
        type: feature_type
    });

    draw.on('drawend', function(event) {
        var format = new ol.format.GeoJSON();
        // clone to prevent overwrite current feature
        source.addFeature(event.feature);
        var geojson = format.writeFeature(self.transformWithGeometryToLonLat(event.feature.clone()));
        self.config['add_callback'](event, geojson);
      }, this);

    self.addInteraction(interaction_name, draw);
};
