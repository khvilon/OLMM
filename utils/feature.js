ol.Feature.prototype.toGeoJSON = function () {
    var feature = this.clone();
    var format = new ol.format.GeoJSON();

    return format.writeFeature(feature);
};
