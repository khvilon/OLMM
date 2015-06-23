OLMM.prototype.createClusterSource = function (vector_source) {
    return new ol.source.Cluster({source: vector_source})
};

OLMM.prototype.createVectorSource = function () {
    return new ol.source.Vector();
};

OLMM.prototype.clearSource = function (source_name) {
    this.getSourceByName(source_name).clear();
};

OLMM.prototype.clearSources = function () {
    var self = this;
    for (var source_name in self.sources) {
        var source = self.getSourceByName(source_name);
        if (!!source.getFeatures) {
            source.clear();
        }
    }
};
