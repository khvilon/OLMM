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

    module.createIconStyle = function (src) {
        return new ol.style.Style({
            image: new ol.style.Icon({
                src: src
            })
        })
    };

})(OLMM.prototype);
