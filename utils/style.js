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

    module.iconStyle = function (options) {
        options = options || {};

        var self = this;
        var src = options['src'] || self.getConfigValue('iconSrc');
        var anchorX = options['anchorx'] || self.getConfigValue('iconAnchorX');
        var anchorY = options['anchory'] || self.getConfigValue('iconAnchorY');

        return new ol.style.Icon({
            src: src,
            anchor: [anchorX, anchorY],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels'
        })
    };

    module.textStyle = function (options) {
        options = options || {};

        var fill = options['fill'];
        var stroke = options['stroke'];
        var text = options['text'];
        var size = options['size'];

        return new ol.style.Text({
            text: text,
            size: size,
            fill: fill,
            stroke: stroke
        })
    };

    module.fillStyle = function (options) {
        options = options || {};

        var color = options['color'];

        return new ol.style.Fill({
            color: color
        })
    };

    module.strokeStyle = function (options) {
        options = options || {};

        var color = options['color'];
        var width = options['width'] || 1;

        return new ol.style.Stroke({
            color: color
        })
    };

    module.createIconStyle = function (src, anchorx, anchory) {
        return this.createBaseIconStyle(src, anchorx, anchory);  // backward compatibility
    };

    module.createBaseIconStyle = function (src, anchorx, anchory) {
        var self = this;
        var anchorX = anchorx || self.getConfigValue('iconAnchorX') || 0;
        var anchorY = anchory || self.getConfigValue('iconAnchorY') || 0;

        return new ol.style.Icon({
            src: src,
            anchor: [anchorX, anchorY],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels'
        })
    };

})(OLMM.prototype);
