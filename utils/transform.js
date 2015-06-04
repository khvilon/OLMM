(function (module) {

    module.transform = function (data) {

        if (!data) {
            return;
        }

        if (data[0].length > 1) {
            return data.map(function (line_coords) {
                console.log(ol.proj.transform(line_coords, 'EPSG:4326', 'EPSG:3857')) ;
                return ol.proj.transform(line_coords, 'EPSG:4326', 'EPSG:3857')
            });
        }
        else {
            return ol.proj.transform(data, 'EPSG:4326', 'EPSG:3857')
        }
    };

    module.transformPointsToLine = function(features, source_name){
        var self = this;

        var line_coords = features.map(function (feature) {
            return feature.getGeometry().getCoordinates();
        });

        var feature = new ol.Feature({
            geometry: new ol.geom.LineString(line_coords)
        });

        if (source_name) {
            self.getSourceByName(source_name).addFeature(feature);
        }
        return feature
    };

})(OLMM.prototype);
