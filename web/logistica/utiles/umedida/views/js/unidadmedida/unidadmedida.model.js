Ext.ns('LOG.lb.unidadmedida')
LOG.lb.unidadmedida.Model = Ext.extend(LOG.util.Model, {
    /**
     *
     * @param {type} config
     * @returns {undefined}
     */
    indicador:-1,
    constructor: function(config) {
        config.urlAccionEliminar = '/eliminarUMedidaOperativa';
        config.urlAccionGuardar ='/adicionarUMedidaOperativa';
        this.indicador=config.indicador;
        if (!config.fields) {
            config.fields = [];
        }
        config.fields.push({name: 'factorbase' });
        config.fields.push({name: 'idumedidadestino'});
        config.fields.push({name: 'idumedidaorigen'});
        config.fields.push({name: 'idconversionum',primary: true});
        LOG.lb.unidadmedida.Model.superclass.constructor.call(this, config);
    },
    adicionar:function(parametros, _fn,_fnfail) {

        if (this.isValid()) {
            Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
            var objSubmit = parametros || {};
            objSubmit.data = Ext.encode(this.encode());
            objSubmit.id= Ext.encode(this.indicador);
            Ext.Ajax.request({
                url: this.urlController + this.urlAccionGuardar,
                method: 'POST',
                params: objSubmit,
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    
                    this.apply(resp);
                    if (resp.success) {
                        if (s) {
                            mostrarMensaje(1, this.idioma.lbMsgObjetoSalvado);
                            this.st.reload();
                        }
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [resp]).call();
                        }
                    }else{
                           if (typeof _fnfail == 'function') {
                            _fnfail.createDelegate(this, [resp]).call();
                        }
                    }
                }.createDelegate(this)
            });
        } else {
            mostrarMensaje(1, this.idioma.msgDatosIncorrectos)
        }
    }
});
