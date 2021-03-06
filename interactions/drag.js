var Drag = function (options) {
    options = options || {};
    var olmm = options['olmm'];
    var layer = options['layer'];

    this.config = olmm.config;
    this.layer = olmm.getLayerByName(layer);
    this.coordinate_ = null;
    this.cursor_ = 'pointer';
    this.feature_ = null;
    this.previousCursor_ = undefined;

    ol.interaction.Pointer.call(this, {
        handleDownEvent: Drag.prototype.handleDownEvent,
        handleDragEvent: Drag.prototype.handleDragEvent,
        handleMoveEvent: Drag.prototype.handleMoveEvent,
        handleUpEvent: Drag.prototype.handleUpEvent
    });
};


ol.inherits(Drag, ol.interaction.Pointer);


Drag.prototype.handleDownEvent = function (evt) {
    var map = evt.map;

    var feature = map.getFeatureAtPixel(evt.pixel, this.layer);
    if (feature) {
        this.coordinate_ = evt.coordinate;
        this.feature_ = feature;
    }

    return !!feature;
};


Drag.prototype.handleDragEvent = function (evt) {
    var deltaX = evt.coordinate[0] - this.coordinate_[0];
    var deltaY = evt.coordinate[1] - this.coordinate_[1];

    var geometry = this.feature_.getGeometry();
    geometry.translate(deltaX, deltaY);

    this.coordinate_[0] = evt.coordinate[0];
    this.coordinate_[1] = evt.coordinate[1];
};


Drag.prototype.handleMoveEvent = function (evt) {
    if (this.cursor_) {
        var map = evt.map;
        var feature = map.getFeatureAtPixel(evt.pixel, this.layer);

        var element = evt.map.getTargetElement();
        if (feature) {
            if (element.style.cursor != this.cursor_) {
                this.previousCursor_ = element.style.cursor;
                element.style.cursor = this.cursor_;
            }
        } else if (this.previousCursor_ !== undefined) {
            element.style.cursor = this.previousCursor_;
            this.previousCursor_ = undefined;
        }
    }
};


Drag.prototype.handleUpEvent = function (event) {
    var feature = this.feature_;
    var callbacks = this.config['drag_callback'] || [];

    callbacks.map(function(callback){
        callback(event, feature.getMainDataWithCloneAndTransform())
    });

    this.coordinate_ = null;
    this.feature_ = null;
    return false;
};


OLMM.prototype.enableDragMode = function (layer) {
    var self = this;
    self.disableActions();
    self.addInteraction(new Drag({'olmm': self, 'layer': layer}))
};


OLMM.prototype.attachDragCallback = function (callback) {
    this.addToConfig('drag_callback', callback);
};
