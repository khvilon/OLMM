OLMM.prototype.createClusterSource = function (vector_source) {
    return new ol.source.Cluster({source: vector_source})
};

OLMM.prototype.createVectorSource = function () {
    return new ol.source.Vector();
};
