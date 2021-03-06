(function (module) {

    module.createClusterSource = function (vector_source) {
        return new ol.source.Cluster({source: vector_source})
    };

    module.createVectorSource = function () {
        return new ol.source.Vector();
    };

    module.clearSource = function (source_name) {
        this.getSourceByName(source_name).clear();
    };

    module.clearSources = function () {
        var self = this;
        for (var source_name in self.sources) {
            var source = self.getSourceByName(source_name);
            if (!!source.getFeatures) {
                source.clear();
            }
        }
    };

    module.getSourceByName = function(name) {
        return this.sources[name];
    };

    module.addSource = function(name, source) {
        var self = this;
        if (!self.getSourceByName(name)) {
            self.sources[name] = source || self.createVectorSource()
        }
    };

})(OLMM.prototype);
