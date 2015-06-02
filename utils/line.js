OLMM.prototype.DrawLine = function(line_color, line_width, lat, lon, id){
    var style, layer, source, feature, transformed_coords;

    style = this.createCustomLineStyle(line_color, line_width);

    transformed_coords = this.transform([lat, lon]);

    feature = new ol.Feature({
        geometry: new ol.geom.LineString(transformed_coords),
        name: id
    });
    feature.setId(id);

    layer = this.createVectorLayer(style, [feature]);
};
