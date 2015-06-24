OLMM.prototype.enableDrawModeForPoint = function (source_name) {
    this.enableDrawMode('Point', source_name);
};

OLMM.prototype.enableDrawModeForLineString = function (source_name) {
    this.enableDrawMode('LineString', source_name);
};

OLMM.prototype.enableDrawModeForPolygon = function (source_name) {
    this.enableDrawMode('Polygon', source_name);
};

OLMM.prototype.enableDrawMode = function (feature_type, source_name) {
    var self = this;
    source_name = source_name || 'draw';

    if (['Point', 'LineString', 'Polygon', 'Circle', 'MultiLineString'].indexOf(feature_type) == -1) {
        alert(feature_type + ': not allowed');
        return;
    }

    self.disableActions();
    self.makePointerCursor();

    if (!self.getSourceByName(source_name)) {
        var layer = self.createVectorLayer();
        self.addLayer(source_name, layer);
    }

    console.log(self.getStyleByName('draw_style'));

    var source = self.getSourceByName(source_name);

    var draw = new ol.interaction.Draw({
        source: source,
        type: feature_type,
        style: self.getStyleByName('draw_style')
    });

    draw.on('drawend', function (event) {
        var feature = event.feature;
        var s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var n = 32;
        feature.setId(
            Array.apply(null, Array(n)).map(function () {
                return s.charAt(Math.floor(Math.random() * s.length));
            }).join('')
        );
        self.config['add_callback'](event, event.feature.getMainDataWithCloneAndTransform());
    }, this);

    self.addInteraction(draw);
};
