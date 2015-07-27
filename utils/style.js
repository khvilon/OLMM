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

    module.createClusterIconStyleTesting = function (f, r) {
        var self = this;

        var size = f.get('features').length;
        var label;
        if (size == 1) {
            label = ''
        } else {
            label = size.toString();
        }

        return [new ol.style.Style({
            image: new ol.style.Icon({
                src: 'http://icons.iconarchive.com/icons/icojam/blueberry-basic/32/check-icon.png'
            }),
            text: new ol.style.Text({
                text: label,
                size: 24,
                fill: new ol.style.Fill({
                    color: '#000000'
                }),
                stroke: new ol.style.Stroke({
                    color: '#000000'
                })
            })
        })]
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

})(OLMM.prototype);
