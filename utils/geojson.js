(function (module) {

    module.readGeoJSON = function(geojson) {
        return new ol.format.GeoJSON().readFeatures(geojson).map(function (feature) {
            return feature.transformWithGeometryFromLonLat();
        });
    };

    module.addFeaturesFromGeoJSON = function(options) {
        var self = this;

        var geojson_data = options['geojson_data'] || [];
        var source_name = options['source_name'] || '';
        var need_fit = options['need_fit'] || false;

        var features = self.readGeoJSON(geojson_data);

        self.getSourceByName(source_name).addFeatures(features);

        if (need_fit){
            self.fitToExtent(source_name);
        }
    };

    module.updateFeatureWithGeoJSON = function (featureId, source_name, geojson) {
        var self = this;
        
        var source = self.getSourceByName(source_name);
        var feature = source.getFeatureById(featureId);
        source.removeFeature(feature);

        self.removeSelect();

        self.addFeaturesFromGeoJSON({
            geojson_data: geojson,
            source_name: source_name,
            need_fit: false
        });
    }

})(OLMM.prototype);
