OLMM.prototype.styleGraphFunction = function(feature, resolution)
{
	opacity = 0.9;
    width = 1;
  	var geometry = feature.getGeometry();
  	var styles = [
    	// linestring
		new ol.style.Style({
      	stroke: new ol.style.Stroke({
        	color: [0, 0, 0, opacity],
        	width: width
      	})
		})
  	];

	geometry.forEachSegment(function(start, end) {
    	styles.push(new ol.style.Style({
			geometry: new ol.geom.Point(end),
      		image: new ol.style.Circle({
        		radius: 2,
        		stroke: new ol.style.Stroke({
        	        color: [0, 0, 0, opacity],
		        	width: width
		      	})
      		})
    	}));
    	styles.push(new ol.style.Style({
			geometry: new ol.geom.Point(start),
      		image: new ol.style.Circle({
        		radius: 2,
        		stroke: new ol.style.Stroke({
        	        color: [0, 0, 0, opacity],
		        	width: width
		      	})
      		})
    	}));
        styles.push(new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'black',
                width: 1
            }),
                text: createTextStyle(feature, resolution)
        }));
    });
    return styles;
};

var createTextStyle = function(feature, resolution) {
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

OLMM.prototype.stylePntFunction = function(feature, resolution)
{
	if (feature.visible) opacity = 1;
	else opacity = 0.4;

  	styles = [new ol.style.Style({
      		   image: new ol.style.Icon({
        		src: 'pnt.png',
        		anchor: [0.5, 0.5],
        		rotateWithView: false,
        		rotation: feature.rot*Math.PI/180,
        		opacity:opacity
      		})
    	})
    	];

  	return styles;
};


OLMM.prototype.styleMmProjFunction = function(feature, resolution) {

	if (feature.visible) opacity = 1;
	else opacity = 0.4;

  	var geometry = feature.getGeometry();
  	var styles = [
    	// linestring
		new ol.style.Style({
      	stroke: new ol.style.Stroke({
        	color: [239, 20, 20, opacity],
        	width: 2
      	})
		})
  	];

	geometry.forEachSegment(function(start, end) {
    	styles.push(new ol.style.Style({
			geometry: new ol.geom.Point(end),
      		image: new ol.style.Circle({
        		radius: 4,
        		stroke: new ol.style.Stroke({
        	        color: [239, 20, 20, opacity],
		        	width: 2
		      	})
      		})
    	}));
	});

	return styles;
};


OLMM.prototype.styleGoodProjFunction = function(feature, resolution) {

	if (feature.visible) opacity = 1;
	else opacity = 0.4;

  	var geometry = feature.getGeometry();
  	var styles = [
    	// linestring
		new ol.style.Style({
      	stroke: new ol.style.Stroke({
        	color: [86, 204, 51, opacity],
        	width: 2
      	})
		})
  	];

	geometry.forEachSegment(function(start, end) {
    	styles.push(new ol.style.Style({
			geometry: new ol.geom.Point(end),
      		image: new ol.style.Circle({
        		radius: 4,
        		stroke: new ol.style.Stroke({
        	        color: [86, 204, 51, opacity],
		        	width: 2
		      	})
      		})
    	}));
	});

	return styles;
};


OLMM.prototype.styleLastProjFunction = function(feature, resolution) {

	if (feature.visible) opacity = 1;
	else opacity = 0;

  	var geometry = feature.getGeometry();
  	var styles = [
    	// linestring
		new ol.style.Style({
      	stroke: new ol.style.Stroke({
        	color: [255, 204, 51, opacity],//'#ffcc33',
        	width: 2
      	})
		})
  	];

	geometry.forEachSegment(function(start, end) {
    	styles.push(new ol.style.Style({
			geometry: new ol.geom.Point(end),
      		image: new ol.style.Circle({
        		radius: 4,
        		stroke: new ol.style.Stroke({
        	        color: [255, 204, 51, opacity],//'#ffcc33',
		        	width: 2
		      	})
      		})
    	}));
	});

	return styles;
};


function radians(n) {
    return n * (Math.PI / 180);
}
function degrees(n) {
    return n * (180 / Math.PI);
}

function getBearing(c1, c2){
    var startLong = c1[0];
    var startLat = c1[1];
    var endLong = c2[0];
    var endLat = c2[1];
    startLat = radians(startLat);
    startLong = radians(startLong);
    endLat = radians(endLat);
    endLong = radians(endLong);

    var dLong = endLong - startLong;

    var dPhi = Math.log(Math.tan(endLat/2.0+Math.PI/4.0)/Math.tan(startLat/2.0+Math.PI/4.0));
    if (Math.abs(dLong) > Math.PI){
        if (dLong > 0.0)
            dLong = -(2.0 * Math.PI - dLong);
        else
            dLong = (2.0 * Math.PI + dLong);
    }

    return radians((degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0) + Math.PI / 2.0;
}
