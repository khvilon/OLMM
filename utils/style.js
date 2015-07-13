(function (module) {

    module.setLayerStyle = function (style_name, layer_name) {
        var style = this.getStyleByName(style_name);
        var layer = this.getLayerByName(layer_name);
        layer.setStyle(style);
    };

    module.addStyle = function(name, style) {
        this.styles[name] = style;
        return style;
    };

    module.getStyleByName = function(name) {
        return this.styles[name]
    };

    module.createClusterIconStyle = function (f, r) {
        var size = f.get('features').length;
        var sizeStr = size.toString();

        return new ol.style.Style({
            image: new ol.style.Circle({
              radius: 10,
              stroke: new ol.style.Stroke({
                color: '#fff'
              }),
              fill: new ol.style.Fill({
                color: '#3399CC'
              })
            }),
            text: new ol.style.Text({
                text: sizeStr,
                size: 18,
                fill: new ol.style.Fill({
                    color: '#000000'
                })
            })
        })
    };

    module.createIconStyle = function (src) {
        return new ol.style.Style({
            image: new ol.style.Icon({
                src: src
            })
        })
    };

})(OLMM.prototype);
