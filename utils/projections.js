(function (module) {

    module.drawProjections = function (pointFeature, sourceName) {
        var self = this;
        var point_projections = pointFeature.getProperties().projections || [];

        self.getSourceByName(sourceName).addFeatures(self.readGeoJSON(point_projections));
    };

    module.drawAllProjections = function () {
        var self = this;

        self.getSourceByName('main').getFeatures().map(function (pointFeature) {
            self.drawProjections(pointFeature, 'lines')
        })
    }

})(OLMM.prototype);
