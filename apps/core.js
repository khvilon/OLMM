OLMM.prototype.moveFeaturePointOnSelectLayer = function (feature_id) {
    this.pointsSelectSource = new ol.source.Vector();
    this.pointsSelectLayer = new ol.layer.Vector({
        source: this.pointsSelectSource,
        style: this.stylePointSelectFunction
    });
};