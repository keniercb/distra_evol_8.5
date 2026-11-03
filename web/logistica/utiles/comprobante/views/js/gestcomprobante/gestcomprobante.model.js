Ext.ns('LOG.lb.comprobante');
LOG.lb.comprobante.Model = Ext.extend(LOG.util.Model, {
    /**
     * @param {type} config
     * @returns {undefined}
     */
    constructor: function (config) {
        this.urlAccionContabilizar = 'generarComrpobante';
        this.urlAccionActualizar = 'postCreateComprobante';
        this.urlAccionActualizarDocs = 'actualizarDocumentos';
        this.urlAccionAnular = 'anularComprobante';
        config.fields = [{
            name: 'iddocumento',
            primary: true
        }];
        LOG.lb.comprobante.Model.superclass.constructor.call(this, config);
    },

        contabilizar: function (parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        var objSubmit = parametros || {};
        objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
        Ext.Ajax.request({
            url: this.urlController + _this.urlAccionContabilizar,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                r.documentosContabilizados = objSubmit.id;
                if (typeof _fn == 'function') {
                    _fn.createDelegate(_this, [o, s, r]).call();
                }
            }.createDelegate(_this)
        });
    },
    anular: function(parametros, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        var documentos = this.sm.getSelections();
        /*mostrarMensaje(2, (documentos.length==1)?this.idioma.msgComprobanteDocumento :this.idioma.msgComprobanteDocumentos , function(btn) {
            if (btn == 'ok') {

            }
        });*/
        //Ext.MessageBox.wait(_this.idioma.msgEspere, _this.idioma.msgComprobanteObjeto || '...');
        var objSubmit = parametros || {};
        objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
        Ext.Ajax.request({
            url: this.urlController + _this.urlAccionAnular,
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                _this.st.reload();
                if (typeof _fn == 'function') {
                    _fn.createDelegate(_this, [o, s, r]).call();
                }
            }.createDelegate(_this)
        });
    },

    actualizarDocumentos: function (idComprobante, numComprobante, fechaComprobante, idDocumento,anticipos) {
        var _this = this;
        var objSubmit = {};
        objSubmit.idComprobante = idComprobante;
        objSubmit.numComprobante = numComprobante;
        objSubmit.fechaComprobante = fechaComprobante;
        /*
         var documentos = this.sm.getSelections();
        Ext.each(documentos, function (d) {
            idDocumentos.push(d.data.iddocumento);
        }, this);
        var idDocumentos = [];

        idDocumentos.push(idDocumento);
        //objSubmit.id = Ext.encode(_this.getSelectedId());
        //objSubmit.id = Ext.encode(idDocumentos);*/
        objSubmit.id = idDocumento;
        objSubmit.anticipos = Ext.encode(anticipos);
        Ext.MessageBox.wait(_this.idioma.msgEspere, _this.idioma.msgActualizandoObjeto || '...');
        Ext.Ajax.request({
            url: this.urlController + _this.urlAccionActualizarDocs,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
            }.createDelegate(_this)
        });
        Ext.Ajax.request({
            url: this.urlController + _this.urlAccionActualizar,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                if (s) {
                    mostrarMensaje(1, _this.idioma.msgComprobanteGenerado + numComprobante + '.');
                    _this.st.reload();
                }
            }.createDelegate(_this)
        });
    }


});
