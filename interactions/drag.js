OLMM.Drag = function (olmm, layer) {
    ol.interaction.Pointer.call(this, {
        handleDownEvent: OLMM.Drag.prototype.handleDownEvent,
        handleDragEvent: OLMM.Drag.prototype.handleDragEvent,
        handleMoveEvent: OLMM.Drag.prototype.handleMoveEvent,
        handleUpEvent: OLMM.Drag.prototype.handleUpEvent
    });

    this.config = olmm.config;
    this.layer = olmm.getLayerByName(layer);
    this.coordinate_ = null;
    this.cursor_ = 'pointer';
    this.feature_ = null;
    this.previousCursor_ = undefined;
};


ol.inherits(OLMM.Drag, ol.interaction.Pointer);


OLMM.Drag.prototype.handleDownEvent = function (evt) {
    var map = evt.map;

    var feature = map.getFeatureAtPixel(evt.pixel, this.layer);
    if (feature) {
        this.coordinate_ = evt.coordinate;
        this.feature_ = feature;
    }

    return !!feature;
};


OLMM.Drag.prototype.handleDragEvent = function (evt) {
    var map = evt.map;

    var deltaX = evt.coordinate[0] - this.coordinate_[0];
    var deltaY = evt.coordinate[1] - this.coordinate_[1];

    var geometry = this.feature_.getGeometry();
    geometry.translate(deltaX, deltaY);

    this.coordinate_[0] = evt.coordinate[0];
    this.coordinate_[1] = evt.coordinate[1];
};


OLMM.Drag.prototype.handleMoveEvent = function (evt) {
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


OLMM.Drag.prototype.handleUpEvent = function (event) {
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
    self.addInteraction(new OLMM.Drag(self, layer))
};

OLMM.prototype.attachDragCallback = function (callback) {
    this.addToConfig('drag_callback', callback);
};