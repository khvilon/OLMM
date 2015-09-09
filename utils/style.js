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

    module.createClusterIconStyle = function (feature, res, src) {
        return function (feature, res) {
            return [new ol.style.Style({
                image: new ol.style.Icon({
                    src: src
                }),
                text: new ol.style.Text({
                    text: feature.getProperties()['count'],
                    size: 24,
                    fill: new ol.style.Fill({
                        color: '#000000'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#000000'
                    })
                })
            })]
        }
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

        var fill = options['fillStyle'];
        var stroke = options['strokeStyle'];
        var text = options['text'];

        return new ol.style.Text({
            text: text,
            size: 24,
            fill: new ol.style.Fill({
                color: '#000000'
            }),
            stroke: new ol.style.Stroke({
                color: '#000000'
            })
        })


    };
    //module.fillStyle
    //module.strokeStyle
    //module.baseStyle

    module.createIconStyle = function (src, anchorx, anchory) {
        var self = this;
        var anchorX = anchorx || self.getConfigValue('iconAnchorX') || 0;
        var anchorY = anchory || self.getConfigValue('iconAnchorY') || 0;

        return new ol.style.Style({
            image: new ol.style.Icon({
                src: src,
                anchor: [anchorX, anchorY],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels'
            })
        })
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
