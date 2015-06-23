(function (module) {

    module.readGeoJSON = function(geojson, setId) {
        setId = setId || false;

        return new ol.format.GeoJSON().readFeatures(geojson).map(function (feature) {
            var featureProperties = feature.getProperties();
            feature = module.transformWithGeometryFromLonLat(feature);

            if (setId) {
                if (featureProperties['id']) { feature.setId(featureProperties['id']) }
            }

            return feature;
        });
    };

    module.addFeaturesFromGeoJSON = function(kwargs_data) {
        var self = this;

        var geojson_data = kwargs_data['geojson_data'] || [];
        var source_name = kwargs_data['source_name'] || '';
        var need_fit = kwargs_data['need_fit'] || false;

        var features = self.readGeoJSON(geojson_data, true);

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

        self.addFeaturesFromGeoJSON({
            geojson_data: geojson,
            source_name: source_name,
            need_fit: false
        })
    }

})(OLMM.prototype);
