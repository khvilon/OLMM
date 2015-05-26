OLMM.prototype.styleDirectionPointFunction = function (feature, resolution) {
    var opacity, styles;

    var styles = [];
    var geometry = feature.getGeometry();
    var feature_properties = feature.getProperties();

    geometry.forEachSegment(function (start, end) {
        styles.push(new ol.style.Style({
            geometry: new ol.geom.Point(end),
            image: new ol.style.Icon({
                src: 'http://openlayers.org/en/master/examples/data/arrow.png',
                anchor: [0.75, 0.5],
                rotateWithView: false,
                rotation: feature_properties['azimuth']
            })
        }))
    });

    return styles;
};

OLMM.prototype.getStyleForGeoJSON = function (feature, resolution) {

};

OLMM.prototype.styleGraphFunction = function (feature, resolution) {
    var width, opacity, color;

    // TODO шмат кода, сделать алгоритм для плавного изменения зума?
    if (resolution < parseFloat(0.003)) {
        width = 5
    } else if (resolution < parseFloat(0.6)) {
        width = 4
    } else if (resolution < parseFloat(1.2)) {
        width = 3
    } else if (resolution < parseFloat(2.4)) {
        width = 2.5
    } else if (resolution < parseFloat(4.8)) {
        width = 2
    } else if (resolution < parseFloat(10)) {
        width = 1
    } else if (resolution < parseFloat(77)) {
        width = 0.1
    } else {
        width = 0.05
    }

    opacity = 0.9;
    color = feature.getProperties()['color'] || 'black';

    console.log('12312312');

    var geometry = feature.getGeometry();
    var styles = [
        // linestring
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [color, opacity],
                width: width / 2
            }),
            fill: new ol.style.Fill({
                color: color
            })
        })
    ];

    geometry.forEachSegment(function (start, end) {
        styles.push(new ol.style.Style({
            geometry: new ol.geom.Point(end),
            image: new ol.style.Circle({
                radius: 4,
                stroke: new ol.style.Stroke({
                    color: [color, opacity],
                    width: width / 2
                }),
                fill: new ol.style.Fill({
                    color: color
                })
            })
        }));
        styles.push(new ol.style.Style({
            geometry: new ol.geom.Point(start),
            image: new ol.style.Circle({
                radius: 4,
                stroke: new ol.style.Stroke({
                    color: [color, opacity],
                    width: width / 2
                }),
                fill: new ol.style.Fill({
                    color: color
                })
            })
        }));

        styles.push(new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: color,
                width: 1
            }),
            text: createTextStyle(feature, resolution)
        }));
    });
    return styles;
};

var createTextStyle = function (feature, resolution) {
    var align = 'cm';
    var coords = feature.getGeometry().getCoordinates();
    var c1 = ol.proj.transform(coords[0], 'EPSG:3857', 'EPSG:4326');
    var c2 = ol.proj.transform(coords[1], 'EPSG:3857', 'EPSG:4326');
    var rotation = getBearing(c1, c2);
    var font = 12;
    var fillColor = 'black';
    var outlineColor = 'black';
    var outlineWidth = 0.8;

    return new ol.style.Text({
        textAlign: align,
        font: font,
        fontSize: 12,
        text: feature.getId(),
        fill: new ol.style.Fill({color: fillColor}),
        stroke: new ol.style.Stroke({color: outlineColor, width: outlineWidth}),
        offsetY: 5,
        offsetX: 3,
        scale: 0.9,
        rotation: rotation
    });
};

OLMM.prototype.stylePntFunction = function (feature, resolution) {
    styles = [new ol.style.Style({
        image: new ol.style.Icon({
            src: 'pnt.png',
            anchor: [0.5, 0.5],
            rotateWithView: false,
            rotation: 0,
            opacity: 1
        })
    })
    ];


    return styles;
};

OLMM.prototype.stylePointSelectFunction = function (feature, resolution) {

    return new ol.style.Circle({
        radius: 20,
        fill: new ol.style.Fill({
            color: '#ff9900',
            opacity: 1
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc00',
            opacity: 1
        })
    });
};
