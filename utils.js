OLMM.prototype.DrawLine = function(line_color, line_width, coord1, coord2, id){
    var style, layer, source, feature, transformed_coords;

    style = this.createCustomLineStyle(line_color, line_width);
    source = this.createVectorSource();
    layer = this.createVectorLayer(source, style);

    transformed_coords = this.transform([coord1, coord2]);

    feature = new ol.Feature({
        geometry: new ol.geom.LineString(transformed_coords),
        name: id
    });
    feature.setId(id);

    source.addFeature(feature);
};
