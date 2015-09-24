(function (module) {

    module.getViewPortCoords = function () {
        var self = this;
        var extent = self.map.getView().calculateExtent(self.map.getSize());
        var extent_to_transform = [[extent[0], extent[1]], [extent[2], extent[3]]];
        return self.transform_to_lot_lan(extent_to_transform)
    };

    module.fitToCoords = function (lon, lat) {
        var self = this;
        self.map.getView().setCenter(self.transform([lon, lat]));
    };

    module.fitToFeature = function (feature) {
        var self = this;
        self.map.getView().setCenter(feature.getGeometry().getCoordinates());
    };

    module.fitToExtent = function (source_name) {
        var self = this;
        var source = self.getSourceByName(source_name);
        self.map.getView().fitExtent(source.getExtent(), self.map.getSize());
    };

    module.getCoordsForRequest = function () {
        var coords = this.getViewPortCoords();

        return {
            'min_lot': coords[0],
            'min_lat': coords[1],
            'max_lot': coords[2],
            'max_lat': coords[3]
        }
    };

    module.baseShift = function (isHorizon, isPositive, ratio) {
        var view = olmm.map.getView();
        var center = view.getCenter();
        var res = view.getResolution();
        var diff = (ratio || 40) * res;

        var index = 1;
        if (isHorizon === true) {
            index = 0
        }

        if (isPositive === true) {
            center[index] += diff
        } else {
            center[index] -= diff
        }

        var newCenter = [center[0], center[1]];
        view.setCenter(newCenter);
        return newCenter;
    };

    module.shiftLeft = function (ratio) {
        return this.baseShift(true, false, ratio)
    };

    module.shiftRight = function (ratio) {
        return this.baseShift(true, true, ratio)
    };

    module.shiftUp = function (ratio) {
        return this.baseShift(false, true, ratio)
    };

    module.shiftDown = function (ratio) {
        return this.baseShift(false, false, ratio)
    };

})(OLMM.prototype);

(function (module) {

    module.getFeatureAtPixel = function (pixel, layerObj, type) {
        var feature = this.forEachFeatureAtPixel(pixel,
            function (feature, layer) {
                if (layerObj) {
                    if (layer == layerObj) {
                        return feature;
                    }
                } else {
                    return feature
                }
            });
        if (type && feature && feature.getGeometry().getType() == type) {
            return feature
        } else if (!type) {
            return feature
        }
    }

})(ol.Map.prototype);