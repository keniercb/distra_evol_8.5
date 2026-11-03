Ext.ns('Gestionar.analisisplanificacion');


Gestionar.analisisplanificacion.Modelo = {
    init: function() {
        _this = this;

        _this.loaderTreeCB = new Ext.tree.TreeLoader({
            dataUrl: 'listarArbolEntidadesCB',
            autoLoad: true
        });
    }
};
