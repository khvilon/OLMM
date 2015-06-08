(function (module) {

    module.drawProjections = function (pointFeature, sourceName) {
        var self = this;

        var point_projections = pointFeature.getProperties().projections || [];
        var features = self.readGeoJSON(point_projections).map(
            function (proj) {
                proj.setProperties({'point_id': pointFeature.getId()});
                return proj
            }
        );

        self.getSourceByName(sourceName).addFeatures(features);
    };

    module.drawAllProjections = function () {
        var self = this;

        self.getSourceByName('main').getFeatures().map(function (pointFeature) {
            self.drawProjections(pointFeature, 'lines')
        })
    };

    module.deleteProjectionsForPoint = function (pointFeature, source_name) {
        var pointFeatureId = pointFeature.getId();
        var projection_source = this.getSourceByName(source_name);

        projection_source.getFeatures().map(function (projection_feature) {
            if (projection_feature.getProperties()['point_id'] == pointFeatureId) {
                projection_source.removeFeature(projection_feature)
            }
        })
    };

    module.changePointProjectionsState = function (pointFeature, projection_source_name, state) {
        state = state || '';
        var featureId = pointFeature.getId();

        this.getSourceByName(projection_source_name).getFeatures().map(function(projection){
            if (projection.getProperties()['point_id'] == featureId) {
                projection.setProperties({'state': 'good_selected'});
                projection.changed();
            }
        });
    };


})(OLMM.prototype);
