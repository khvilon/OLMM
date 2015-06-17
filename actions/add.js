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

    self.disableActions();

    var interaction_name = 'draw-' + feature_type;

    var cached_add_mode = self.getInteractionsByName(interaction_name);

    if (cached_add_mode) {
        cached_add_mode.setActive(true)
    } else {
        if (!self.getSourceByName(source_name)) {
            var layer = self.createVectorLayer();
            self.addLayer(source_name, layer);
        }

        var source = self.getSourceByName(source_name);

        var draw = new ol.interaction.Draw({
            source: source,
            type: feature_type
        });

        draw.on('drawend', function(event) {
            var feature = event.feature;
            var s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var n = 32;
            var id = Array.apply(null, Array(n)).map(function() { return s.charAt(Math.floor(Math.random() * s.length)); }).join('');
            feature.setId(id);
            self.config['add_callback'](event, event.feature.getMainDataWithCloneAndTransform());
          }, this);

        self.addInteraction(interaction_name, draw);
    }
};
