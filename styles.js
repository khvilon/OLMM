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
	});
  	return styles;
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
