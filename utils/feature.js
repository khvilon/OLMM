(function (module) {

    module.toGeoJSON = function () {
        var feature = this.clone();
        var format = new ol.format.GeoJSON();

        return format.writeFeature(feature);
    };

    module.getMainData = function () {
        var geometry = this.getGeometry();
        return {
            'id': this.getId() || '',
            'coords': geometry.getCoordinates() || '',
            'type': geometry.getType() || ''
        }
    };

    module.getMainDataWithCloneAndTransform = function () {
        var feature = this;
        feature = feature.clone();
        return feature.transformWithGeometryToLonLat().getMainData()
    };

    module.transform_from_lot_lan = function () {
        return this._transform('EPSG:4326', 'EPSG:3857');
    };

    module.transform_to_lot_lan = function () {
        return this._transform('EPSG:3857', 'EPSG:4326');
    };

    module._transform = function (from, to) {

        var data = this.getGeometry().getCoordinates();

        if (!data) {
            return;
        }

        // TODO Polygon wtf :( [[[], [], []]]
        if (data.length == 1) {
            data = data[0];
        }

        if (data[0] instanceof Array) {
            var coords = data.map(function (line_coords) {
                return ol.proj.transform(line_coords, from, to)
            });
            return coords;
        }
        else {
            return ol.proj.transform(data, from, to)
        }
    };

    module.transformWithGeometryFromLonLat = function () {
        var self = this;
        return self.transformWithGeometry(self.transform_from_lot_lan)
    };

    module.transformWithGeometryToLonLat = function () {
        var self = this;
        return self.transformWithGeometry(self.transform_to_lot_lan)
    };

    module.transformWithGeometry = function (transform_function) {
        var feature = this;
        var geometry = feature.getGeometry();
        var geometry_type = geometry.getType();
        var coords = geometry.getCoordinates();

        var geometry_type_map = {
            'LineString': ol.geom.LineString,
            'Point': ol.geom.Point,
            'Polygon': ol.geom.Polygon,
            'Circle': ol.geom.Circle,
            'MultiLineString': ol.geom.MultiLineString
        };

        var new_coords = transform_function.call(feature, coords);
        var geometryType = geometry_type_map[geometry_type];
        if (geometry_type == 'Polygon' || geometry_type == 'MultiLineString') { // TODO Polygon wtf :( [[[], [], []]]
            new_coords = [new_coords]
        }
        var new_geometry = new geometryType(new_coords);
        feature.setGeometry(new_geometry);

        return feature
    };

})(ol.Feature.prototype);
