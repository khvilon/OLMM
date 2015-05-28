OLMM.prototype.get_points_from_json_data = function (data) {
    var point_features = [];

    for (var i = 0; i < data.length; i++) {
        data[i].coords = this.transform([data[i].lon, data[i].lat]);

        point_features.push(this.createPntFeature(data[i], i));

    }
    //adding features to map
    this.pntsSource.addFeatures(features);

    if (good_projs.length > 0) {
        this.goodProjSource.addFeatures(good_projs);
    }
    if (mm_projs.length > 0) {
        this.mmProjSource.addFeatures(mm_projs);
    }

    this.transformPointsToLine(features, this.lineSource);
    this.fitToExtent(this.lineSource);
};