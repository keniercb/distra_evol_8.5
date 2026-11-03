Ext.ns('Ext.Log.ExpTec');

Ext.Log.ExpTec.winMostrarDetalles = Ext.extend(aft.gestindicadores.vActivos, {
    constructor: function (config) {
        var _this = this;

        Ext.apply(this, config);
        this.height = 450;
        this.width = 680;

		Ext.Log.ExpTec.winMostrarDetalles.superclass.constructor.apply(this, arguments);

		_this.getDatosSerie(_this.idregnumerico);			       		
    },
    getDatosSerie: function (idregnumerico) {
    	var _this = this;
    	_this.panelSur = new Ext.Log.ExpTec.PanelSurGrid({
            region: 'south',
            height: 90,
            idioma:_this.etiquetas,
            idregnumerico: idregnumerico                         
        });
        _this.add(_this.panelSur);              
        _this.doLayout(true);                
    }
});