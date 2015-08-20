OLMM.prototype.hoverApp = {};

OLMM.prototype.hoverApp.Hover = function () {

    ol.interaction.Pointer.call(this, {
        handleDownEvent: OLMM.prototype.hoverApp.Hover.prototype.handleDownEvent,
        handleMoveEvent: OLMM.prototype.hoverApp.Hover.prototype.handleMoveEvent,
        handleUpEvent: OLMM.prototype.hoverApp.Hover.prototype.handleUpEvent
    });

    this.coordinate_ = null;
    this.cursor_ = 'pointer';
    this.feature_ = null;
    this.previousCursor_ = undefined;
};

ol.inherits(OLMM.prototype.hoverApp.Hover, ol.interaction.Pointer);

OLMM.prototype.hoverApp.Hover.prototype.handleDownEvent = function (evt) {
    var feature = evt.map.getFeatureAtPixel(evt.pixel);

    if (feature) {
        this.coordinate_ = evt.coordinate;
        this.feature_ = feature;
    }

    return !!feature;
};

OLMM.prototype.hoverApp.Hover.prototype.handleMoveEvent = function (evt) {
    if (this.cursor_) {
        var feature = evt.map.getFeatureAtPixel(evt.pixel);
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

OLMM.prototype.hoverApp.Hover.prototype.handleUpEvent = function (evt) {
    this.coordinate_ = null;
    this.feature_ = null;
    return false;
};

