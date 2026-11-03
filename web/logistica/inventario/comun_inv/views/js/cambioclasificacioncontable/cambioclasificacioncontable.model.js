Ext.ns('LOG.inv.cambioclasificacioncontable');

LOG.inv.cambioclasificacioncontable.Model = Ext.extend(LOG.lb.documento.Model, {
    /**
     * 
     * @param {type} config
     * @returns {undefined}
     */
    constructor: function(config) {
        LOG.inv.cambioclasificacioncontable.Model.superclass.constructor.call(this, config);
    },
    /**
     * Funcion para adicionar un producto al grid cuando este fue editado
     * @param {Object} p
     * @returns {undefined}
     */
    adicionarProducto: function(p) {
        var currentIndex = -1;
        this.listaProductos.each(function(_p, index) {
            if (_p.idmovcambioccontable == p.idmovcambioccontable) {
                currentIndex = index;
            }
        });
        var pModel = null;
        if (currentIndex == -1) {
            var pModel = new LOG.util.Model({
                fields: [{
                        name: 'idmovcambioccontable',
                        primary: true
                    },
                    {name: 'idproducto'},
                    {name: 'idclasificacioncontable'}
                ]
            });
        } else {
            pModel = this.listaProductos.getItem(currentIndex);
        }

        pModel.apply(p);
        this.listaProductos.setItem(pModel, currentIndex);
        this.habilitarBotones();
    },
	
	replicar: function(parametros, _fn){
		var _this = this;
		mostrarMensaje(2, 'Desea replicar los datos hacia todos los productos', function (btn) {
            if (btn == 'ok') {               
                var objSubmit = {
                    idmovimientos: Ext.encode(parametros)
                };
				
                Ext.Ajax.request({
                    url: _this.urlController + 'replicar',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
						if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [resp]).call();
                        }                        
                    }.createDelegate(this)
                });
            }
        }.createDelegate(this));
	}
});