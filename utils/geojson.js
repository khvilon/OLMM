(function (module) {

    module.readGeoJSON = function(geojson, setId) {
        setId = setId || false;
        var transformer = ol.proj.transform;

        return new ol.format.GeoJSON().readFeatures(geojson).map(function (feature) {
            var geometry_type = feature.getGeometry().getType();
            var coords = feature.getGeometry().getCoordinates();
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

        var geojson = JSON.parse(JSON.stringify(geojson_data));
        var features = self.readGeoJSON(geojson, true);

        self.getSourceByName(source_name).addFeatures(features);

        if (need_fit){
            self.fitToExtent('main');
        }
    };

})(OLMM.prototype);
