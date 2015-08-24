var Hover = function (layer) {
    this.coordinate_ = null;
    this.cursor_ = 'pointer';
    this.feature_ = null;
    this.previousCursor_ = undefined;
    this.layer = layer;

    ol.interaction.Pointer.call(this, {
        handleDownEvent: Hover.prototype.handleDownEvent,
        handleMoveEvent: Hover.prototype.handleMoveEvent,
        handleUpEvent: Hover.prototype.handleUpEvent
    });
};

ol.inherits(Hover, ol.interaction.Pointer);

Hover.prototype.handleDownEvent = function (evt) {
    var feature = evt.map.getFeatureAtPixel(evt.pixel, this.layer);

    if (feature) {
        this.coordinate_ = evt.coordinate;
        this.feature_ = feature;
    }

    return !!feature;
};

Hover.prototype.handleMoveEvent = function (evt) {
    if (this.cursor_) {
        var feature = evt.map.getFeatureAtPixel(evt.pixel, this.layer);
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

Hover.prototype.handleUpEvent = function (evt) {
    this.coordinate_ = null;
    this.feature_ = null;
    return false;
};

OLMM.prototype.enableHoverMode = function (layer) {
    this.map.addInteraction(new Hover());
};
