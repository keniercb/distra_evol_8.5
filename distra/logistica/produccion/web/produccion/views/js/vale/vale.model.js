LOG.produccion.valeproduccion.Model = Ext.extend(LOG.produccion.documento.Model, {
    /**
     *
     * @param {type} config
     * @returns {undefined}
     */
    constructor: function (config) { 
        config.fields = [
            {name: 'iddocumento', type: 'int'},
            {name: 'idvaleproduccion', type: 'int'},
            {name: 'idordenproduccion', type: 'int'},
            {name: 'idturnotrabajo', type: 'int'},
            {name: 'cantidad'},
            {name: 'observaciones'}
        ];
        LOG.produccion.valeproduccion.Model.superclass.constructor.call(this, config);
        this.urlController = '/logistica/produccion/produccion/index.php/valeproduccion/';
    },
    /**
     *
     * @returns {Boolean}
     */
    isValid: function() {
        return this.basicForm.isValid();
    },    
    adicionarProducto: function (p) {
        var currentIndex = -1;
        this.listaProductos.each(function (_p, index) {
            if (_p.idindicador == p.idindicador) {
                currentIndex = index;
            }
        });
        var pModel = null;
        if (currentIndex == -1) {
            var pModel = new LOG.util.Model({
                fields: [{
                    name: 'idvaleproducto',
                    primary: true
                },
                    {name: 'idvaleproduccion'},
                    {name: 'idindicador'},
                    {name: 'iddeposito'},
                    {name: 'cantidad'}
                ]
            });
        } else {
            pModel = this.listaProductos.getItem(currentIndex);
        }

        pModel.apply(p);
        this.listaProductos.setItem(pModel, currentIndex);
        console.log(this.listaProductos);
        this.habilitarBotones();
    },/**
    *
    * @param {Object} obj
    * @returns {Object}
    */
   encode: function (obj) {
       obj = obj || this;
       var objTemp = {};
       for (var property in obj) {           
           console.log(obj[property]);
           if (typeof obj[property] != 'function' && this.keys.indexOf(property) == -1) {
               objTemp[property] = obj[property];
           }
       }
       return objTemp;
   },
   aprobarValeProduccion: function (parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectVale);
            return;
        }
        mostrarMensaje(2, "¿Está seguro que desea aprobar el documento seleccionado?", function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgAprobandoObjeto, _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
                objSubmit.fecha = (_this.sm.getSelections()) ? _this.sm.getSelections()[0].data.fechacontable : -1;
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionAprobar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                        if (resp.success) {
                            if (s) {
                                console.info(resp)
                                console.info(resp.success)
                                mostrarMensaje(1, 'El informe de recepci\xf3n #'+resp.success[0].numeroref+' con fecha '+resp.success[0].fechacontable+' se ha generado satisfactoriamente');
                                _this.st.reload();
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)
                });
            }
        });
   }
});