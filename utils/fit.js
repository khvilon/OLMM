(function (module) {

    module.fitToExtent = function (source_name) {
        var self = this;
        this.map.getView().fitExtent(self.getSourceByName(source_name).getExtent(), this.map.getSize());
    };

})(OLMM.prototype);