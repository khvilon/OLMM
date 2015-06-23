OLMM.prototype.disableActions = function () {
    var self = this;
    self.disableDeleteMode();
    self.removeSelect();
    self.removeInteraction();
    self.map.getViewport().style.cursor = '';
};

