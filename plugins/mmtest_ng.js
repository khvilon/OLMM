OLMM.prototype.mmTestNextGenAddFeatures = function(geojson_data) {
    this._mmTestNextGenClearAll();
    this._mmTestNextGenAddFeatures(geojson_data, true)
};

OLMM.prototype.mmTestNextGenAddDynamicFeatures = function(geojson_data) {
    this._mmTestNextGenAddFeatures(geojson_data, false)
};

OLMM.prototype._mmTestNextGenClearAll = function() {
    var source_name, source;

    for (source_name in this.sources) {
        source = this.getSourceByName(source_name);
        if (!!source.getFeatures) {
            source.clear();
        }
    }
};

OLMM.prototype.mmTestDeleteFeatureById = function(feature_id, source_name) {
    var source_name, source, point_feature;

    for (source_name in this.sources) {
        source = this.getSourceByName(source_name);
        if (!!source.getFeatures) {
            point_feature = source.getFeatureById(feature_id);

            source.removeFeature(source.getFeatureById(feature_id));
        }


    }
};

OLMM.prototype._mmTestNextGenAddFeatures = function(geojson_data, need_fit) {

    if (!this.getLayerByName('osm')){
        this.addLayer('osm', this.createOSMLayer(this.createOSMLayer()));
    }

    var json_string = JSON.stringify(geojson_data);
    var geojson = JSON.parse(json_string);

    var features = this.readGeoJSON(geojson);

    if (!this.getLayerByName('lines')){
        var line_layer = this.createVectorLayer(this.styleGraphFunction);
        this.addLayer('lines', line_layer);
    }

    if (!this.getLayerByName('main')){
        this.addLayer('main', this.createVectorLayer(
            new ol.style.Style({ // TODO
                image: new ol.style.Circle({
                    radius: 5,
                    fill: new ol.style.Fill({
                        color: 'black',
                        opacity: 1
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'black',
                        opacity: 1
                    })
                })
            })
            )
        );
    }

    this.getSourceByName('main').addFeatures(features);

    this.transformPointsToLine(features, this.getSourceByName('lines'));

    if (need_fit){
        this.fitToExtent(this.getSourceByName('lines'));
    }
};
