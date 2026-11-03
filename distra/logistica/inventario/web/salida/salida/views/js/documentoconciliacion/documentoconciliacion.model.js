Ext.ns('LOG.inv.documentoconciliacion');
LOG.inv.documentoconciliacion.Model = Ext.extend(LOG.lb.documento.Model, {
    constructor: function(config) {
        config.urlAccionGuardar = 'adicionarDocumento';
        config.urlController = '/logistica/inventario/salida/salida/index.php/conciliacionlogistica/';
        if (!config.fields) {
            config.fields = [];
        }
        config.fields = [
            {name: 'idconciliacion'},
            {name: 'cliente'}
        ];
        LOG.inv.documentoconciliacion.Model.superclass.constructor.call(this, config);
    },
    crearDocumentoConciliacion: function(parametros, idestructura, _fn) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgCreandoDocumento, this.idioma.msgEspere || '...');
        var objSubmit = {};
        objSubmit.data = Ext.encode(this.encode({conciliacion: parametros}));
        objSubmit.idestructuracomun = Ext.encode(idestructura);
        Ext.Ajax.request({
            url: this.urlController + this.urlAccionGuardar,
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
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
                }
            }.createDelegate(this)
        });
    },
    loadRecord: function(rec) {
        var record = null;
        if (!this.sm.hasSelection()) {
            record = rec;
        } else {
            record = this.sm.getSelected();
        }
        this.apply(record.json);
    }
});