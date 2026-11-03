Ext.ns('LOG.inv.transferenciainterna');

LOG.inv.transferenciainterna.Model = Ext.extend(LOG.lb.documento.Model , {
    constructor: function (config) {
        config.urlController = '/logistica/inventario/movimiento/index.php/transferenciainterna/';
        config.urlAccionGuardar = 'adicionarTransferanciaInterna';
        config.urlAccionAprobar = 'aprobarDocumento';
        config.urlAccionEliminar = 'eliminarProducto';
        this.urlAccionConfirmar = 'confirmarDocumento';
        this.urlAccionAnularEstado = 'anularEstadoDocumento';
        this.urlAccionAprobar = 'aprobarEstadoDocumento';
        this.urlAccionAnular = 'anularDocumento';
        this.urlAccionDuplicar = 'copiarDocumento';
        this.urlAccionFirmar = 'firmarDocumento';
        this.urlAccionSalvarMovimientos = 'adicionarMovimientos';
        this.urlAccionEliminarMovimiento = 'eliminarMovimientos';
        if (!config.fields) {
            config.fields = [];
        }
       /* config.fields.push({
            name: 'retrovirales'
        });
        config.fields.push({
            name: 'idtarjetamedicamento'
        });
        config.fields.push({
            name: 'nrocasoindice'
        });
        config.fields.push({
            name: 'cipaciente'
        });
        config.fields.push({
            name: 'nombreapellidos'
        });
        config.fields.push({
            name: 'dirpaciente'
        });
        config.fields.push({
            name: 'consultoriomedico'
        });*/

        LOG.inv.transferenciainterna.Model.superclass.constructor.call(this, config);
       // this.urlAccionAprobar = 'aprobarTarjetas';
        //this.urlAccionConfirmar = 'confirmarTarjetas';
       // this.urlAccionAnularEstado = 'anularEstadoTarjetas';
        //this.urlAccionEliminar = 'eliminarTarjetas';
        this.urlAccionGuardar = 'adicionarTransferanciaInterna';
        //this.urlAccionAdicionarProductos = 'adicionarProductosTarjeta';
       this.urlAccionEliminarProducto = 'eliminarProductosTransfInterna';

    },
    eliminarProducto: function(arrElimLogica, _fn, loadStore) {
        var _this = this;
        //Pedir confirmacion desde la vista.
        Ext.MessageBox.wait(_this.idioma.msgEliminandoProducto, _this.idioma.msgEspere || '...');
        Ext.Ajax.request({
            url: 'eliminarProductosTransfInterna',
            method: 'POST',
            params: {
                arrelimprodlogica: Ext.encode(arrElimLogica)
            },
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, _this.idioma.msgProductoEliminado);
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)

        });
    },
    eliminarLote: function(parametros, fn) {
        var _this = this;
        //Pedir confirmacion desde la vista.
       /// Ext.MessageBox.wait(this.idioma.msgEliminandoProducto, this.idioma.msgEspere || '...');
            Ext.Ajax.request({
            url:'eliminarLote',
            method: 'POST',
            params: parametros,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    mostrarMensaje(1, 'El(Los) datos ha(n) sido eliminado(s) satisfactoriamente.');
                    if (typeof fn == 'function') {
                        fn.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)

        });
    },
    adicionarProductos: function(parametros, _fn, loadStore) {
        var _this = this;

        Ext.MessageBox.wait(this.idioma.msgAdicionandoProducto, this.idioma.msgEspere || '...');
        var objSubmit = parametros ||{};
        Ext.Ajax.request({
            url: _this.urlController + 'adicionarProductosTarjeta',
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, this.idioma.msgProductoAdicionado);
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)

        });

    },
    salvar: function(parametros, _fn, _fnFail, msgMostrar) {

        if (this.isValid()) {
            Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
            var objSubmit = parametros || {};
            objSubmit.data = Ext.encode(objSubmit.data || this.encode());

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
                            mostrarMensaje(1, msgMostrar || this.idioma.lbMsgObjetoSalvado);
                            if (this.st) {
                                this.st.reload();
                            }
                        }
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [resp]).call();
                        }
                    } else {
                        if (typeof _fnFail == 'function') {
                            _fnFail.createDelegate(this, [resp]).call();
                        }
                    }
                    this.setDefaulFormValues();
                }.createDelegate(this)
            });
        } else {
            mostrarMensaje(3, this.idioma.msgDatosIncorrectos);
        }
    },
    guardarLote: function( params,fn /*record, iddocumento, store, idprodtransfinterna*/){
            Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');

            Ext.Ajax.request({
                url: 'guardarLote',
                method: 'POST',
                params: params /*{
                    record: record,
                    iddocumento: iddocumento,
                    idprodtransfinterna:idprodtransfinterna
                }*/,
                callback: function(o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    this.apply(resp);
                    if (resp.success) {
                        if (typeof fn == 'function') {
                            fn.createDelegate(this).call();
                        }
                        mostrarMensaje(2,this.idioma.lbMsgObjetoSalvado);
                    }
                  //  this.setDefaulFormValues();
                }.createDelegate(this)
            });

    },
    adicionarProductosTransfInterna: function(parametros, store){
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
        Ext.Ajax.request({
            url: _this.urlController + 'adicionarProductosTransfInterna',
            method: 'POST',
            params: parametros,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    store.load();
                    if (s) {
                        mostrarMensaje(1, this.idioma.lbMsgObjetoSalvado);
                    }
                }
            }.createDelegate(this)

        });
    },
    isValid: function() {
        if (this[this.primaryKeyField]) {
            return this.basicForm.isValid() && (this.basicForm.isDirty() || this.gridEditado);
        } else {
            return this.basicForm.isValid();
        }
    },
    cargarLote: function(idtransfinterna, _fn){       
        Ext.MessageBox.wait('Validando datos', this.idioma.msgEspere || '...');
        Ext.Ajax.request({
            url: 'cargarLote',
            method: 'POST',
            params: {
                iddocumento: idtransfinterna
            },
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);               
                if (resp.success) {                        
                    if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [resp.datos]).call();
                    }
                }
            }.createDelegate(this)

        });
    }
});
