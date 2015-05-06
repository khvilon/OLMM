OLMM.prototype.stylePntFunction = function(feature, resolution)
{
	if (feature.visible) opacity = 1;
	else opacity = 0;

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


OLMM.prototype.styleProjFunction = function(feature, resolution) {

	if (feature.visible) opacity = 1;
	else opacity = 0;

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
    	/*var dx = end[0] - start[0];
    	var dy = end[1] - start[1];
    	var rotation = Math.atan2(dy, dx);
    	// arrows
    	styles.push(new ol.style.Style({
			geometry: new ol.geom.Point(end),
      		image: new ol.style.Icon({
        		src: 'arrow.png',
        		anchor: [0.75, 0.5],
        		rotateWithView: false,
        		rotation: -rotation,
        		opacity: opacity
      		})
    	})); */

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
