ol.Feature.prototype.toGeoJSON = function () {
    var feature = this;
    var format = new ol.format.GeoJSON();

    return format.writeFeature(feature);
};
